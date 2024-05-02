FROM node:20

WORKDIR ./app

COPY . .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && pnpm add -g @nestjs/cli && pnpm i --frozen-lockfile && \
    pnpm run migrate:prod

CMD pnpm run start:prod
