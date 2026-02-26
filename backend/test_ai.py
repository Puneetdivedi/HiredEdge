import asyncio
import os
import sys

# add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ai_analyzer import analyze_resume_vs_jd

async def test():
    resume = "I am a software engineer with 5 years of Python experience."
    jd = "Looking for a software engineer with 3+ years of Python and React experience."
    result = await analyze_resume_vs_jd(resume, jd)
    print("Result:")
    print(result)

if __name__ == "__main__":
    asyncio.run(test())
