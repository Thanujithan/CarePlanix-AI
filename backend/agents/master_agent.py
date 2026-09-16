import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env")


client = genai.Client(api_key=api_key)


def analyze_complete_career_profile(resume_text: str):

    prompt = f"""
You are CarePlanix AI, a professional AI career guidance system.

Analyze the candidate's resume ONCE and produce a complete career
analysis.

You must perform these seven tasks:

1. Resume Analysis
2. Skill Analysis
3. Career Recommendation
4. Skill Gap Analysis
5. Learning Roadmap
6. Job Role Matching
7. Sri Lanka Company Recommendations

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
Do not include any text outside the JSON.

Use EXACTLY this JSON structure:

{{
  "analysis": {{
    "personal_information": {{
      "name": "",
      "email": "",
      "phone": "",
      "location": ""
    }},
    "education": [
      {{
        "degree": "",
        "institution": "",
        "duration": ""
      }}
    ],
    "technical_skills": [],
    "projects": [],
    "experience": [],
    "career_interests": [],
    "skill_level": {{
      "programming": "",
      "web_development": "",
      "database": "",
      "ai_ml": "",
      "other": ""
    }},
    "weak_skills": [],
    "recommended_skills": [],
    "career_recommendations": []
  }},

  "skill_analysis": {{
    "strong_skills": [],
    "intermediate_skills": [],
    "weak_skills": [],
    "programming_languages": [],
    "frameworks": [],
    "databases": [],
    "ai_ml_skills": [],
    "devops_cloud_skills": [],
    "recommended_skills": []
  }},

  "career_analysis": {{
    "top_career": {{
      "title": "",
      "reason": "",
      "match_percentage": 0
    }},
    "alternative_careers": [
      {{
        "title": "",
        "reason": "",
        "match_percentage": 0
      }}
    ],
    "skills_needed_for_top_career": [],
    "next_steps": []
  }},

  "skill_gap_analysis": {{
    "target_career": "",
    "skill_gaps": [
      {{
        "skill": "",
        "current_level": "",
        "required_level": "",
        "priority": "",
        "reason": ""
      }}
    ],
    "soft_skill_gaps": [],
    "learning_order": [],
    "job_readiness_percentage": 0
  }},

  "roadmap": {{
    "target_career": "",
    "roadmap": [
      {{
        "phase": "",
        "duration": "",
        "skills": [],
        "topics": [],
        "projects": [],
        "practice": []
      }}
    ],
    "portfolio_projects": [],
    "interview_preparation": [],
    "job_preparation": []
  }},

  "job_matches": {{
    "recommended_roles": [
      {{
        "job_title": "",
        "job_type": "Internship",
        "match_percentage": 0,
        "matching_skills": [],
        "missing_skills": [],
        "reason": ""
      }}
    ],
    "top_role": "",
    "application_advice": []
  }},

  "company_matches": {{
    "country": "Sri Lanka",

    "recommended_companies": [
      {{
        "company_name": "",
        "location": "",
        "industry": "",
        "suitable_role": "",
        "employment_level": "",
        "match_percentage": 0,
        "matching_skills": [],
        "skills_to_improve": [],
        "reason": ""
      }}
    ],

    "recommended_job_types": [],
    "search_advice": []
  }}
}}

Important rules:

GENERAL:
- Base the analysis only on information reasonably supported by the resume.
- Do not invent qualifications, skills, experience or education.
- Career match percentages are AI-generated estimates.
- Job readiness percentage is an AI-generated estimate.
- Company match percentages are AI-generated estimates.
- Do not claim percentages are formal professional assessments.

CAREER:
- Recommend realistic career paths.
- Use Beginner, Intermediate or Advanced when describing skill levels.
- Skill-gap priority must be High, Medium or Low.

JOB MATCHING:
- Recommend up to 5 realistic job or internship role types.
- Do not invent live job vacancies.
- Job roles must be appropriate for the candidate's current skills,
  education and experience.

ROADMAP:
- Make the roadmap practical and logically ordered.
- Include realistic portfolio projects.
- Include interview preparation.
- Include job preparation.

SRI LANKA COMPANY RECOMMENDATIONS:
- Recommend up to 6 suitable companies that operate in Sri Lanka.
- Recommend companies relevant to the candidate's skills,
  career direction and recommended job roles.
- suitable_role must be realistic for the candidate.
- employment_level should be appropriate, such as:
  Internship, Entry Level, Junior or Associate.
- match_percentage must be between 0 and 100.
- Company match percentages are only AI-generated estimates.
- Do NOT claim that a recommended company is currently hiring.
- Do NOT invent specific vacancies.
- Do NOT invent salary information.
- Do NOT guarantee employment.
- Do NOT invent a company.
- If you are uncertain whether a company operates in Sri Lanka,
  do not include it.
- Company recommendations are places the candidate may consider
  researching for suitable opportunities.
- Clearly distinguish company recommendations from live vacancies.

OUTPUT:
- Keep the response concise enough to fit comfortably in one
  model response.
- Return all seven sections.
- Return valid JSON only.

RESUME:

{resume_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    if not response.text:
        raise ValueError(
            "CarePlanix AI returned an empty response"
        )

    raw_text = response.text.strip()

    # Extra protection in case Gemini adds markdown fences
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]

    elif raw_text.startswith("```"):
        raw_text = raw_text[3:]

    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]

    raw_text = raw_text.strip()

    try:
        result = json.loads(raw_text)

    except json.JSONDecodeError as e:
        print("Invalid Gemini JSON:")
        print(raw_text)

        raise ValueError(
            f"CarePlanix AI returned invalid JSON: {str(e)}"
        )

    # Make sure all required sections exist
    required_sections = [
        "analysis",
        "skill_analysis",
        "career_analysis",
        "skill_gap_analysis",
        "roadmap",
        "job_matches",
        "company_matches",
    ]

    for section in required_sections:
        if section not in result:
            raise ValueError(
                f"Missing AI response section: {section}"
            )

    return result