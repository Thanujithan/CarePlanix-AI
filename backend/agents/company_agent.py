import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")

client = genai.Client(api_key=api_key)


def recommend_companies(
    resume_analysis: str,
    skill_analysis: str,
    career_analysis: str,
    job_matches: str
):

    prompt = f"""
You are the Sri Lanka Company Recommendation Agent
for CarePlanix AI.

Analyze the candidate's resume, skills, career direction,
and recommended job roles.

Your task is to suggest suitable companies in Sri Lanka
where the candidate may consider exploring career or
internship opportunities.

IMPORTANT:
These are COMPANY RECOMMENDATIONS only.
Do NOT claim that a company currently has a vacancy.
Do NOT invent live job openings.
Do NOT invent salary information.
Do NOT claim the candidate is guaranteed employment.

Return ONLY valid JSON.
Do not add markdown.
Do not add ```json.
Do not add explanations outside JSON.

Use exactly this JSON structure:

{
    "country": "Sri Lanka",

    "recommended_companies": [
        {
            "company_name": "",
            "location": "",
            "industry": "",
            "suitable_role": "",
            "employment_level": "",
            "match_percentage": 0,
            "matching_skills": [],
            "skills_to_improve": [],
            "reason": ""
        }
    ],

    "recommended_job_types": [],

    "search_advice": []
}

Rules:

- Recommend a maximum of 6 companies.
- Companies must operate in Sri Lanka.
- Recommend companies relevant to the candidate's
  technical skills and career direction.
- suitable_role should be realistic for the candidate.
- employment_level may be:
  Internship,
  Entry Level,
  Junior,
  Associate,
  or another appropriate level.
- match_percentage must be between 0 and 100.
- match_percentage is only an AI-generated estimate.
- Do not represent it as an official company assessment.
- Do not claim the company is currently hiring.
- Do not create fake vacancies.
- If you are uncertain about a company, do not include it.

Resume Analysis:

{resume_analysis}

Skill Analysis:

{skill_analysis}

Career Analysis:

{career_analysis}

Job Role Analysis:

{job_matches}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text