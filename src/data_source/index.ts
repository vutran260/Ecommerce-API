import { DataSource } from "typeorm"
import Logger from '../core/Logger';
import { join } from 'lodash';
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 1111,
  username: "link-palette",
  password: "P@ssw0rd",
  database: "link-palette-dev",
  entities: [ "build/entity/**/*.js"],
  // entities: [join(__dirname, '**/entity/*.{ts,js}')],
  logging: true,
})


