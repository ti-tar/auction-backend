import { findOneMockFromMocked } from './helpers';

export const getMockedBidByField = (fieldsToFind) => findOneMockFromMocked(fieldsToFind, mockedBids);

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
