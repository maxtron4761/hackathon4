"""
Reality Debugger — Backend Server
═════════════════════════════════
FastAPI application that serves AI-powered deepfake detection
and misinformation analysis using Hugging Face models.

Run:  python main.py
      or: uvicorn main:app --reload
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS, HOST, PORT
from routes.analyze import router as analyze_router
from services import deepfake_detector, misinfo_detector

# ── Logging ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("reality-debugger")


# ── Lifespan: pre-load models on startup ────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting Reality Debugger backend …")
    logger.info("Loading AI models — this may take a minute on first run …")

    # Load both models at startup so first request is fast
    deepfake_detector.load_model()
    misinfo_detector.load_model()

    logger.info("═" * 50)
    logger.info("  Reality Debugger backend is READY")
    logger.info("  Docs:  http://localhost:%s/docs", PORT)
    logger.info("═" * 50)

    yield  # app is running

    logger.info("Shutting down …")


# ── App ─────────────────────────────────────────────────

app = FastAPI(
    title="Reality Debugger API",
    description="AI-powered deepfake detection & misinformation analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(analyze_router)


# ── Root redirect to docs ──────────────────────────────


@app.get("/")
def root():
    return {
        "name": "Reality Debugger API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": [
            "POST /api/analyze/text",
            "POST /api/analyze/image",
            "POST /api/analyze/url",
            "GET  /api/health",
        ],
    }


# ── Entry point ─────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
