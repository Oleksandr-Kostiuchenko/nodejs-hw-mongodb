//* Cloudinary
import cloudinary from 'cloudinary';

//* Vars
import { getEnvVar } from './getEnvVar.js';

//* Node
import path from 'path';
import fs from 'fs/promises';

cloudinary.v2.config({
  cloud_name: getEnvVar('CLOUD_NAME'),
  api_key: getEnvVar('API_KEY'),
  api_secret: getEnvVar('API_SECRET'),
});
export const saveFileToCloudinary = async (file) => {
  let uploadedFile;
  try {
    uploadedFile = await cloudinary.uploader.upload(file.path);
  } catch (error) {
    console.log(error);
  }

  await fs.unlink(file.path);

  return uploadedFile.secure_url;
};
