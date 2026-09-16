import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)


def generate_career_plan(
    target_career: str,
    current_skills: str
):
    prompt = f"""
You are CarePlanix AI Career Planner.

Your task is to create a practical and personalized career plan
for a user based on their target career and current skills.

Return ONLY valid JSON.
Do not add markdown.
Do not add ```json.
Do not add explanations outside the JSON.

Use exactly this JSON structure:

{{
    "target_career": "",
    "career_summary": "",
    "current_strengths": [],
    "skills_to_improve": [],
    "skills_to_learn": [],
    "career_plan": [
        {{
            "phase": "",
            "duration": "",
            "focus": "",
            "skills": [],
            "topics": [],
            "projects": [],
            "actions": []
        }}
    ],
    "recommended_projects": [],
    "portfolio_advice": [],
    "interview_preparation": [],
    "job_search_steps": [],
    "final_goal": ""
}}

Important rules:

- Make the career plan realistic.
- Consider the user's existing skills.
- Do not recommend learning skills they already know unless
  improvement is needed.
- Arrange skills in a logical learning order.
- Include practical projects.
- Include portfolio preparation.
- Include interview preparation.
- Include job preparation.
- Avoid unrealistic timelines.
- Do not invent companies or specific job vacancies.

Target Career:

{target_career}

Current Skills:

{current_skills}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text