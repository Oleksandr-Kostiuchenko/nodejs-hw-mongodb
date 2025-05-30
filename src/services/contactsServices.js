//* Constants
import { ROLES } from '../constants/index.js';

//* Mongoose
import { ContactsCollection } from '../db/models/contact.js';

//* Utils
import { calcPaginationData } from '../utils/calcPaginationData.js';

//* GET
export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  isFavourite,
  contactType,
  myContacts,
  user,
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  let contactsQuery;
  if (user.role === ROLES.USER) {
    contactsQuery = ContactsCollection.find({
      userId: user._id,
    });
  } else if (user.role === ROLES.ADMIN) {
    contactsQuery = ContactsCollection.find();
  }

  // myContacts - filter option for admins
  if (myContacts) {
    contactsQuery.where('userId').equals(user._id);
  }
  if (isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }
  if (contactType !== undefined) {
    contactsQuery.where('contactType').equals(contactType);
  }

  const contactsCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();
  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const paginationData = calcPaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};
export const getContactById = async ({ contactId, user }) => {
  let contact;

  if (user.role === ROLES.USER) {
    contact = await ContactsCollection.findOne({
      _id: contactId,
      userId: user._id,
    });
  } else if (user.role === ROLES.ADMIN) {
    contact = await ContactsCollection.findById(contactId);
  }

  return contact;
};

//* CREATE
export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

//* PATCH
export const patchContact = async ({ contactId, body, user }) => {
  let result;

  if (user.role === ROLES.USER) {
    result = await ContactsCollection.findOneAndUpdate(
      { _id: contactId, userId: user._id },
      body,
      { new: true, includeResultMetadata: true },
    );
  } else if (user.role === ROLES.ADMIN) {
    result = await ContactsCollection.findOneAndUpdate(
      { _id: contactId },
      body,
      { new: true, includeResultMetadata: true },
    );
  }

  if (!result || !result.value) return null;

  return result.value;
};

//* DELETE
export const deleteContact = async ({ contactId, user }) => {
  let contact;

  if (user.role === ROLES.USER) {
    contact = await ContactsCollection.findOneAndDelete({
      _id: contactId,
      userId: user._id,
    });
  } else if (user.role === ROLES.ADMIN) {
    contact = await ContactsCollection.findOneAndDelete({
      _id: contactId,
    });
  }

  return contact;
};
