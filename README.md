# NestJs

These are my notes and type-along results from the <https://learn.nestjs.com/> course.

## Installation

`npm i`

## Starting up

- `docker-compose up` starts the db
- `npm run start:dev` starts the app

use `tests.http` with the VSC rest client, Insomnia, postman to interact with the NestJS REST API

## Migrations

Creating a TypeOrm Migration

`npx typeorm migration:create -n CoffeeRefactor`

CoffeeRefactor being the NAME we are giving "this" migration

## More info

- see [README.md](README-nest-default.md) that is generated.
- <https://learn.nestjs.com/>
- <https://nestjs.com>
