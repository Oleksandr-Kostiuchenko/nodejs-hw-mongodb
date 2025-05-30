//* Express & Libs
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

//* Middlewares
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

//* Routers
import router from './routers/index.js';

//* Utils
import { getEnvVar } from './utils/getEnvVar.js';

export const setupServer = () => {
  // PORT & Server
  const PORT = getEnvVar('PORT', 3000);
  const app = express();

  // Basic middlewares
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res, next) => {
    res.json({
      message: 'Welcome to contacts manager!',
    });
  });

  // Routers
  app.use(router);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Server listener
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port!`);
  });
};
