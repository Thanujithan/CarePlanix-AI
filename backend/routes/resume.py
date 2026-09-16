from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import asyncio

from services.resume_service import extract_text_from_pdf
from agents.resume_graph import resume_graph


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


# =========================================================
# RESUME UPLOAD + COMPLETE AI ANALYSIS
# =========================================================

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    # =====================================================
    # 1. VALIDATE FILE
    # =====================================================

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # =====================================================
    # 2. CREATE UPLOAD FOLDER
    # =====================================================

    upload_folder = "uploads"

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    # Prevent paths supplied through the filename
    safe_filename = os.path.basename(
        file.filename
    )

    file_path = os.path.join(
        upload_folder,
        safe_filename
    )

    try:

        # =================================================
        # 3. READ + VALIDATE PDF
        # =================================================

        file_content = await file.read()

        if not file_content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF is empty"
            )

        # Maximum PDF size = 10 MB
        max_file_size = 10 * 1024 * 1024

        if len(file_content) > max_file_size:
            raise HTTPException(
                status_code=400,
                detail="PDF must be smaller than 10 MB"
            )

        # =================================================
        # 4. SAVE PDF TEMPORARILY
        # =================================================

        with open(
            file_path,
            "wb"
        ) as buffer:
            buffer.write(
                file_content
            )

        # =================================================
        # 5. EXTRACT RESUME TEXT
        # =================================================

        extracted_text = extract_text_from_pdf(
            file_path
        )

        if (
            not extracted_text
            or not extracted_text.strip()
        ):
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from PDF"
            )

        # Clean unnecessary surrounding whitespace
        extracted_text = extracted_text.strip()

        print(
            f"Resume text extracted successfully "
            f"({len(extracted_text)} characters)"
        )

        # =================================================
        # 6. RUN CAREPLANIX MASTER AI WORKFLOW
        # =================================================

        max_retries = 3
        result = None

        for attempt in range(max_retries):

            try:

                print(
                    f"CarePlanix AI analysis attempt "
                    f"{attempt + 1}/{max_retries}"
                )

                # -----------------------------------------
                # LangGraph -> Master Agent
                #
                # Only ONE Gemini request is made by
                # master_agent.py.
                # -----------------------------------------

                result = resume_graph.invoke({
                    "resume_text": extracted_text,

                    "analysis": {},

                    "skill_analysis": {},

                    "career_analysis": {},

                    "skill_gap_analysis": {},

                    "roadmap": {},

                    "job_matches": {},

                    "company_matches": {}
                })

                print(
                    "CarePlanix AI analysis completed "
                    "successfully."
                )

                break

            except Exception as e:

                error_message = str(e)
                error_upper = error_message.upper()

                print(
                    f"AI attempt "
                    f"{attempt + 1} failed:",
                    error_message
                )

                # =========================================
                # 503 - TEMPORARY PROVIDER ERROR
                # =========================================

                temporary_error = (
                    "503" in error_message
                    or "UNAVAILABLE" in error_upper
                    or "HIGH DEMAND" in error_upper
                )

                if temporary_error:

                    if attempt < max_retries - 1:

                        wait_time = 3 * (
                            attempt + 1
                        )

                        print(
                            "AI service temporarily "
                            "unavailable. "
                            f"Retrying in {wait_time} "
                            "seconds..."
                        )

                        await asyncio.sleep(
                            wait_time
                        )

                        continue

                    raise HTTPException(
                        status_code=503,
                        detail=(
                            "CarePlanix AI is currently "
                            "experiencing high demand. "
                            "Please wait a few moments "
                            "and try again."
                        )
                    )

                # =========================================
                # 429 - GEMINI QUOTA / RATE LIMIT
                # =========================================

                quota_error = (
                    "429" in error_message
                    or "RESOURCE_EXHAUSTED" in error_upper
                    or "QUOTA" in error_upper
                    or "RATE LIMIT" in error_upper
                )

                if quota_error:

                    raise HTTPException(
                        status_code=429,
                        detail=(
                            "CarePlanix AI usage limit "
                            "has been reached. "
                            "Please wait and try again "
                            "after the Gemini API quota "
                            "becomes available."
                        )
                    )

                # =========================================
                # OTHER AI ERROR
                # =========================================

                raise

        # =================================================
        # 7. VALIDATE LANGGRAPH RESULT
        # =================================================

        if result is None:
            raise HTTPException(
                status_code=500,
                detail=(
                    "CarePlanix AI could not complete "
                    "the resume analysis."
                )
            )

        if not isinstance(result, dict):
            raise HTTPException(
                status_code=500,
                detail=(
                    "CarePlanix AI returned an "
                    "invalid result."
                )
            )

        # =================================================
        # 8. GET RESULT SECTIONS
        # =================================================

        analysis = result.get(
            "analysis",
            {}
        )

        skill_analysis = result.get(
            "skill_analysis",
            {}
        )

        career_analysis = result.get(
            "career_analysis",
            {}
        )

        skill_gap_analysis = result.get(
            "skill_gap_analysis",
            {}
        )

        roadmap = result.get(
            "roadmap",
            {}
        )

        job_matches = result.get(
            "job_matches",
            {}
        )

        company_matches = result.get(
            "company_matches",
            {}
        )

        # =================================================
        # 9. SAFETY CHECK RESULT TYPES
        # =================================================

        if not isinstance(
            analysis,
            dict
        ):
            analysis = {}

        if not isinstance(
            skill_analysis,
            dict
        ):
            skill_analysis = {}

        if not isinstance(
            career_analysis,
            dict
        ):
            career_analysis = {}

        if not isinstance(
            skill_gap_analysis,
            dict
        ):
            skill_gap_analysis = {}

        if not isinstance(
            roadmap,
            dict
        ):
            roadmap = {}

        if not isinstance(
            job_matches,
            dict
        ):
            job_matches = {}

        if not isinstance(
            company_matches,
            dict
        ):
            company_matches = {}

        # =================================================
        # 10. RETURN COMPLETE RESPONSE TO FRONTEND
        # =================================================

        return {
            "filename": safe_filename,

            "text_preview":
                extracted_text[:1000],

            "analysis":
                analysis,

            "skill_analysis":
                skill_analysis,

            "career_analysis":
                career_analysis,

            "skill_gap_analysis":
                skill_gap_analysis,

            "roadmap":
                roadmap,

            "job_matches":
                job_matches,

            "company_matches":
                company_matches
        }

    # =====================================================
    # FASTAPI HTTP ERRORS
    # =====================================================

    except HTTPException:
        raise

    # =====================================================
    # UNEXPECTED ERRORS
    # =====================================================

    except Exception as e:

        print(
            "Resume analysis error:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Resume analysis failed: "
                + str(e)
            )
        )

    # =====================================================
    # CLEANUP TEMPORARY PDF
    # =====================================================

    finally:

        try:

            if os.path.exists(
                file_path
            ):
                os.remove(
                    file_path
                )

                print(
                    "Temporary resume deleted:",
                    safe_filename
                )

        except Exception as cleanup_error:

            print(
                "Could not remove "
                "uploaded file:",
                cleanup_error
            )