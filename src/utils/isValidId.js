//* Validation & Http-error
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    const error = createHttpError(400, 'Bad request');
    return next(error);
  }

  next();
};
