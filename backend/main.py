import os
from dotenv import load_dotenv

# Use absolute path for .env to ensure it's found in background jobs
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, history

app = FastAPI(
    title="HiredEdge API",
    description="AI-powered Resume ↔ Job Description Gap Analyzer",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://hiredge.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
app.include_router(history.router, prefix="/history", tags=["History"])

@app.get("/")
def root():
    return {"message": "HiredEdge API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}
