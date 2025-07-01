FROM oven/bun:1.1.38-debian

LABEL org.opencontainers.image.source=https://github.com/sushiibot/sushii-ts-services
LABEL org.opencontainers.image.description="sushii bot"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

# Install curl
RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /config

# Root package.json and lockfile
COPY ./package.json ./bun.lockb ./

# Project specific package.json - required to copy all package.json files to
# ensure the lockfile doesn't change
COPY ./packages/sushii-worker/package.json ./packages/sushii-worker/
COPY ./packages/sushii-db/package.json ./packages/sushii-db/

# Install only the sushii-worker dependencies
RUN bun install --filter=sushii-worker --frozen-lockfile

COPY . ./

# Build info, args at end to minimize cache invalidation
ARG GIT_HASH
ARG BUILD_DATE

# Make build info available in the app
ENV GIT_HASH=${GIT_HASH}
ENV BUILD_DATE=${BUILD_DATE}

LABEL org.opencontainers.image.revision=${GIT_HASH}
LABEL org.opencontainers.image.created=${BUILD_DATE}

EXPOSE 8080
WORKDIR /config/packages/sushii-worker
ENTRYPOINT [ "bun", "run", "./src/index.ts" ]
