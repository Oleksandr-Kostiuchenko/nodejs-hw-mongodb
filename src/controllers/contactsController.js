//* Services
import {
  getContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contactsServices.js';

//* Http-error
import createHttpError from 'http-errors';

//* Utils
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

//* GET
export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const { isFavourite, contactType, myContacts } = parseFilterParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    isFavourite,
    contactType,
    myContacts,
    user: req.user,
  });

  if (!contacts) {
    throw createHttpError(404, 'Contacts not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Contacts are successfully found!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById({ contactId, user: req.user });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with ${contactId} ID!`,
    data: contact,
  });
};

//* POST
export const createContactController = async (req, res, next) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else if (getEnvVar('ENABLE_CLOUDINARY') === 'false') {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Contact successfully created!',
    data: contact,
  });
};

//* PATCH
export const patchContactController = async (req, res, next) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else if (getEnvVar('ENABLE_CLOUDINARY') === 'false') {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const { contactId } = req.params;
  const result = await patchContact({
    contactId,
    body: { ...req.body, photo: photoUrl },
    user: req.user,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact',
    data: result,
  });
};

//* DELETE
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact({ contactId, user: req.user });

  if (!contact) {
    throw createHttpError(404, 'Contact not found!');
  }

  res.status(204).json({
    status: 204,
    message: 'Contact successfully deleted!',
    data: contact,
  });
};
