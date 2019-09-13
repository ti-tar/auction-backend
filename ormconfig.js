
/* tslint:disable:quotemark object-literal-sort-keys */
import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from './src/snake-naming.strategy';

if (!module.hot /* for webpack HMR */) {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}

dotenv.config({
    path: `.${process.env.NODE_ENV}.env`,
});

// Replace \\n with \n to support multiline strings in AWS
for (const envName of Object.keys(process.env)) {
    process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

confirm.log('process.env.POSTGRES_USERNAME');


module.exports = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    namingStrategy: new SnakeNamingStrategy(), 
    entities: [
        "src/entities/**{.ts,.js}",
    ],
    migrations: [
        "src/migrations/**{.ts,.js}",
    ],
};

// {
//   "type": "postgres",
//   "host": "localhost",
//   "port": 5432,
//   "username": "user",
//   "password": "password",
//   "database": "auction",
//   "entities": ["src/entities/**{.ts,.js}"],
//   "synchronize": true
// }