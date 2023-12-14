FROM node:18
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/
RUN npm i -g pnpm
RUN pnpm i
RUN pnpm run build
COPY . /app
CMD node .output/server/index.mjs
