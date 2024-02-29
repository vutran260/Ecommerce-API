import { MySql2Database, drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as process from 'process';
import * as schema from '../../lib/mysql/schema';

import { Sequelize } from 'sequelize-typescript';
import { initModels } from './models/init-models';

// export const sequelize = new Sequelize(
//   {
//   host: process.env.MYSQL_HOST,
//   port: parseInt(process.env.MYSQL_PORT||"1111"),
//   username: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   dialect: 'mysql',
//   storage: ':memory:',
//   models: [__dirname + '/src/lib/mysql/models'],
// });

export const SetupDB = () => {
  try {
    const se = new Sequelize({
        host: 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '1111'),
        username: 'link-palette',
        password: 'P@ssw0rd',
        database: 'link-palette-dev',
        dialect: 'mysql',
        storage: ':memory:',
        // models: [__dirname + '/models',],
        
      }); 
      initModels(se)

  } catch (error) {
    console.log(error);
    throw error
  }
};

// export const sequelize = new Sequelize({
//   host: 'localhost',
//   port: parseInt(process.env.MYSQL_PORT || '1111'),
//   username: 'link-palette',
//   password: 'P@ssw0rd',
//   database: 'link-palette-dev',
//   dialect: 'mysql',
//   storage: ':memory:',
//   models: [__dirname + '/models'],
// });


const poolConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_PASSWORD,
});

export const dbConnection: MySql2Database<typeof schema> =
  drizzle(poolConnection);
