//* Constants
import { THIRTY_DAYS } from '../constants/index.js';

//* Services
import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} from '../services/authServices.js';

export const registerUserController = async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'User successfully registered!',
    data: {
      user,
    },
  });
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).json({
    status: 200,
    message: 'Logined user successfully!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const setUpSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserController = async (req, res, next) => {
  const session = await refreshUser({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setUpSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Succesfully refreshed a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res, next) => {
  const user = await logoutUser({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
