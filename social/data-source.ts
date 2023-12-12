import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'social',
  synchronize: true, // set to false in production
  logging: true,
  entities: [
    path.join(__dirname, '/**/*.entity{.ts,.js}'), // Path to your entity files
  ],
  migrations: [
    path.join(__dirname, './dist/migration/**/*.ts'), // Path to your migration files
  ],
  subscribers: [],
});

// AppDataSource.initialize()
//     .then(() => {
//         console.log("Data Source has been initialized!");
//     })
//     .catch((err) => {
//         console.error("Error during Data Source initialization", err);
//     });
