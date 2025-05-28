FROM node:lts-bookworm AS libs
WORKDIR /
COPY ./package.json .
COPY ./public ./public
COPY ./src ./src 
COPY ./app.js ./
RUN npm install 

FROM node:lts-alpine3.20 AS deploy
WORKDIR /
COPY --from=libs ./node_modules  ./node_modules
COPY public/ ./public
COPY src/ ./src
COPY app.js ./
EXPOSE 8080
CMD ["node", "app.js"]