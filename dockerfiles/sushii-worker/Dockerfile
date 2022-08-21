FROM node:18-bullseye

WORKDIR /config

COPY ./package.json ./yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY ./packages/sushii-ts-interactions/package.json ./packages/sushii-worker/
COPY ./packages/sushii-data/package.json ./packages/sushii-data/
RUN yarn install --immutable

COPY . ./
RUN yarn workspace @sushiibot/sushii-worker build

# Not yet used
EXPOSE 8080

WORKDIR /config/packages/sushii-worker

ENTRYPOINT [ "node", "./dist/index.js" ]
