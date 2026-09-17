from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo.errors import DuplicateKeyError

from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user_id,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# REQUEST MODELS
# =========================================================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================================================
# REGISTER
# =========================================================

@router.post("/register")
def register(data: RegisterRequest):
    from main import db

    name = data.name.strip()
    email = data.email.strip().lower()
    password = data.password

    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required"
        )

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if "@" not in email:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address"
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 6 characters"
        )

    # -----------------------------------------------------
    # CHECK EXISTING USER
    # -----------------------------------------------------

    existing_user = db.users.find_one(
        {"email": email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

    user = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = db.users.insert_one(user)

        return {
            "success": True,
            "message": "User registered successfully",
            "user": {
                "id": str(result.inserted_id),
                "name": name,
                "email": email,
            },
        }

    except DuplicateKeyError:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(data: LoginRequest):
    from main import db

    email = data.email.strip().lower()
    password = data.password

    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password is required"
        )

    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

    user = db.users.find_one(
        {"email": email}
    )

    # -----------------------------------------------------
    # VERIFY PASSWORD
    # -----------------------------------------------------

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    stored_password = user.get(
        "password"
    )

    if not stored_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        password,
        stored_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -----------------------------------------------------
    # CREATE JWT TOKEN
    # -----------------------------------------------------

    token = create_access_token(
        str(user["_id"])
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user.get(
                "name",
                ""
            ),
            "email": user.get(
                "email",
                ""
            ),
        },
    }


# =========================================================
# GET CURRENT LOGGED-IN USER
# =========================================================

@router.get("/me")
def get_current_user(
    user_id: str = Depends(
        get_current_user_id
    )
):
    from main import db

    # -----------------------------------------------------
    # CONVERT JWT USER ID TO MONGODB OBJECT ID
    # -----------------------------------------------------

    try:
        object_id = ObjectId(
            user_id
        )

    except InvalidId:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

    user = db.users.find_one(
        {"_id": object_id}
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "success": True,
        "user": {
            "id": str(
                user["_id"]
            ),
            "name": user.get(
                "name",
                ""
            ),
            "email": user.get(
                "email",
                ""
            ),
        },
    }