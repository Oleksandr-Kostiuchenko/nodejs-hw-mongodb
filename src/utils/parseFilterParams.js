const parseBoolean = (value) => {
  if (value === 'true' || value === 'false') {
    return value;
  }

  return undefined;
};

const parseContactType = (contactType) => {
  const types = ['personal', 'home', 'work'];
  if (!types.includes(contactType)) {
    return undefined;
  }

  return contactType;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType, myContacts } = query;

  const parsedIsFavourite = parseBoolean(isFavourite);
  const parsedMyContacts = parseBoolean(myContacts);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
    myContacts: parsedMyContacts,
  };
};
