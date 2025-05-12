//* Express & libs
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

//* Utils
import { getEnvVar } from './utils/getEnvVar.js';

//* Routes
import {
  getWelcomeRouter,
  getContactsRouter,
  getContactByIdRouter,
} from './routers/contactsRouter.js';

export const setupServer = () => {
  const app = express();

  // Lib middlewares
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // GET routes
  app.get('/', getWelcomeRouter);
  app.get('/contacts', getContactsRouter);
  app.get('/contacts/:contactId', getContactByIdRouter);

  // Errors middlewares
  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      message: `Not found`,
    });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Sorry! Something went wrong...',
    });
  });

  // Server listener
  const PORT = getEnvVar('PORT', 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port!`);
  });
};
