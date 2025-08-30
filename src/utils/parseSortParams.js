//* Constants
import { SORT_ORDER } from '../constants/index.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.asc, SORT_ORDER.desc].includes(sortOrder);
  if (!isKnownOrder) return SORT_ORDER.asc;

  return sortOrder;
};

const parseSortBy = (sortBy) => {
  const contactKeys = [
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
  ];

  if (!contactKeys.includes(sortBy)) {
    return 'name';
  }

  return sortBy;
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
