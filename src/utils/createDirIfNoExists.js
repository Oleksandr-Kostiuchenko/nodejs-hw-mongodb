//* Node
import path from 'node:path';
import fs from 'fs/promises';

export const createDirIfNoExists = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return await fs.mkdir(url);
    }
    throw error;
  }
};
