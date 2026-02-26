import os
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from supabase import create_client, Client
from typing import Optional

router = APIRouter()


def get_supabase() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key or "your-supabase-anon-key" in key:
        return None
    return create_client(url, key)


class SaveAnalysisRequest(BaseModel):
    job_title: str
    company: str
    match_score: int
    analysis_data: dict
    user_id: Optional[str] = None


@router.get("/")
async def get_history(user_id: Optional[str] = None):
    """Get all saved analyses, optionally filtered by user_id."""
    supabase = get_supabase()
    if not supabase:
        return {"analyses": [], "warning": "Database unconfigured."}
    
    query = supabase.table("analyses").select("*").order("created_at", desc=True)
    
    if user_id:
        query = query.eq("user_id", user_id)
    
    result = query.limit(20).execute()
    return {"analyses": result.data}


@router.post("/")
async def save_analysis(request: SaveAnalysisRequest):
    """Save an analysis result for future reference."""
    supabase = get_supabase()
    if not supabase:
        return {"success": False, "message": "Database not configured for demo."}
    
    data = {
        "job_title": request.job_title,
        "company": request.company,
        "match_score": request.match_score,
        "analysis_data": request.analysis_data,
        "user_id": request.user_id,
    }
    
    result = supabase.table("analyses").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save analysis.")
    
    return {"success": True, "id": result.data[0]["id"]}


@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """Delete a saved analysis."""
    supabase = get_supabase()
    if not supabase:
         return {"success": False}
         
    result = supabase.table("analyses").delete().eq("id", analysis_id).execute()
    return {"success": True}
