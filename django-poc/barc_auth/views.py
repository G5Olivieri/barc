import time
from dataclasses import dataclass

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, parser_classes, renderer_classes
from rest_framework.parsers import FormParser
from rest_framework.renderers import JSONRenderer
from rest_framework.request import Request
from rest_framework.response import Response

from barc_auth.serializers import SignInRequestSerializer, SignInResponseSerializer


@dataclass
class AccessTokenResponse:
    access_token: str
    token_type: str
    expires_in: int


@api_view(["POST"])
@parser_classes([FormParser])
@renderer_classes([JSONRenderer])
def signin_view(request: Request) -> Response:
    signin_request = SignInRequestSerializer(data=request.data)

    if not signin_request.is_valid():
        return Response(signin_request.errors, status=400)

    if signin_request.validated_data["grant_type"] != "password":
        return Response({"error": "Invalid grant_type"}, status=400)

    user = (
        get_user_model()
        .objects.filter(username=signin_request.validated_data["username"])
        .first()
    )
    if user is None or not user.check_password(
        signin_request.validated_data["password"]
    ):
        return Response({"error": "Invalid username or password"}, status=400)

    now = time.time()
    response = SignInResponseSerializer(
        AccessTokenResponse(
            access_token=jwt.encode(
                payload={
                    "sub": user.username,
                    "iat": now,
                    "iss": "barc.com.br",
                    "exp": now + settings.JWT_EXPIRATION,
                },
                key=settings.JWT_SECRET_KEY,
                algorithm=settings.JWT_ALGORITHM,
            ),
            expires_in=settings.JWT_EXPIRATION,
            token_type="Bearer",
        )
    )
    return Response(response.data)
