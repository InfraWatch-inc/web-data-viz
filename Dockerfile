FROM node:lts-bookworm AS libs
WORKDIR /
COPY ./ .
RUN npm install 

FROM node:lts-alpine3.20 AS deploy
WORKDIR /
COPY --from=libs ./node_modules  ./node_modules
COPY ./ .
EXPOSE 8080
CMD ["node", "app.js"]