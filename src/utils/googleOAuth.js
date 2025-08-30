//* Google OAuth
import { OAuth2Client } from 'google-auth-library';

//* Node
import fs from 'fs/promises';
import path from 'node:path';

//* Vars
import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';
const PATH_TO_OAUTH_CONFIG = path.join(process.cwd(), 'google-oauth.json');

const oAuthConfig = JSON.parse(await fs.readFile(PATH_TO_OAUTH_CONFIG));

const oAuthClient = new OAuth2Client({
  client_id: getEnvVar('CLIENT_ID'),
  client_secret: getEnvVar('CLIENT_SECRET'),
  redirectUri: oAuthConfig.web.redirect_uris[0],
});

export const generateOAuthURL = () => {
  return oAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
};

export const validateCode = async (code) => {
  const response = await oAuthClient.getToken(code);
  if (!response.tokens.id_token) return createHttpError(401, 'Unauthorized');

  const ticket = await oAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getUserFullNameByTicketPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }
  return fullName;
};
