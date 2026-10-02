import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from pydantic import BaseModel


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY not found in environment variables"
    )


# =========================================================
# GEMINI CLIENT
# =========================================================

client = genai.Client(
    api_key=api_key
)


# =========================================================
# RESPONSE SCHEMA
# =========================================================


class PersonalInformation(BaseModel):
    name: str
    email: str
    phone: str
    location: str


class EducationItem(BaseModel):
    degree: str
    institution: str
    duration: str


class SkillLevel(BaseModel):
    programming: str
    web_development: str
    database: str
    ai_ml: str
    other: str


class ResumeAnalysis(BaseModel):
    personal_information: PersonalInformation
    education: list[EducationItem]

    technical_skills: list[str]
    projects: list[str]
    experience: list[str]
    career_interests: list[str]

    skill_level: SkillLevel

    weak_skills: list[str]
    recommended_skills: list[str]
    career_recommendations: list[str]


class SkillAnalysis(BaseModel):
    strong_skills: list[str]
    intermediate_skills: list[str]
    weak_skills: list[str]

    programming_languages: list[str]
    frameworks: list[str]
    databases: list[str]

    ai_ml_skills: list[str]
    devops_cloud_skills: list[str]

    recommended_skills: list[str]


class CareerItem(BaseModel):
    title: str
    reason: str
    match_percentage: int


class CareerAnalysis(BaseModel):
    top_career: CareerItem

    alternative_careers: list[CareerItem]

    skills_needed_for_top_career: list[str]

    next_steps: list[str]


class SkillGapItem(BaseModel):
    skill: str
    current_level: str
    required_level: str
    priority: str
    reason: str


class SkillGapAnalysis(BaseModel):
    target_career: str

    skill_gaps: list[SkillGapItem]

    soft_skill_gaps: list[str]

    learning_order: list[str]

    job_readiness_percentage: int


class RoadmapPhase(BaseModel):
    phase: str
    duration: str

    skills: list[str]
    topics: list[str]
    projects: list[str]
    practice: list[str]


class Roadmap(BaseModel):
    target_career: str

    roadmap: list[RoadmapPhase]

    portfolio_projects: list[str]

    interview_preparation: list[str]

    job_preparation: list[str]


class JobRole(BaseModel):
    job_title: str
    job_type: str

    match_percentage: int

    matching_skills: list[str]

    missing_skills: list[str]

    reason: str


class JobMatches(BaseModel):
    recommended_roles: list[JobRole]

    top_role: str

    application_advice: list[str]


class CompanyItem(BaseModel):
    company_name: str
    location: str
    industry: str

    suitable_role: str
    employment_level: str

    match_percentage: int

    matching_skills: list[str]

    skills_to_improve: list[str]

    reason: str


class CompanyMatches(BaseModel):
    country: str

    recommended_companies: list[CompanyItem]

    recommended_job_types: list[str]

    search_advice: list[str]


class CompleteCareerProfile(BaseModel):
    analysis: ResumeAnalysis

    skill_analysis: SkillAnalysis

    career_analysis: CareerAnalysis

    skill_gap_analysis: SkillGapAnalysis

    roadmap: Roadmap

    job_matches: JobMatches

    company_matches: CompanyMatches


# =========================================================
# MASTER CAREER ANALYSIS
# =========================================================


def analyze_complete_career_profile(
    resume_text: str
):

    # -----------------------------------------------------
    # CLEAN RESUME TEXT
    #
    # Prevent extremely large CV text from increasing
    # latency and token usage.
    # -----------------------------------------------------

    clean_resume = (
        resume_text
        .strip()
    )

    if not clean_resume:
        raise ValueError(
            "Resume text is empty"
        )


    # Normal CVs are usually much smaller than this.
    # This protects against unexpectedly huge PDFs.
    clean_resume = clean_resume[:15000]


    # -----------------------------------------------------
    # COMPACT PROMPT
    # -----------------------------------------------------

    prompt = f"""
You are CarePlanix AI, an AI career guidance system.

Analyze the following resume once and create a concise,
practical career profile.

IMPORTANT RULES:

1. Use only information reasonably supported by the resume.

2. Do not invent:
   - education
   - experience
   - projects
   - qualifications
   - technical skills

3. If personal information is not available,
   return an empty string.

4. Skill levels should use:
   Beginner, Intermediate or Advanced.

5. Skill-gap priority should use:
   High, Medium or Low.

6. All percentage values must be integers
   between 0 and 100.

7. Percentages are AI estimates only.

RESUME ANALYSIS:

- Extract important personal information.
- Extract education.
- Extract technical skills.
- Identify projects and experience.
- Identify career interests.
- Identify strengths and weaknesses.

CAREER ANALYSIS:

- Recommend one best-fit realistic career.
- Recommend maximum 3 alternative careers.
- Keep reasons short and useful.
- Do not write long paragraphs.

SKILL GAP:

- Include maximum 5 important technical gaps.
- Include only realistic gaps.
- Give a practical learning order.

ROADMAP:

- Maximum 4 phases.
- Keep phases practical.
- Recommend useful portfolio projects.
- Include interview preparation.
- Include job preparation.

JOB MATCH:

- Maximum 4 suitable job or internship roles.
- Roles must match the candidate's current level.
- Do not invent live vacancies.

SRI LANKA COMPANY RECOMMENDATIONS:

- Maximum 4 companies.
- Only recommend real companies
  that operate in Sri Lanka.
- Recommend suitable realistic roles.
- Employment level should normally be:
  Internship, Entry Level, Junior or Associate.
- Do not claim a company is currently hiring.
- Do not invent specific vacancies.
- Do not invent salaries.
- Do not guarantee employment.

OUTPUT STYLE:

- Be concise.
- Avoid repeated information.
- Avoid long explanations.
- Return all required fields.

RESUME:

{clean_resume}
"""


    # -----------------------------------------------------
    # GEMINI REQUEST
    # -----------------------------------------------------

    response = client.models.generate_content(

        model="gemini-3.5-flash-lite",

        contents=prompt,

        config=types.GenerateContentConfig(

            response_mime_type="application/json",

            response_schema=CompleteCareerProfile,

            max_output_tokens=4500,

            thinking_config=types.ThinkingConfig(
                thinking_level="minimal"
            ),

        ),

    )


    # -----------------------------------------------------
    # EMPTY RESPONSE CHECK
    # -----------------------------------------------------

    if not response.text:

        raise ValueError(
            "CarePlanix AI returned an empty response"
        )


    # -----------------------------------------------------
    # USE SDK PARSED RESULT WHEN AVAILABLE
    # -----------------------------------------------------

    try:

        if response.parsed:

            if isinstance(
                response.parsed,
                CompleteCareerProfile
            ):

                return (
                    response
                    .parsed
                    .model_dump()
                )


            if isinstance(
                response.parsed,
                dict
            ):

                validated = (
                    CompleteCareerProfile
                    .model_validate(
                        response.parsed
                    )
                )

                return (
                    validated
                    .model_dump()
                )


    except Exception as parsed_error:

        print(
            "Parsed response validation failed:",
            str(parsed_error)
        )


    # -----------------------------------------------------
    # FALLBACK JSON VALIDATION
    # -----------------------------------------------------

    raw_text = (
        response.text
        .strip()
    )


    try:

        result = (
            CompleteCareerProfile
            .model_validate_json(
                raw_text
            )
        )


        return result.model_dump()


    except Exception as e:

        print(
            "CarePlanix AI response validation error:",
            str(e)
        )

        print(
            "Raw Gemini response:",
            raw_text[:3000]
        )


        raise ValueError(
            "CarePlanix AI returned an invalid response"
        )