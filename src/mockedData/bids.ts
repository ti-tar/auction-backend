import { isNumber } from 'util';

export const getMockedBidByField = <T>(fieldOptions: T) => {
  let items = mockedBids;
  const filters = isNumber(fieldOptions) ? { id: fieldOptions } : fieldOptions;

  Object.keys(filters).forEach(k => {
    items = items.filter(item => item[k] === filters[k]);
  });
  return items.length ? {...items[0]} : undefined;
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
