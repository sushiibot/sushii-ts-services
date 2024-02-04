FROM oven/bun:1.0.26-debian

# Install curl
RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /config

COPY ./package.json ./bun.lockb ./

# Copy all packages.jsons to cache dependencies and so lockfile matches
COPY ./packages/sushii-worker/package.json ./packages/sushii-worker/
COPY ./packages/sushii-data/package.json ./packages/sushii-data/
COPY ./packages/sushii-db/package.json ./packages/sushii-db/
COPY ./packages/sushii-status/package.json ./packages/sushii-status/

# Install dependencies, this is gonna be more than needed but lockfile idk
# TODO: Prevent need of copying all package.jsons
RUN bun install --frozen-lockfile

COPY . ./

# Not yet used
EXPOSE 8080

WORKDIR /config/packages/sushii-worker

ENTRYPOINT [ "bun", "run", "./src/index.ts" ]
