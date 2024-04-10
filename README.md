<h1 align="center">CRM-backend</h1>

<div align="center">
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4b3263?style=flat&logo=eslint&logoColor=white">
  <img alt="Prettier" src="https://img.shields.io/badge/Prettier-3658a5?style=flat&logo=prettier&logoColor=f7b93e">
</div>

## Описание

REST API сервер для управления базой данных клиентов.

Возможности:

- Просматривать список клиентов;
- Фильтровать и сортировать клиентов;
- Получать данные конкретного клиента;
- Добавлять новых клиентов;
- Изменять и удалять записи клиентов.

## Запуск

Клонируйте репозиторий и установите зависимости

```
  git clone https://github.com/daniilgrigorev01/crm-backend.git
  cd crm-backend
  pnpm i --frozen-lockfile
```

Установите необходимые env-переменные

```
  PORT=0000
  DATABASE_URL='postgresql://USER_DB:PASS_DB@HOST_DB:PORT_DB/NAME_DB'
```

Выполните миграцию базы данных

```
  pnpm run migrate:dev
```

Запустите сервер в режиме разработки

```
  pnpm run start:dev
```

## API

См. спецификацию после запуска сервера по адресу:

```
  localhost:PORT/api/docs
```

## Технологии

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/orm)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Лицензия

См. файл [LICENSE.md](LICENSE.md)
