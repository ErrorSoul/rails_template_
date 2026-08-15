# syntax=docker/dockerfile:1
# Multi-arch (arm64 + amd64) — pattern from ~/works/lave-cashback
FROM ruby:3.2-bookworm

ENV LANG=C.UTF-8 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

RUN apt-get update -qq && apt-get install -y --no-install-recommends \
      build-essential libpq-dev postgresql-client git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
