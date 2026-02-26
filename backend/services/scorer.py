def validate_and_normalize_analysis(analysis: dict) -> dict:
    """
    Validates and normalizes the AI analysis output.
    Ensures all expected fields are present and within valid ranges.
    """
    # Ensure match_score exists and is an int
    try:
        analysis["match_score"] = int(analysis.get("match_score", 0))
    except (ValueError, TypeError):
        analysis["match_score"] = 0
    
    # Clamp score to 0-100
    analysis["match_score"] = max(0, min(100, analysis["match_score"]))
    
    # Ensure score_breakdown exists
    if "score_breakdown" not in analysis or not isinstance(analysis["score_breakdown"], dict):
        analysis["score_breakdown"] = {
            "skills": 0,
            "experience": 0,
            "keywords": 0,
            "education": 0
        }
    else:
        # Normalize sub-scores
        for key in ["skills", "experience", "keywords", "education"]:
            val = analysis["score_breakdown"].get(key, 0)
            try:
                analysis["score_breakdown"][key] = max(0, min(100, int(val)))
            except (ValueError, TypeError):
                analysis["score_breakdown"][key] = 0
                
    # Ensure lists exist
    list_fields = [
        "matched_skills", "missing_skills", "experience_gaps", 
        "rewritten_bullets", "learning_roadmap", "ats_keywords_missing"
    ]
    for field in list_fields:
        if field not in analysis or not isinstance(analysis[field], list):
            analysis[field] = []
            
    # Ensure summary exists
    if "summary" not in analysis or not isinstance(analysis["summary"], str):
        analysis["summary"] = "AI assessment summary unavailable."
        
    return analysis
