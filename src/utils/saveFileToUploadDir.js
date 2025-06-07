//* Node
import path from 'path';
import fs from 'fs/promises';

//* Constants & Vars
import { getEnvVar } from './getEnvVar.js';
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
