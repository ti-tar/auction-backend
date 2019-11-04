# Auction Backend

That is the backend side of simple auction boilerplate project. Frontend is [here](https://github.com/ti-tar/auction-frontend).

## Stack

- [NestJs](https://nestjs.com/) + `Typescript`
- DB with `TypeORM` + `PostgreSQL`
- jobs `nest-bull` + `Redis`
- JWT with `passport`
- `jest` testing


## Docker-compose

``` docker-compose up -d [--no-recreate] ```

``` docker-compose [-f docker-compose-production.yml] up -d ```

``` docker-compose down ```

## Auction Service for start dockers on reboot:

``` sudo systemctl start auction ```

``` sudo ln -s ~/auction-backend/auction.service /etc/systemd/system ```

``` sudo systemctl start auction.service ```

``` sudo systemctl enable auction.service ```


## Migrations

``` npm run typeorm migration:create -- -f ormconfig.js -n MigrationFirst```

Generate migrations:

``` npm run typeorm migration:generate -- -f ormconfig.js -n MigrationFirst```

``` npm run typeorm migration:run -- -f ormconfig.js ```

``` npm run typeorm migration:revert -- -f ormconfig.js ```
