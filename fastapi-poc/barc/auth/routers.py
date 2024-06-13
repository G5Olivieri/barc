from typing import Annotated

from fastapi import Depends, APIRouter
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.security import (
    OAuth2PasswordRequestForm,
)
from pydantic import BaseModel
from barc.user.domain.user_repository import UserRepository
from barc.auth.jwt_serializer import JWTSerializer
from barc.auth.password_service import PasswordService
from barc.dependencies import get_user_repository
from barc.auth.dependencies import get_jwt_serializer, get_password_service

routers = APIRouter(prefix="/auth", tags=["auth"])


class JWTResponse(BaseModel):
    access_token: str
    token_type: str


@routers.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_repository: Annotated[UserRepository, Depends(get_user_repository)],
    password_service: Annotated[PasswordService, Depends(get_password_service)],
    jwt_serializer: Annotated[JWTSerializer, Depends(get_jwt_serializer)],
) -> JSONResponse:
    user = await user_repository.get_by_username(form_data.username)
    if user is None:
        return JSONResponse(
            {"error": "Incorrect username or password"}, status_code=400
        )
    if not password_service.verify(user.password, form_data.password):
        return JSONResponse(
            {"error": "Incorrect username or password"}, status_code=400
        )
    acesss_token = jwt_serializer.encode({"sub": user.username})
    return JSONResponse(
        content=jsonable_encoder(JWTResponse(access_token=acesss_token, token_type="bearer")),
        status_code=200,
    )
