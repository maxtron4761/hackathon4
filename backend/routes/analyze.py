"""
API routes for Reality Debugger analysis endpoints.
"""

from __future__ import annotations

import logging
import time

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from services import deepfake_detector, misinfo_detector, url_analyzer

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


# ── Request / Response schemas ──────────────────────────


class TextRequest(BaseModel):
    text: str


class UrlRequest(BaseModel):
    url: str


# ── Health ──────────────────────────────────────────────


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "models": {
            "deepfake_detector": deepfake_detector.is_loaded(),
            "misinfo_detector": misinfo_detector.is_loaded(),
        },
    }


# ── Text analysis ──────────────────────────────────────


@router.post("/analyze/text")
def analyze_text(body: TextRequest):
    if not body.text or len(body.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text must be at least 10 characters")

    start = time.time()
    result = misinfo_detector.analyze_claims(body.text)
    elapsed = round(time.time() - start, 3)

    return {
        "success": True,
        "elapsed_seconds": elapsed,
        "result": result,
    }


# ── Image analysis ─────────────────────────────────────


@router.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    # Validate file type
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image (JPEG, PNG, WebP)")

    data = await file.read()
    if len(data) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=400, detail="Image must be under 10 MB")

    start = time.time()
    result = deepfake_detector.predict_from_bytes(data)
    elapsed = round(time.time() - start, 3)

    return {
        "success": True,
        "elapsed_seconds": elapsed,
        "filename": file.filename,
        "result": result,
    }


# ── URL analysis ───────────────────────────────────────


@router.post("/analyze/url")
def analyze_url(body: UrlRequest):
    if not body.url or not body.url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="Provide a valid HTTP(S) URL")

    try:
        start = time.time()
        result = url_analyzer.analyze(body.url)
        elapsed = round(time.time() - start, 3)

        return {
            "success": True,
            "elapsed_seconds": elapsed,
            "result": result,
        }
    except Exception as e:
        logger.exception("URL analysis failed for %s", body.url)
        raise HTTPException(status_code=502, detail=f"Failed to analyse URL: {e}")
