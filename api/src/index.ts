import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import createDatabaseConnection from 'database/createConnection';
import { addRespondToResponse } from 'middleware/response';
import { authenticateUser } from 'middleware/authentication';
import { handleError } from 'middleware/errors';
import { RouteNotFoundError } from 'errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.use('/', authenticateUser);

  attachPrivateRoutes(app);

  app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    const originalUrl = (req as any).originalUrl;
    next(new RouteNotFoundError(originalUrl));
  });

  app.use(handleError);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

createDatabaseConnection();
initializeExpress();
