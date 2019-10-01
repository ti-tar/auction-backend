import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from './src/snake-naming.strategy';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'auction',
  namingStrategy: new SnakeNamingStrategy(),
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
