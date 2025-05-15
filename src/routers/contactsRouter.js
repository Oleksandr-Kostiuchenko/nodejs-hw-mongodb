//* Express
import express from 'express';
const router = express.Router();

//* Utils
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

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
router.get('/:contactId', ctrlWrapper(getContactByIdController));

// POST
router.post('/', ctrlWrapper(createContactController));

// PATCH
router.patch('/:contactId', ctrlWrapper(patchContactController));

// DELETE
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
