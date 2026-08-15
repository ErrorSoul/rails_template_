# syntax=docker/dockerfile:1

# Dev-образ по паттерну «Ruby on Whales». Не для продакшена:
# исходники монтируются томом, гемы и node_modules живут в именованных volume'ах.
#
# RUBY_VERSION обязан совпадать с `.ruby-version` проекта, иначе bundler
# откажется ставить гемы («Your Ruby version is X, but your Gemfile specified Y»).
ARG RUBY_VERSION=3.4.5
FROM ruby:${RUBY_VERSION}-slim-bookworm

ARG PG_MAJOR=16
ARG NODE_MAJOR=24
ARG YARN_VERSION=1.22.22
ARG BUNDLER_VERSION=2.6.9

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    TZ=UTC

RUN apt-get update -qq \
  && apt-get install -yq --no-install-recommends ca-certificates curl gnupg \
  && rm -rf /var/lib/apt/lists/*

# PostgreSQL client (PGDG) — версия клиента совпадает с сервером из compose.yml
RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
      | gpg --dearmor -o /usr/share/keyrings/pgdg.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt bookworm-pgdg main" \
      > /etc/apt/sources.list.d/pgdg.list

# Node.js (NodeSource) — нужен Vite
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list

COPY Aptfile /tmp/Aptfile
RUN apt-get update -qq \
  && apt-get install -yq --no-install-recommends \
       "postgresql-client-${PG_MAJOR}" \
       nodejs \
       $(grep -Ev '^\s*(#|$)' /tmp/Aptfile | tr '\n' ' ') \
  && npm install -g "yarn@${YARN_VERSION}" \
  && rm -rf /var/lib/apt/lists/* /tmp/Aptfile

# BUNDLER_VERSION в ENV заставляет binstub `bundle` выбирать именно эту версию,
# даже если в образе валяется более новая. `gem update --system` тут не делаем:
# он подтягивает RubyGems 4 с bundler 4.x, который ломает Gemfile.lock от 2.x.
ENV BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3 \
    GEM_HOME=/usr/local/bundle \
    BUNDLER_VERSION=${BUNDLER_VERSION} \
    PATH=/usr/local/bundle/bin:/app/bin:$PATH

RUN gem install bundler --version "${BUNDLER_VERSION}" --no-document \
  && mkdir -p /usr/local/hist \
  && ln -sf /usr/local/hist/.bash_history /root/.bash_history

WORKDIR /app

EXPOSE 3000
CMD ["/bin/bash"]
