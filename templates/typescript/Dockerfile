FROM node:10-alpine

WORKDIR /code
COPY . /code

RUN npm install
RUN npm run build:ts

CMD node ./build/server.js
