//* Services
import { getContacts, getContactById } from '../services/contacts.js';

export const getWelcomeRouter = (req, res) => {
  res.json({
    message: 'Welcome to contacts webservice!',
  });
};

export const getContactsRouter = async (req, res) => {
  const contactsData = await getContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

export const getContactByIdRouter = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact) {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `Contact not found!`,
    });
  }
};
