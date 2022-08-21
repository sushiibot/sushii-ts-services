FROM node:18-bullseye

WORKDIR /config

COPY ./package.json ./yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY ./packages/sushii-worker/package.json ./packages/sushii-worker/
COPY ./packages/sushii-data/package.json ./packages/sushii-data/
RUN yarn install --immutable

COPY . ./
RUN yarn workspace @sushiibot/sushii-data build

EXPOSE 8080
ENTRYPOINT [ "node", "./packages/sushii-data/dist/index.js" ]
