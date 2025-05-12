//* Express
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

//* Utils
import { getEnvVar } from './utils/getEnvVar.js';

//* Services
import { getContacts, getContactById } from './services/contacts.js';

export const setupServer = () => {
  const app = express();

  // Lib middlewares
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // GET routes
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to contacts webservice!',
    });
  });
  app.get('/contacts', async (req, res) => {
    const contactsData = await getContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contactsData,
    });
  });
  app.get('/contacts/:contactId', async (req, res) => {
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
  });

  // Errors middlewares
  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      message: `Not found`,
    });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Sorry! Something went wrong...',
    });
  });

  // Server listener
  const PORT = getEnvVar('PORT', 3000);
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port!`);
  });
};
