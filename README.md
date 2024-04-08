<h1 align="center">CRM-backend</h1>

## Описание

REST API сервер для управления базой данных клиентов.

Возможности:

- Просматривать список клиентов;
- Фильтровать и сортировать клиентов;
- Получать данные конкретного клиента;
- Добавлять новых клиентов;
- Изменять и удалять записи клиентов.

## API

См. спецификацию после запуска сервера по адресу:

```http
  localhost:{PORT}/api/docs
```

## Технологии

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [PrismaORM](https://www.prisma.io/orm)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

## Лицензия

См. файл [LICENSE.md](LICENSE.md)
