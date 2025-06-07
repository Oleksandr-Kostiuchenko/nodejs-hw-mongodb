//* Express
import express from 'express';
const router = express.Router();

//* Middlewares
import { authenticate } from '../middlewares/authMiddleware.js';

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../utils/isValidId.js';

//* Validation
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';

//* Controllers
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';

//* Middlewares
import { upload } from '../middlewares/multer.js';

// AUTH
router.use(authenticate);

// GET
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH
router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// DELETE
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
