from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from services.pdf_parser import extract_text_from_pdf, extract_bullet_points
from services.ai_analyzer import analyze_resume_vs_jd, rewrite_bullets, generate_ats_resume

router = APIRouter()


class AnalysisResponse(BaseModel):
    match_score: int
    score_breakdown: dict
    matched_skills: list
    missing_skills: list
    experience_gaps: list
    rewritten_bullets: list
    learning_roadmap: list
    summary: str
    ats_keywords_missing: list
    resume_text: str  # Raw text for frontend use


class RewriteRequest(BaseModel):
    bullets: list[str]
    jd_text: str

class GenerateResumeRequest(BaseModel):
    resume_text: str
    jd_text: str


@router.post("/", response_model=AnalysisResponse)
async def analyze(
    resume: UploadFile = File(..., description="Resume PDF file"),
    jd_text: str = Form(..., description="Job description text"),
):
    """
    Upload a resume PDF and paste a job description.
    Returns full gap analysis with match score, missing skills, and rewritten bullets.
    """
    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    
    if len(jd_text) < 100:
        raise HTTPException(
            status_code=400,
            detail="Job description seems too short. Please paste the full JD."
        )
    
    # Parse resume PDF
    resume_text = await extract_text_from_pdf(resume)
    
    # Run AI analysis
    analysis = await analyze_resume_vs_jd(resume_text, jd_text)
    
    # Add raw resume text for frontend
    analysis["resume_text"] = resume_text
    
    return analysis


@router.post("/rewrite-bullets")
async def rewrite(request: RewriteRequest):
    """Rewrite specific resume bullets to better match a job description."""
    if not request.bullets:
        raise HTTPException(status_code=400, detail="No bullets provided.")
    
    result = await rewrite_bullets(request.bullets, request.jd_text)
    return result


@router.post("/generate-resume")
async def generate_resume_endpoint(request: GenerateResumeRequest):
    """Generate an ATS-friendly resume."""
    if not request.resume_text or not request.jd_text:
        raise HTTPException(status_code=400, detail="Missing resume text or JD text.")
    
    result = await generate_ats_resume(request.resume_text, request.jd_text)
    return {"generated_resume": result}
