FROM node:18
WORKDIR /app
COPY . /app
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build
CMD node .output/server/index.mjs
