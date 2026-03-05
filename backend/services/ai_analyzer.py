import os
import json
import asyncio
from openai import AsyncOpenAI
import google.generativeai as genai
from services.scorer import validate_and_normalize_analysis
from utils.prompts import (
    ANALYSIS_SYSTEM_PROMPT,
    ANALYSIS_USER_PROMPT,
    REWRITE_SYSTEM_PROMPT,
    REWRITE_USER_PROMPT,
    RESUME_GEN_SYSTEM_PROMPT,
    RESUME_GEN_USER_PROMPT,
)
from dotenv import load_dotenv

# Use absolute path for .env
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

# Clients initialized lazily
_openai_client = None
_gemini_configured = False

def get_openai_client():
    global _openai_client
    key = os.getenv("OPENAI_API_KEY")
    if not _openai_client and key and "your-openai-key" not in key:
        _openai_client = AsyncOpenAI(api_key=key)
    return _openai_client

def configure_gemini():
    global _gemini_configured
    key = os.getenv("GOOGLE_API_KEY")
    if key and "your-key-here" not in key:
        if not _gemini_configured:
            print(f"DEBUG: Configuring Gemini with key: {key[:10]}...")
            genai.configure(api_key=key)
            _gemini_configured = True
        return True
    else:
        print("DEBUG: Google API Key missing or placeholder.")
        return False


async def analyze_resume_vs_jd(resume_text: str, jd_text: str) -> dict:
    """
    Core analysis: compare resume against job description.
    Uses OpenAI GPT-4o by default, falls back to Gemini if configured, or Mock data.
    """
    prompt = ANALYSIS_USER_PROMPT.format(
        resume_text=resume_text[:6000],
        jd_text=jd_text[:3000],
    )

    # 1. Try OpenAI
    client = get_openai_client()
    if client:
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            return validate_and_normalize_analysis(json.loads(response.choices[0].message.content))
        except Exception as e:
            print(f"OpenAI Error: {e}")

    # 2. Try Google Gemini (Free Tier)
    if configure_gemini():
        try:
            print("DEBUG: Attempting Gemini analysis...")
            model = genai.GenerativeModel("gemini-1.5-flash")
            full_prompt = f"{ANALYSIS_SYSTEM_PROMPT}\n\n{prompt}"
            response = await asyncio.to_thread(model.generate_content, full_prompt)
            # Find JSON in response
            text = response.text
            print(f"DEBUG: Gemini raw response received ({len(text)} chars)")
            start = text.find("{")
            end = text.rfind("}") + 1
            return validate_and_normalize_analysis(json.loads(text[start:end]))
        except Exception as e:
            print(f"DEBUG: Gemini Error: {e}")

    # 3. Fallback: Mock Analysis for demo purposes
    return get_mock_analysis()


async def rewrite_bullets(bullets: list[str], jd_text: str) -> dict:
    """Rewrite bullets using available AI model."""
    bullets_text = "\n".join(f"- {b}" for b in bullets)
    prompt = REWRITE_USER_PROMPT.format(jd_text=jd_text[:3000], bullets=bullets_text)

    client = get_openai_client()
    if client:
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": REWRITE_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.4,
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)
        except:
            pass

    return {"rewritten": [{"original": b, "rewritten": b + " (Mock Improved)", "improvement": "Added mock metric."} for b in bullets]}


async def generate_ats_resume(resume_text: str, jd_text: str) -> str:
    """Generate a 1-page ATS-friendly resume based on JD."""
    prompt = RESUME_GEN_USER_PROMPT.format(
        resume_text=resume_text[:6000],
        jd_text=jd_text[:3000]
    )

    client = get_openai_client()
    if client:
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": RESUME_GEN_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.5,
            )
            return response.choices[0].message.content.strip()
        except:
            pass

    # Fallback to Gemini
    if configure_gemini():
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            full_prompt = f"{RESUME_GEN_SYSTEM_PROMPT}\n\n{prompt}"
            response = await asyncio.to_thread(model.generate_content, full_prompt)
            # Clean up markdown formatting if the model wrapped it
            text = response.text.strip()
            if text.startswith("```markdown"):
                text = text[len("```markdown"):].strip()
            if text.startswith("```"):
                text = text[len("```"):].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
            return text
        except Exception as e:
            print(f"DEBUG: Gemini Error in resume gen: {e}")

    return "# Mock Generated Resume\n\n*This is a mock because no API keys were found.*\n\n## Professional Summary\nExperienced professional..."


def get_mock_analysis():
    """Returns a realistic mock JSON for testing when no API keys are present."""
    return {
        "match_score": 75,
        "score_breakdown": {"skills": 80, "experience": 70, "keywords": 65, "education": 90},
        "matched_skills": ["Python", "React", "FastAPI"],
        "missing_skills": [{"skill": "Docker", "importance": "important", "context": "JD requires containerization knowledge."}],
        "experience_gaps": [{"gap": "Cloud deployment experience missing.", "severity": "medium"}],
        "rewritten_bullets": [],
        "learning_roadmap": [{"step": 1, "action": "Learn Docker basics", "timeframe": "1 week", "resource": "Official Docker docs"}],
        "summary": "This is a MOCK ANALYSIS because no API keys were found. Get a free Google Gemini key to see real results!",
        "ats_keywords_missing": ["Microservices", "CI/CD"]
    }
