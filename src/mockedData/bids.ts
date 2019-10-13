export const getMockedBidByField = (fieldOption) => {
  const user = mockedBids.find(u => u[Object.keys(fieldOption)[0]] === Object.values(fieldOption)[0]);
  return user ? {...user} : undefined;
};

export const mockedBids = [
  { id: 1,
    proposedPrice: 123,
  },
  { id: 2,
    proposedPrice: 234,
  },
  { id: 3,
    proposedPrice: 345,
  },
  { id: 4,
    proposedPrice: 456,
  },
];
