//* Server & Connection
import { setupServer } from './server.js';
import { initMongoDbConnection } from './db/initMongoConnection.js';

const bootstrap = async () => {
  await initMongoDbConnection();
  setupServer();
};

bootstrap();
