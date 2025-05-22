const parseIsFavourite = (isFav) => {
  if (isFav === 'true' || isFav === 'false') {
    return isFav;
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
  const { isFavourite, contactType } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
};
