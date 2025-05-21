//* Express
import express from 'express';
const router = express.Router();

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

// GET
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// POST
router.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

// PATCH
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

// DELETE
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
