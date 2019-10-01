# auction-backend

## Docker-compose

``` docker-compose up -d ```

``` docker-compose start|restart|stop [-f custom-docker-compose-config.yml] ```
 
``` docker-compose down ```

## Migrations

``` npm run typeorm migration:create -- -f ormconfig.js -n MigrationFirst```

``` npm run typeorm migration:run -- -f ormconfig.js ```

``` npm run typeorm migration:revert -- -f ormconfig.js ```
