import { createConnection, Connection } from 'typeorm';

import * as entities from 'entities';

const createDatabaseConnection = (): Promise<Connection> => {
  return new Promise((resolve, reject) => {
    const connection = createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: Object.values(entities),
      synchronize: true,
    });

    connection
      .then(dbConnection => {
        // Connection succeeded
        console.log('Database connection established');
        resolve(dbConnection);
      })
      .catch(error => {
        // Connection failed
        console.log('Database connecton error', error);
        reject(error);
      });
  });
};

export default createDatabaseConnection;
