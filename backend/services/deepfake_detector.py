"""
Deepfake Image Detector
────────────────────────
Uses prithivMLmods/Deep-Fake-Detector-v2-Model (Vision Transformer)
to classify images as Real or Fake.
"""

from __future__ import annotations

import io
import logging
from typing import Any

from PIL import Image
from transformers import pipeline

from config import DEEPFAKE_MODEL_ID, DEVICE

logger = logging.getLogger(__name__)

_pipe: Any | None = None


def load_model() -> None:
    """Download / cache the model and warm it up."""
    global _pipe
    if _pipe is not None:
        return
    logger.info("Loading deepfake detector: %s …", DEEPFAKE_MODEL_ID)
    _pipe = pipeline(
        "image-classification",
        model=DEEPFAKE_MODEL_ID,
        device=0 if DEVICE == "cuda" else -1,
    )
    logger.info("Deepfake detector ready ✓")


def is_loaded() -> bool:
    return _pipe is not None


def predict(image: Image.Image) -> dict:
    """
    Classify a single PIL image.

    Returns
    -------
    {
        "label": "Real" | "Fake",
        "confidence": float (0-1),
        "all_scores": { "Real": float, "Fake": float }
    }
    """
    if _pipe is None:
        raise RuntimeError("Model not loaded — call load_model() first")

    # Ensure RGB
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize to 224×224 (model expects this)
    image = image.resize((224, 224))

    results = _pipe(image)

    # Build score map  { "Real": 0.87, "Fake": 0.13 }
    scores: dict[str, float] = {}
    for item in results:
        label = item["label"]
        scores[label] = round(item["score"], 4)

    # Pick the top label
    top = max(results, key=lambda x: x["score"])

    return {
        "label": top["label"],
        "confidence": round(top["score"], 4),
        "all_scores": scores,
    }


def predict_from_bytes(data: bytes) -> dict:
    """Convenience wrapper: accepts raw image bytes."""
    image = Image.open(io.BytesIO(data))
    return predict(image)
