<h1 align="center">CRM-backend</h1>

<div align="center">
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4b3263?style=flat&logo=eslint&logoColor=white">
  <img alt="Prettier" src="https://img.shields.io/badge/Prettier-3658a5?style=flat&logo=prettier&logoColor=f7b93e">
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-f69220?style=flat&logo=pnpm&logoColor=white">
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

1. Клонируйте репозиторий

   ```
     git clone https://github.com/daniilgrigorev01/crm-backend.git &&
     cd crm-backend
   ```

2. Установите необходимые env-переменные

   **Примечание:** для хранения env-переменных используются файлы с названиями .env.[development|production].
   Вы можете использовать свои названия, поменяв их в скриптах [package.json](package.json)

   ```
     # Порт приложения
     PORT=8080

     # Включение/выключение Swagger
     SWAGGER_DOCS=true

     # Подлючение к PostgreSQL
     DB_USER=postgres
     DB_PASSWORD=postgres
     DB_HOST=db // используется имя контейнера Docker
     DB_PORT=5432
     DB_NAME=db
     DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

     # Подлючение к Redis
     REDIS_HOST=redis // используется имя контейнера Docker
     REDIS_PORT=6379

     # Секретная строка для JWT
     JWT_SECRET=JWT_SECRET
   ```

3. Запустите Docker Compose

   ```
     docker compose --env-file .env.production up
   ```

## API

См. спецификацию после запуска сервера по адресу:

```
  127.0.0.1:8080/api/docs
```

## Технологии

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/orm)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/)

## Лицензия

См. файл [LICENSE.md](LICENSE.md)
