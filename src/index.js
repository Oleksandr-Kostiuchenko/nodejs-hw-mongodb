//* Server & Mongo
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

//* Utils & Constants
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createDirIfNoExists } from './utils/createDirIfNoExists.js';

const bootstrap = async () => {
  await initMongoConnection();

  await createDirIfNoExists(TEMP_UPLOAD_DIR);
  await createDirIfNoExists(UPLOAD_DIR);

  setupServer();
};

bootstrap();
