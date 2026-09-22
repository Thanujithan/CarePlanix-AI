import httpx

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from services.job_service import (
    search_live_jobs,
)

from utils.auth import (
    get_current_user_id,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Live Jobs"]
)


@router.get("/search")
async def search_jobs(
    query: str = Query(
        ...,
        min_length=2,
        max_length=100
    ),

    user_id: str = Depends(
        get_current_user_id
    ),
):

    try:

        result = await search_live_jobs(
            query=query
        )


        return {
            "success":
                True,

            "user_id":
                user_id,

            **result,
        }


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except httpx.TimeoutException:

        raise HTTPException(
            status_code=504,
            detail=(
                "Live job service timed out. "
                "Please try again."
            )
        )


    except Exception as e:

        print(
            "Live job search error:",
            str(e)
        )


        raise HTTPException(
            status_code=502,
            detail=(
                "Could not retrieve "
                "live job listings."
            )
        )