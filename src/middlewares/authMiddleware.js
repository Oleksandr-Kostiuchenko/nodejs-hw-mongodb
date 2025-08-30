//* Mongoose
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

//* Http-error
import createHttpError from 'http-errors';

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  const authArr = authorization.split(' ', 2);
  if (
    typeof authorization !== 'string' ||
    authArr[0] !== 'Bearer' ||
    typeof authArr[1] !== 'string'
  ) {
    next(createHttpError(401, 'Please provide Bearer authorization'));
  }

  const session = await SessionCollection.findOne({
    accessToken: authArr[1],
  });
  if (!session) {
    next(createHttpError(401, 'Session not found!'));
  }
  const isTokenExpired = new Date() > session.accessTokenValidUntil;
  if (isTokenExpired) {
    next(createHttpError(401, 'Token expired!'));
  }

  const user = await UserCollection.findOne({
    _id: session.userId,
  });
  if (!user) {
    next(createHttpError(401, 'User not found!'));
  }

  req.user = user;
  next();
};
