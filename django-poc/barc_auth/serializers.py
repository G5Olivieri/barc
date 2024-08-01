from rest_framework import serializers


class SignInRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    grant_type = serializers.CharField()


class SignInResponseSerializer(serializers.Serializer):
    access_token = serializers.CharField()
    expires_in = serializers.IntegerField()
    token_type = serializers.CharField()
