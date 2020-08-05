FROM node:10.16-alpine as build
WORKDIR /front
COPY front .

RUN npm ci
RUN npm run build

WORKDIR /back
COPY back .

RUN npm ci
RUN npm run build

FROM node:10.16-alpine as run
WORKDIR /app
COPY --from=build /back/dist ./back
COPY --from=build /front/dist/front ./front
COPY --from=build /back/node_modules node_modules

EXPOSE 3000

ENTRYPOINT node back/main.js
