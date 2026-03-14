"""
URL / Webpage Analyzer
──────────────────────
Scrapes a webpage, extracts text + images, and runs both
the misinformation detector and deepfake detector on them.
"""

from __future__ import annotations

import io
import logging
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from PIL import Image

from config import MAX_SCRAPE_IMAGES, REQUEST_TIMEOUT, USER_AGENT
from services import deepfake_detector, misinfo_detector

logger = logging.getLogger(__name__)


def _fetch_page(url: str) -> BeautifulSoup:
    """Download and parse a webpage."""
    headers = {"User-Agent": USER_AGENT}
    resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")


def _extract_text(soup: BeautifulSoup) -> str:
    """Pull article-like text from the page."""
    # Try common article containers first
    for selector in ["article", "[role='main']", "main", ".post-content", ".entry-content"]:
        container = soup.select_one(selector)
        if container:
            return container.get_text(separator=" ", strip=True)

    # Fallback: grab all <p> tags
    paragraphs = soup.find_all("p")
    text = " ".join(p.get_text(strip=True) for p in paragraphs)
    return text or soup.get_text(separator=" ", strip=True)[:5000]


def _extract_image_urls(soup: BeautifulSoup, base_url: str) -> list[str]:
    """Find prominent images on the page."""
    urls: list[str] = []
    for img in soup.find_all("img", src=True):
        src = img["src"]
        # Skip tiny icons / tracking pixels
        width = img.get("width", "")
        height = img.get("height", "")
        if width and width.isdigit() and int(width) < 80:
            continue
        if height and height.isdigit() and int(height) < 80:
            continue

        full_url = urljoin(base_url, src)
        if full_url not in urls:
            urls.append(full_url)

        if len(urls) >= MAX_SCRAPE_IMAGES:
            break
    return urls


def _download_image(url: str) -> Image.Image | None:
    """Download an image from a URL, return PIL Image or None."""
    try:
        headers = {"User-Agent": USER_AGENT}
        resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return Image.open(io.BytesIO(resp.content))
    except Exception as e:
        logger.warning("Failed to download image %s: %s", url, e)
        return None


def analyze(url: str) -> dict:
    """
    Full-pipeline analysis of a webpage.

    Returns
    -------
    {
        "url": str,
        "title": str,
        "text_analysis": { ... misinfo results ... },
        "image_analyses": [ { "url": str, "result": deepfake result } ],
        "summary": str
    }
    """
    soup = _fetch_page(url)

    title = soup.title.string.strip() if soup.title and soup.title.string else url

    # ── Text analysis ───────────────────────────────────
    text = _extract_text(soup)
    text_analysis = None
    if text and len(text) > 30:
        text_analysis = misinfo_detector.analyze_claims(text[:3000])

    # ── Image analysis ──────────────────────────────────
    image_urls = _extract_image_urls(soup, url)
    image_analyses = []
    for img_url in image_urls:
        img = _download_image(img_url)
        if img is not None:
            result = deepfake_detector.predict(img)
            image_analyses.append({"url": img_url, "result": result})

    # ── Summary ─────────────────────────────────────────
    issues: list[str] = []
    if text_analysis:
        tl = text_analysis["overall"]["threat_level"]
        if tl in ("danger", "warning"):
            issues.append(f"Text content flagged as {tl}")
    fake_images = [ia for ia in image_analyses if ia["result"]["label"] == "Fake"]
    if fake_images:
        issues.append(f"{len(fake_images)} potentially manipulated image(s) detected")

    if issues:
        summary = "⚠️ Issues found: " + "; ".join(issues)
    else:
        summary = "✓ No significant issues detected on this page"

    return {
        "url": url,
        "title": title,
        "text_analysis": text_analysis,
        "image_analyses": image_analyses,
        "summary": summary,
    }
