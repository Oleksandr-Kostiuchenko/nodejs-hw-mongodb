//* Mongoose
import { ContactsCollection } from '../db/models/contact.js';

//* Utils
import { calcPaginationData } from '../utils/calcPaginationData.js';

//* GET
export const getContacts = async (
  page = 1,
  perPage = 5,
  sortBy = 'name',
  sortOrder = 'asc',
) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  const contactsQuery = ContactsCollection.find();
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
export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);

  return contact;
};

//* CREATE
export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);

  return contact;
};

//* PATCH
export const patchContact = async (contactId, payload) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true },
  );

  if (!result || !result.value) return null;

  return result.value;
};

//* DELETE
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });

  return contact;
};
