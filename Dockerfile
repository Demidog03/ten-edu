FROM node:20-alpine AS base

USER root

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable \
 && corepack prepare pnpm@latest --activate

WORKDIR /app
RUN chown -R node:node /app

USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .

ENV HOST=0.0.0.0 \
    PORT=4200 \
    CHOKIDAR_USEPOLLING=1 \
    NG_CLI_ANALYTICS=false

EXPOSE 4200

CMD ["pnpm", "startDocker"]
