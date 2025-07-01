FROM oven/bun:1.1.38-debian

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

EXPOSE 8080
WORKDIR /config/packages/sushii-worker
ENTRYPOINT [ "bun", "run", "./src/index.ts" ]
