from datetime import datetime, timezone

import asyncio
import os
import tempfile

from bson import ObjectId
from bson.errors import InvalidId

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends,
)

from services.resume_service import (
    extract_text_from_pdf,
)

from agents.resume_graph import (
    resume_graph,
)

from utils.auth import (
    get_current_user_id,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/resume",
    tags=["Resume"],
)


# =========================================================
# RESUME UPLOAD + COMPLETE AI ANALYSIS
# =========================================================

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user_id: str = Depends(
        get_current_user_id
    ),
):

    temp_file_path = None

    safe_filename = None

    try:

        # =====================================================
        # 1. VALIDATE FILE
        # =====================================================

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="No file selected",
            )


        if not file.filename.lower().endswith(
            ".pdf"
        ):

            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed",
            )


        safe_filename = os.path.basename(
            file.filename
        )


        # =====================================================
        # 2. READ PDF
        # =====================================================

        file_content = await file.read()


        if not file_content:

            raise HTTPException(
                status_code=400,
                detail="The uploaded PDF is empty",
            )


        # =====================================================
        # 3. FILE SIZE VALIDATION
        # =====================================================

        max_file_size = (
            10 * 1024 * 1024
        )


        if len(file_content) > max_file_size:

            raise HTTPException(
                status_code=400,
                detail=(
                    "PDF must be smaller "
                    "than 10 MB"
                ),
            )


        # =====================================================
        # 4. SAVE PDF TEMPORARILY
        #
        # tempfile automatically uses:
        #
        # Windows:
        # system temp folder
        #
        # Vercel:
        # /tmp
        #
        # This avoids Vercel read-only filesystem errors.
        # =====================================================

        with tempfile.NamedTemporaryFile(
            mode="wb",
            suffix=".pdf",
            delete=False,
        ) as temp_file:

            temp_file.write(
                file_content
            )

            temp_file.flush()

            temp_file_path = (
                temp_file.name
            )


        print(
            "Temporary resume created:",
            temp_file_path,
        )


        # =====================================================
        # 5. EXTRACT RESUME TEXT
        # =====================================================

        extracted_text = (
            extract_text_from_pdf(
                temp_file_path
            )
        )


        if (
            not extracted_text
            or
            not extracted_text.strip()
        ):

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract "
                    "text from PDF"
                ),
            )


        extracted_text = (
            extracted_text.strip()
        )


        print(
            "Resume text extracted successfully "
            f"({len(extracted_text)} characters)"
        )


        # =====================================================
        # 6. RUN CAREPLANIX MASTER AI WORKFLOW
        # =====================================================

        max_retries = 3

        result = None


        for attempt in range(
            max_retries
        ):

            try:

                print(
                    "CarePlanix AI analysis attempt "
                    f"{attempt + 1}/{max_retries}"
                )


                result = resume_graph.invoke({

                    "resume_text":
                        extracted_text,

                    "analysis":
                        {},

                    "skill_analysis":
                        {},

                    "career_analysis":
                        {},

                    "skill_gap_analysis":
                        {},

                    "roadmap":
                        {},

                    "job_matches":
                        {},

                    "company_matches":
                        {},
                })


                print(
                    "CarePlanix AI analysis "
                    "completed successfully."
                )


                break


            except Exception as e:

                error_message = str(e)

                error_upper = (
                    error_message.upper()
                )


                print(
                    "AI attempt "
                    f"{attempt + 1} failed:",
                    error_message,
                )


                # =========================================
                # 503 TEMPORARY / HIGH DEMAND ERROR
                # =========================================

                temporary_error = (

                    "503"
                    in error_message

                    or
                    "UNAVAILABLE"
                    in error_upper

                    or
                    "HIGH DEMAND"
                    in error_upper

                )


                if temporary_error:

                    if (
                        attempt
                        < max_retries - 1
                    ):

                        wait_time = (
                            3 *
                            (attempt + 1)
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
                        ),
                    )


                # =========================================
                # 429 QUOTA ERROR
                # =========================================

                quota_error = (

                    "429"
                    in error_message

                    or
                    "RESOURCE_EXHAUSTED"
                    in error_upper

                    or
                    "QUOTA"
                    in error_upper

                    or
                    "RATE LIMIT"
                    in error_upper

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
                        ),
                    )


                raise


        # =====================================================
        # 7. VALIDATE AI RESULT
        # =====================================================

        if result is None:

            raise HTTPException(
                status_code=500,
                detail=(
                    "CarePlanix AI could not "
                    "complete the resume analysis."
                ),
            )


        if not isinstance(
            result,
            dict,
        ):

            raise HTTPException(
                status_code=500,
                detail=(
                    "CarePlanix AI returned "
                    "an invalid result."
                ),
            )


        # =====================================================
        # 8. GET RESULT SECTIONS
        # =====================================================

        analysis = result.get(
            "analysis",
            {},
        )


        skill_analysis = result.get(
            "skill_analysis",
            {},
        )


        career_analysis = result.get(
            "career_analysis",
            {},
        )


        skill_gap_analysis = result.get(
            "skill_gap_analysis",
            {},
        )


        roadmap = result.get(
            "roadmap",
            {},
        )


        job_matches = result.get(
            "job_matches",
            {},
        )


        company_matches = result.get(
            "company_matches",
            {},
        )


        # =====================================================
        # 9. SAFETY CHECK RESULT TYPES
        # =====================================================

        if not isinstance(
            analysis,
            dict,
        ):
            analysis = {}


        if not isinstance(
            skill_analysis,
            dict,
        ):
            skill_analysis = {}


        if not isinstance(
            career_analysis,
            dict,
        ):
            career_analysis = {}


        if not isinstance(
            skill_gap_analysis,
            dict,
        ):
            skill_gap_analysis = {}


        if not isinstance(
            roadmap,
            dict,
        ):
            roadmap = {}


        if not isinstance(
            job_matches,
            dict,
        ):
            job_matches = {}


        if not isinstance(
            company_matches,
            dict,
        ):
            company_matches = {}


        # =====================================================
        # 10. CREATE RESPONSE
        # =====================================================

        created_at = datetime.now(
            timezone.utc
        )


        response_data = {

            "filename":
                safe_filename,

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
                company_matches,
        }


        # =====================================================
        # 11. SAVE HISTORY TO MONGODB
        # =====================================================

        from main import db


        history_document = {

            "user_id":
                user_id,

            "filename":
                safe_filename,

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
                company_matches,

            "created_at":
                created_at,
        }


        history_result = (
            db.analysis_history.insert_one(
                history_document
            )
        )


        history_id = str(
            history_result.inserted_id
        )


        print(
            "Analysis history saved successfully:",
            history_id,
        )


        # =====================================================
        # 12. ADD HISTORY DETAILS TO RESPONSE
        # =====================================================

        response_data[
            "history_id"
        ] = history_id


        response_data[
            "history_saved"
        ] = True


        response_data[
            "created_at"
        ] = created_at.isoformat()


        return response_data


    # =========================================================
    # FASTAPI ERRORS
    # =========================================================

    except HTTPException:

        raise


    # =========================================================
    # UNEXPECTED ERRORS
    # =========================================================

    except Exception as e:

        print(
            "Resume analysis error:",
            str(e),
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Resume analysis failed: "
                + str(e)
            ),
        )


    # =========================================================
    # CLEANUP TEMPORARY PDF
    # =========================================================

    finally:

        try:

            if (
                temp_file_path
                and
                os.path.exists(
                    temp_file_path
                )
            ):

                os.remove(
                    temp_file_path
                )


                print(
                    "Temporary resume deleted:",
                    safe_filename,
                )


        except Exception as cleanup_error:

            print(
                "Could not remove "
                "temporary resume:",
                cleanup_error,
            )


# =========================================================
# GET LOGGED-IN USER ANALYSIS HISTORY
# =========================================================

@router.get("/history")
def get_analysis_history(

    user_id: str = Depends(
        get_current_user_id
    ),

):

    from main import db


    try:

        histories = list(

            db.analysis_history

            .find({

                "user_id":
                    user_id,

            })

            .sort(

                "created_at",

                -1,

            )

        )


        history_list = []


        for item in histories:

            career_analysis = item.get(
                "career_analysis",
                {},
            )


            skill_gap_analysis = item.get(
                "skill_gap_analysis",
                {},
            )


            if not isinstance(
                career_analysis,
                dict,
            ):

                career_analysis = {}


            if not isinstance(
                skill_gap_analysis,
                dict,
            ):

                skill_gap_analysis = {}


            top_career = career_analysis.get(
                "top_career",
                {},
            )


            if not isinstance(
                top_career,
                dict,
            ):

                top_career = {}


            created_at = item.get(
                "created_at"
            )


            if isinstance(
                created_at,
                datetime,
            ):

                created_at_value = (
                    created_at.isoformat()
                )


            elif created_at:

                created_at_value = str(
                    created_at
                )


            else:

                created_at_value = None


            history_list.append({

                "history_id":
                    str(
                        item["_id"]
                    ),

                "filename":
                    item.get(
                        "filename",
                        "",
                    ),

                "created_at":
                    created_at_value,

                "top_career":
                    top_career.get(
                        "title",
                        "",
                    ),

                "career_match":
                    top_career.get(
                        "match_percentage",
                        0,
                    ),

                "job_readiness":
                    skill_gap_analysis.get(
                        "job_readiness_percentage",
                        0,
                    ),

            })


        return {

            "success":
                True,

            "count":
                len(
                    history_list
                ),

            "history":
                history_list,

        }


    except Exception as e:

        print(
            "History retrieval error:",
            str(e),
        )


        raise HTTPException(
            status_code=500,
            detail=(
                "Could not load "
                "analysis history"
            ),
        )


# =========================================================
# GET ONE SAVED ANALYSIS
# =========================================================

@router.get(
    "/history/{history_id}"
)
def get_analysis_history_detail(

    history_id: str,

    user_id: str = Depends(
        get_current_user_id
    ),

):

    from main import db


    # =====================================================
    # 1. VALIDATE HISTORY ID
    # =====================================================

    try:

        object_id = ObjectId(
            history_id
        )


    except InvalidId:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid analysis history ID"
            ),
        )


    # =====================================================
    # 2. FIND SAVED ANALYSIS
    #
    # Both history ID and user ID are checked.
    # This prevents users from viewing another user's data.
    # =====================================================

    item = db.analysis_history.find_one({

        "_id":
            object_id,

        "user_id":
            user_id,

    })


    if not item:

        raise HTTPException(
            status_code=404,
            detail=(
                "Analysis history not found"
            ),
        )


    # =====================================================
    # 3. SAFE RESULT DATA
    # =====================================================

    analysis = item.get(
        "analysis",
        {},
    )


    skill_analysis = item.get(
        "skill_analysis",
        {},
    )


    career_analysis = item.get(
        "career_analysis",
        {},
    )


    skill_gap_analysis = item.get(
        "skill_gap_analysis",
        {},
    )


    roadmap = item.get(
        "roadmap",
        {},
    )


    job_matches = item.get(
        "job_matches",
        {},
    )


    company_matches = item.get(
        "company_matches",
        {},
    )


    if not isinstance(
        analysis,
        dict,
    ):
        analysis = {}


    if not isinstance(
        skill_analysis,
        dict,
    ):
        skill_analysis = {}


    if not isinstance(
        career_analysis,
        dict,
    ):
        career_analysis = {}


    if not isinstance(
        skill_gap_analysis,
        dict,
    ):
        skill_gap_analysis = {}


    if not isinstance(
        roadmap,
        dict,
    ):
        roadmap = {}


    if not isinstance(
        job_matches,
        dict,
    ):
        job_matches = {}


    if not isinstance(
        company_matches,
        dict,
    ):
        company_matches = {}


    # =====================================================
    # 4. CREATED DATE
    # =====================================================

    created_at = item.get(
        "created_at"
    )


    if isinstance(
        created_at,
        datetime,
    ):

        created_at_value = (
            created_at.isoformat()
        )


    elif created_at:

        created_at_value = str(
            created_at
        )


    else:

        created_at_value = None


    # =====================================================
    # 5. RETURN FULL SAVED ANALYSIS
    # =====================================================

    return {

        "history_id":
            str(
                item["_id"]
            ),

        "history_saved":
            True,

        "filename":
            item.get(
                "filename",
                "",
            ),

        "text_preview":
            item.get(
                "text_preview",
                "",
            ),

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
            company_matches,

        "created_at":
            created_at_value,

    }