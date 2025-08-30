//* Express
import express from 'express';
const router = express.Router();

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

//* Controllers
import {
  registerUserController,
  loginUserController,
  refreshUserController,
  logoutUserController,
  requestResetPasswordController,
  resetPasswordController,
} from '../controllers/authControllers.js';

//* REGISTER
router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

//* LOGIN
router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

//* REFRESH
router.post('/refresh', ctrlWrapper(refreshUserController));

//* LOGOUT
router.post('/logout', ctrlWrapper(logoutUserController));

//* REQUEST-RESET-PASSWORD
router.post(
  '/send-reset-email',
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordController),
);

//* RESET-PASSWORD
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
