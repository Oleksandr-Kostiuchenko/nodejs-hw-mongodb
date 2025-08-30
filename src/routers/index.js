//* Express
import express from 'express';
const router = express.Router();

//* Routers
import contactsRouter from '../routers/contactsRouter.js';
import authRouter from '../routers/authRouters.js';

router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
