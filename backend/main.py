import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient

from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.resume import router as resume_router
from routes.career_plan import router as career_plan_router
from routes.jobs import router as jobs_router


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="CarePlanix AI API",
    description="Agentic AI Career and Internship Management System",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROUTERS
# =========================================================

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(resume_router)
app.include_router(career_plan_router)
app.include_router(jobs_router)


# =========================================================
# MONGODB
# =========================================================

MONGODB_URI = os.getenv(
    "MONGODB_URI"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "careplanix"
)


if not MONGODB_URI:
    raise ValueError(
        "MONGODB_URI not found in .env"
    )


client = MongoClient(
    MONGODB_URI
)

db = client[
    DATABASE_NAME
]


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message":
            "Welcome to CarePlanix AI 🚀",

        "status":
            "Backend is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health_check():

    try:

        client.admin.command(
            "ping"
        )

        return {
            "status":
                "healthy",

            "database":
                "connected"
        }

    except Exception as e:

        return {
            "status":
                "unhealthy",

            "database":
                "disconnected",

            "error":
                str(e)
        }