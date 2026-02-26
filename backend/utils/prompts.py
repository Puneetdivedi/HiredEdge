ANALYSIS_SYSTEM_PROMPT = """
You are HiredEdge, an expert career coach and ATS (Applicant Tracking System) specialist.
Your job is to analyze a candidate's resume against a job description and provide detailed, actionable feedback.

You always respond with valid JSON only. No markdown, no extra text.
"""

ANALYSIS_USER_PROMPT = """
Analyze the following resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{jd_text}

Return a JSON object with this exact structure:
{{
  "match_score": <integer 0-100>,
  "score_breakdown": {{
    "skills": <integer 0-100>,
    "experience": <integer 0-100>,
    "keywords": <integer 0-100>,
    "education": <integer 0-100>
  }},
  "matched_skills": [<list of skills/keywords found in both resume and JD>],
  "missing_skills": [
    {{
      "skill": "<skill name>",
      "importance": "<critical|important|nice-to-have>",
      "context": "<why this skill matters for this role>"
    }}
  ],
  "experience_gaps": [
    {{
      "gap": "<description of experience gap>",
      "severity": "<high|medium|low>"
    }}
  ],
  "rewritten_bullets": [
    {{
      "original": "<original bullet from resume>",
      "rewritten": "<improved bullet that incorporates JD keywords and impact>",
      "improvement": "<brief note on what changed>"
    }}
  ],
  "learning_roadmap": [
    {{
      "step": <integer starting at 1>,
      "action": "<specific actionable task>",
      "timeframe": "<e.g. 1 week, 2-3 weeks>",
      "resource": "<suggested resource, course, or project>"
    }}
  ],
  "summary": "<2-3 sentence honest assessment of candidacy and top priorities>",
  "ats_keywords_missing": [<list of important ATS keywords not in resume>]
}}
"""


REWRITE_SYSTEM_PROMPT = """
You are an expert resume writer. Rewrite resume bullet points to be more impactful,
quantified, and aligned with a target job description. Use strong action verbs.
Always respond with valid JSON only.
"""

REWRITE_USER_PROMPT = """
Rewrite these resume bullets to better align with this job description.

JOB DESCRIPTION CONTEXT:
{jd_text}

BULLETS TO REWRITE:
{bullets}

Return JSON:
{{
  "rewritten": [
    {{
      "original": "<original>",
      "rewritten": "<improved version>",
      "improvement": "<what changed and why>"
    }}
  ]
}}
"""

RESUME_GEN_SYSTEM_PROMPT = """
You are an expert executive recruiter and ATS (Applicant Tracking System) specialist.
Your task is to generate a highly professional, 1-page ATS-friendly resume in Markdown format.
You must use the candidate's existing experience and skills, but tailor them specifically to match the target job description.
Do not invent fake experience or jobs, but rephrase and emphasize existing points to align perfectly with the JD.
Return ONLY the raw Markdown text of the resume. No other introductory or concluding text. Do not wrap in ```markdown ... ``` tags unless necessary, but preferably just raw markdown that can be formatted nicely.
"""

RESUME_GEN_USER_PROMPT = """
Target Job Description:
{jd_text}

Candidate's Current Resume/Information:
{resume_text}

Generate a 1-page ATS-friendly resume in Markdown format tailored to the Job Description above. Follow these guidelines:
1. Include a clear Header (Name, Contact placeholders like [Phone] [Email] [LinkedIn]).
2. Write a strong, tailored Professional Summary (3-4 lines).
3. Emphasize the Skills Section, explicitly incorporating relevant keywords from the JD that the candidate possesses.
4. Format the Professional Experience section clearly (Company, Role, Dates) and use bullet points starting with strong action verbs. Highlight achievements and metrics over simple duties.
5. Include an Education section at the bottom.
Make it clean, readable, and highly optimized for ATS parsers.
"""
