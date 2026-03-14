"""
Misinformation / Fake-News Text Detector
─────────────────────────────────────────
Uses Pulk17/Fake-News-Detection (BERT-based) to classify text
as credible or likely misinformation.
"""

from __future__ import annotations

import logging
import re
from typing import Any

from transformers import pipeline

from config import MISINFO_MODEL_ID, DEVICE, CONFIDENCE_HIGH, CONFIDENCE_MEDIUM

logger = logging.getLogger(__name__)

_pipe: Any | None = None


def load_model() -> None:
    """Download / cache the model and warm it up."""
    global _pipe
    if _pipe is not None:
        return
    logger.info("Loading misinfo detector: %s …", MISINFO_MODEL_ID)
    _pipe = pipeline(
        "text-classification",
        model=MISINFO_MODEL_ID,
        device=0 if DEVICE == "cuda" else -1,
        truncation=True,
        max_length=512,
    )
    logger.info("Misinfo detector ready ✓")


def is_loaded() -> bool:
    return _pipe is not None


# ── helpers ─────────────────────────────────────────────


def _split_claims(text: str) -> list[str]:
    """
    Split a body of text into individual claim-like sentences.
    Falls back to the whole text if splitting yields nothing useful.
    """
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    # Filter out very short fragments
    claims = [s.strip() for s in sentences if len(s.strip()) > 20]
    return claims if claims else [text.strip()]


def _verdict(label: str, score: float) -> str:
    """Human-readable verdict string."""
    is_fake = label.upper() in ("FAKE", "LABEL_0")

    if is_fake:
        if score >= CONFIDENCE_HIGH:
            return "⚠️ Likely False — High confidence this is misinformation"
        if score >= CONFIDENCE_MEDIUM:
            return "⚡ Misleading — Moderate signs of misinformation detected"
        return "🔍 Questionable — Some indicators of unreliable content"
    else:
        if score >= CONFIDENCE_HIGH:
            return "✓ Verified — High confidence this is credible"
        if score >= CONFIDENCE_MEDIUM:
            return "✓ Likely Credible — Moderate confidence"
        return "🔍 Inconclusive — Cannot determine reliability"


def _threat_level(label: str, score: float) -> str:
    is_fake = label.upper() in ("FAKE", "LABEL_0")
    if is_fake:
        if score >= CONFIDENCE_HIGH:
            return "danger"
        if score >= CONFIDENCE_MEDIUM:
            return "warning"
        return "warning"
    return "safe"


# ── public API ──────────────────────────────────────────


def predict(text: str) -> dict:
    """
    Classify a single piece of text.

    Returns
    -------
    {
        "label": "REAL" | "FAKE",
        "confidence": float 0-1,
        "confidence_pct": int 0-100,
        "verdict": str,
        "threat_level": "safe" | "warning" | "danger"
    }
    """
    if _pipe is None:
        raise RuntimeError("Model not loaded — call load_model() first")

    results = _pipe(text)
    top = results[0]
    label = top["label"]
    score = top["score"]

    # Normalise label names (some models use LABEL_0/LABEL_1)
    normalised_label = "FAKE" if label.upper() in ("FAKE", "LABEL_0") else "REAL"

    # Confidence percentage: for FAKE → low is bad, for REAL → high is good
    if normalised_label == "FAKE":
        confidence_pct = max(0, min(100, int((1 - score) * 100)))
    else:
        confidence_pct = max(0, min(100, int(score * 100)))

    return {
        "label": normalised_label,
        "confidence": round(score, 4),
        "confidence_pct": confidence_pct,
        "verdict": _verdict(label, score),
        "threat_level": _threat_level(label, score),
    }


def analyze_claims(text: str) -> dict:
    """
    Split text into claims and classify each one.

    Returns
    -------
    {
        "overall": { ... predict() result for full text ... },
        "claims": [
            { "text": str, "analysis": { ... predict() ... } },
            ...
        ]
    }
    """
    overall = predict(text)

    claims_text = _split_claims(text)
    claims = []
    for claim in claims_text:
        analysis = predict(claim)
        claims.append({"text": claim, "analysis": analysis})

    return {"overall": overall, "claims": claims}
