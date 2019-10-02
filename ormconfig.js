import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from './src/snake-naming.strategy';

const result = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (result.error) {
  throw result.error;
}

Object.keys(result.parsed).forEach(envKey => {
  process.env[envKey] = result.parsed[envKey];
});

module.exports = {
  namingStrategy: new SnakeNamingStrategy(),
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: [
    "src/entities/**{.ts,.js}",
  ],
  migrations: [
    "src/migrations/**{.ts,.js}",
  ],
  cli: {
    migrationsDir: `src/migrations`,
  },
};
