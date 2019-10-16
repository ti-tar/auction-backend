import { isNumber } from 'util';

export function findOneMockFromMocked<T>(fetchFields: T, items) {

  const filters = isNumber(fetchFields) ? { id: fetchFields } : fetchFields;
  const filteredItems = Object.keys(filters).reduce((acc, key) => {
    return acc.filter(item => item[key] === filters[key]);
  }, items);

  return filteredItems.length ? {...filteredItems[0]} : undefined;
}
