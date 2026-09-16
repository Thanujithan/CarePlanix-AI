import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.career_planner_agent import generate_career_plan


router = APIRouter(
    prefix="/career-plan",
    tags=["Career Planner"]
)


class CareerPlanRequest(BaseModel):
    target_career: str
    current_skills: str


@router.post("/generate")
async def create_career_plan(data: CareerPlanRequest):

    # Validate target career
    if not data.target_career.strip():
        raise HTTPException(
            status_code=400,
            detail="Target career is required"
        )

    # Validate current skills
    if not data.current_skills.strip():
        raise HTTPException(
            status_code=400,
            detail="Current skills are required"
        )

    try:
        # Generate plan using CarePlanix AI
        result = generate_career_plan(
            target_career=data.target_career.strip(),
            current_skills=data.current_skills.strip()
        )

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Career plan generation returned no result"
            )

        # Convert Gemini JSON string to Python object
        cleaned_result = result.strip()

        if cleaned_result.startswith("```json"):
            cleaned_result = cleaned_result[7:]

        if cleaned_result.startswith("```"):
            cleaned_result = cleaned_result[3:]

        if cleaned_result.endswith("```"):
            cleaned_result = cleaned_result[:-3]

        cleaned_result = cleaned_result.strip()

        try:
            career_plan = json.loads(cleaned_result)

        except json.JSONDecodeError:
            raise HTTPException(
                status_code=500,
                detail="AI returned an invalid career plan format"
            )

        return {
            "success": True,
            "career_plan": career_plan
        }

    except HTTPException:
        raise

    except Exception as e:
        error_message = str(e)

        print(
            "Career Planner Error:",
            error_message
        )

        if (
            "429" in error_message
            or "RESOURCE_EXHAUSTED" in error_message
        ):
            raise HTTPException(
                status_code=429,
                detail=(
                    "CarePlanix AI quota is currently exhausted. "
                    "Please try again later."
                )
            )

        if (
            "503" in error_message
            or "UNAVAILABLE" in error_message
        ):
            raise HTTPException(
                status_code=503,
                detail=(
                    "CarePlanix AI is temporarily unavailable. "
                    "Please try again shortly."
                )
            )

        raise HTTPException(
            status_code=500,
            detail=f"Career plan generation failed: {error_message}"
        )