//* Mongoose
import { ContactsCollection } from '../db/models/contact.js';

//* GET
export const getContacts = async () => {
  const contacts = await ContactsCollection.find();

  return contacts;
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
