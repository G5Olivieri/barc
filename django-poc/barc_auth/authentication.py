import logging
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()

logger = logging.getLogger(__name__)


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        authorization = request.META.get("HTTP_AUTHORIZATION")
        if authorization is None:
            return None

        if not authorization.startswith("Bearer "):
            return None

        token = authorization.split(" ")[1]
        try:
            payload = jwt.decode(
                token,
                key=settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": False},
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        try:
            user = User.objects.get(username=payload["sub"])
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("No such user")

        return (user, None)
