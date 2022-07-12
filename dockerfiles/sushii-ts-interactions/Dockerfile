FROM node:18-bullseye

WORKDIR /config

COPY ./package.json ./yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY ./packages/sushii-ts-interactions/package.json ./packages/sushii-ts-interactions/
COPY ./packages/sushii-data/package.json ./packages/sushii-data/
RUN yarn install --immutable

COPY . ./
RUN yarn workspace @sushiibot/sushii-interactions build

# Not yet used
EXPOSE 8080

WORKDIR /config/packages/sushii-ts-interactions

ENTRYPOINT [ "node", "./dist/index.js" ]
