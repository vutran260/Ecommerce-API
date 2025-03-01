import * as process from 'process';

import { Sequelize } from 'sequelize-typescript';
import { initModels } from './models/init-models';

export let lpSequelize: Sequelize;

export const SetupDB = () => {
  try {
    console.log(process.env.MYSQL_DATABASE);
    lpSequelize = new Sequelize({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || '1111'),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      dialect: 'mysql',
      storage: ':memory:',
      logging: (msg, executionTime) => {
        console.log(`SQL: ${msg} - Execution time: ${executionTime}ms`);
      },
      benchmark: true,
    });
    initModels(lpSequelize);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
