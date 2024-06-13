from typing import Annotated

from argon2 import PasswordHasher
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from barc.auth.argon2_password_service import Argon2PasswordService
from barc.auth.jwt_serializer import JWTSerializer
from barc.auth.password_service import PasswordService
from barc.dependencies import get_settings, get_user_repository
from barc.settings import Settings
from barc.user.domain.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def get_jwt_serializer(settings: Annotated[Settings, Depends(get_settings)]):
    return JWTSerializer(settings.jwt_secret, settings.jwt_algorithm)


def get_password_service() -> PasswordService:
    return Argon2PasswordService(PasswordHasher())


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    jwt_serializer: Annotated[JWTSerializer, Depends(get_jwt_serializer)],
):
    payload = jwt_serializer.decode(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await user_repository.get_by_username(payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
