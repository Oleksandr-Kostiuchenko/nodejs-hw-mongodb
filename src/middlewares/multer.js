//* Multer
import multer from 'multer';

//* Node
import path from 'path';
import fs from 'fs/promises';

//* Constants
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
