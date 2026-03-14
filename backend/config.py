"""
Reality Debugger — Backend Configuration
"""
import torch

# ── Device ──────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ── Hugging Face Model IDs ──────────────────────────────
DEEPFAKE_MODEL_ID = "prithivMLmods/Deep-Fake-Detector-v2-Model"
MISINFO_MODEL_ID  = "Pulk17/Fake-News-Detection"

# ── Server ──────────────────────────────────────────────
HOST = "0.0.0.0"
PORT = 8000

# ── CORS (allow Vite dev server) ────────────────────────
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# ── Analysis thresholds ─────────────────────────────────
CONFIDENCE_HIGH   = 0.80   # ≥ 80 % → strong signal
CONFIDENCE_MEDIUM = 0.50   # ≥ 50 % → moderate signal

# ── URL scraping ────────────────────────────────────────
MAX_SCRAPE_IMAGES = 5      # max images to analyse per URL
REQUEST_TIMEOUT   = 10     # seconds
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)
