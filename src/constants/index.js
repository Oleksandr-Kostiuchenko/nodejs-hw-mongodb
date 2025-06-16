import path from 'path';

export const SORT_ORDER = {
  asc: 'asc',
  desc: 'desc',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const FIFTEEN_MINUTES = 60 * 15 * 1000;
export const THIRTY_DAYS = 24 * 30 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const PATH_RESET_PWD_TEMPLATE = path.join(
  process.cwd(),
  'src',
  'templates',
  'requestResetTemplate.html',
);

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
