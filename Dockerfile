FROM node:14-alpine
MAINTAINER Giuseppe Mandato <gius.mand.developer@gmail.com>

WORKDIR grpc-stub

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn install --frozen-lockfile --prefer-offline --silent

COPY LICENSE LICENSE
COPY README.md README.md

COPY lib lib
COPY index.mjs index.mjs

ENTRYPOINT ["node", "index.mjs"]
