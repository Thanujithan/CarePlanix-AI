from datetime import datetime, timedelta, timezone
import os

import bcrypt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from jose import JWTError, jwt


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY",
    "careplanix-development-secret-key"
)

ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_HOURS = int(
    os.getenv(
        "JWT_EXPIRE_HOURS",
        "24"
    )
)


# =========================================================
# BEARER TOKEN
# =========================================================

security = HTTPBearer()


# =========================================================
# PASSWORD HASHING
# =========================================================

def hash_password(
    password: str
) -> str:

    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


# =========================================================
# PASSWORD VERIFICATION
# =========================================================

def verify_password(
    password: str,
    hashed_password: str
) -> bool:

    try:

        return bcrypt.checkpw(
            password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )

    except Exception:

        return False


# =========================================================
# CREATE JWT ACCESS TOKEN
# =========================================================

def create_access_token(
    user_id: str
) -> str:

    current_time = datetime.now(
        timezone.utc
    )

    expire = (
        current_time
        + timedelta(
            hours=ACCESS_TOKEN_EXPIRE_HOURS
        )
    )

    payload = {
        "sub": user_id,
        "iat": current_time,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================================================
# DECODE JWT ACCESS TOKEN
# =========================================================

def decode_access_token(
    token: str
) -> str:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[
                ALGORITHM
            ]
        )

        user_id = payload.get(
            "sub"
        )

        if not user_id:

            raise HTTPException(
                status_code=(
                    status.HTTP_401_UNAUTHORIZED
                ),
                detail=(
                    "Invalid authentication token"
                ),
                headers={
                    "WWW-Authenticate":
                        "Bearer"
                }
            )

        return user_id

    except JWTError:

        raise HTTPException(
            status_code=(
                status.HTTP_401_UNAUTHORIZED
            ),
            detail=(
                "Invalid or expired authentication token"
            ),
            headers={
                "WWW-Authenticate":
                    "Bearer"
            }
        )


# =========================================================
# CURRENT USER ID DEPENDENCY
# =========================================================

def get_current_user_id(
    credentials:
        HTTPAuthorizationCredentials
        = Depends(security)
) -> str:

    token = (
        credentials.credentials
    )

    return decode_access_token(
        token
    )