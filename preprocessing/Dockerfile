FROM node:8.1-alpine

RUN apk add --update \
    fftw-dev \
    vips-dev --repository https://dl-3.alpinelinux.org/alpine/edge/testing/ \
    exiftool \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
