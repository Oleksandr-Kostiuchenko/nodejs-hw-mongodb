//* Mongoose
import { UserCollection } from '../db/models/user.js';
import { SessionCollection } from '../db/models/session.js';

//* Http-error
import createHttpError from 'http-errors';

//* Constants
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  PATH_RESET_PWD_TEMPLATE,
} from '../constants/index.js';

//* Utils
import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { SMTP } from '../constants/index.js';
import {
  getUserFullNameByTicketPayload,
  validateCode,
} from '../utils/googleOAuth.js';

//* JWT & Handlebars
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';

//* Node
import path from 'path';
import fs from 'fs/promises';

//* Bcrypt
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedUserPassword = await bcrypt.hash(payload.password, 10);
  return await UserCollection.create({
    ...payload,
    password: hashedUserPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(401, 'Incorrect user data!');
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isCorrectPassword) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({
    userId: user._id,
  });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

const createSession = () => {
  const refreshToken = randomBytes(30).toString('base64');
  const accessToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUser = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  const isTokenExpired = new Date() > session.refreshTokenValidUntil;
  if (isTokenExpired) {
    throw createHttpError(401);
  }

  const newSession = createSession();

  await SessionCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  return await SessionCollection.findOneAndDelete({
    _id: sessionId,
    refreshToken,
  });
};

export const requestResetPassword = async (email) => {
  const user = await UserCollection.findOne({
    email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const templateSource = (
    await fs.readFile(PATH_RESET_PWD_TEMPLATE)
  ).toString();
  const template = handlebars.compile(templateSource);
  const html = template({
    user: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
  });

  try {
    await sendMail({
      to: email,
      from: getEnvVar(SMTP.SMTP_FROM),
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async ({ token, password }) => {
  let entries;

  try {
    entries = jwt.verify(token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UserCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  await SessionCollection.deleteOne({
    userId: entries.sub,
  });

  const encryptedPassword = await bcrypt.hash(password, 10);
  return await UserCollection.findOneAndUpdate(
    { _id: entries.sub },
    { password: encryptedPassword },
  );
};

//* CONFIRM GOOGLE AUTH
export const confirmGoogleAuth = async (code) => {
  const userCode = await validateCode(code);
  const payload = await userCode.getPayload();
  const userFullName = getUserFullNameByTicketPayload(payload);

  let user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    const hashedUserPassword = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      name: userFullName,
      email: payload.email,
      password: hashedUserPassword,
    });
  }

  const newSession = createSession();
  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};
