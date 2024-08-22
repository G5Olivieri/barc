FROM python:3.12-alpine

ENV PATH="/home/python/.local/bin:${PATH}"

RUN apk add -U postgresql-dev gcc musl-dev libffi-dev openssl-dev

RUN addgroup -g 1000 python && adduser -D -u 1000 -G python python

USER python

RUN pip install --upgrade pip poetry