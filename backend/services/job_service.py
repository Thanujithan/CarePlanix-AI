import html
import re

import httpx


REMOTE_OK_API = (
    "https://remoteok.com/api"
)


def clean_html(
    value: str
) -> str:

    if not value:
        return ""

    value = re.sub(
        r"<[^>]+>",
        " ",
        value
    )

    value = html.unescape(
        value
    )

    value = re.sub(
        r"\s+",
        " ",
        value
    )

    return value.strip()


async def search_live_jobs(
    query: str
):

    clean_query = (
        query.strip().lower()
    )

    if not clean_query:

        raise ValueError(
            "Job search query is required"
        )


    headers = {
        "User-Agent":
            "CarePlanix-AI/1.0"
    }


    async with httpx.AsyncClient(
        timeout=30.0
    ) as client:

        response = await client.get(
            REMOTE_OK_API,
            headers=headers
        )


    if response.status_code != 200:

        raise RuntimeError(
            "Live job provider returned "
            f"status {response.status_code}"
        )


    data = response.json()


    if not isinstance(
        data,
        list
    ):

        raise RuntimeError(
            "Invalid live job response"
        )


    jobs = []


    for item in data:

        if not isinstance(
            item,
            dict
        ):
            continue


        # First Remote OK object contains
        # API metadata / legal information.
        if not item.get(
            "id"
        ):
            continue


        title = str(
            item.get(
                "position",
                ""
            )
        )


        company = str(
            item.get(
                "company",
                ""
            )
        )


        location = str(
            item.get(
                "location",
                ""
            )
        )


        tags = item.get(
            "tags",
            []
        )


        if not isinstance(
            tags,
            list
        ):
            tags = []


        searchable_text = " ".join([
            title,
            company,
            location,
            *[
                str(tag)
                for tag in tags
            ],
        ]).lower()


        if (
            clean_query
            not in searchable_text
        ):
            continue


        description = clean_html(
            str(
                item.get(
                    "description",
                    ""
                )
            )
        )


        jobs.append({

            "job_id":
                str(
                    item.get(
                        "id",
                        ""
                    )
                ),

            "title":
                title,

            "company":
                company,

            "location":
                location
                or "Remote",

            "date":
                item.get(
                    "date",
                    ""
                ),

            "tags":
                tags,

            "description":
                description[:700],

            "salary_min":
                item.get(
                    "salary_min",
                    0
                ),

            "salary_max":
                item.get(
                    "salary_max",
                    0
                ),

            "apply_url":
                item.get(
                    "apply_url",
                    ""
                ),

            "job_url":
                item.get(
                    "url",
                    ""
                ),

            "source":
                "Remote OK",
        })


        if len(jobs) >= 10:
            break


    return {
        "query":
            query.strip(),

        "count":
            len(jobs),

        "jobs":
            jobs,

        "source":
            "Remote OK",
    }