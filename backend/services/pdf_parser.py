import pdfplumber
import io
from fastapi import UploadFile, HTTPException


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from uploaded PDF resume."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    contents = await file.read()
    
    try:
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF. Please ensure the PDF is not image-only."
            )
        
        return text.strip()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")


def extract_bullet_points(resume_text: str) -> list[str]:
    """Extract bullet points / lines from resume text."""
    lines = resume_text.split("\n")
    bullets = []
    
    bullet_markers = ["•", "-", "●", "▪", "◦", "*", "→"]
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check if line starts with bullet marker or looks like an achievement
        starts_with_bullet = any(line.startswith(m) for m in bullet_markers)
        is_long_enough = len(line) > 30
        has_verb = any(line.lower().startswith(v) for v in [
            "led", "built", "developed", "created", "managed", "designed",
            "implemented", "improved", "increased", "reduced", "launched",
            "architected", "optimized", "collaborated", "delivered", "drove"
        ])
        
        if (starts_with_bullet or has_verb) and is_long_enough:
            # Clean up bullet markers
            for marker in bullet_markers:
                line = line.lstrip(marker).strip()
            bullets.append(line)
    
    return bullets[:10]  # Return top 10 bullets
