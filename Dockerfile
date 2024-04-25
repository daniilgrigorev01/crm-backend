FROM node:20

WORKDIR ./app

COPY . .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && pnpm add -g @nestjs/cli && pnpm i --frozen-lockfile

CMD pnpm run migrate:prod && pnpm run start:prod
