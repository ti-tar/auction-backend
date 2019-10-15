import { getMockedUserByField } from './users';
import moment = require('moment');

export const getMockedLotByField = (fieldOptions) => {
  let lot = mockedLotsFromDB;
  Object.keys(fieldOptions).forEach(k => {
    lot = lot.filter(l => l[k] === fieldOptions[k]);
  });
  return lot.length ? {...lot[0]} : undefined;
};

export const mockedLotsFromDB = [
  { id: 1,
    title: 'Chicken',
    image: 'marketing_lead.jpg',
    description: 'Et modi et quia voluptas cum dolorem qui eos. Velit ...',
    status: 'pending',
    currentPrice: 63,
    estimatedPrice: 1584,
    startTime: '2019-10-04T10:44:49.238Z',
    endTime: moment().add(1, 'days').toISOString(),
    user: getMockedUserByField({id: 1}),
    bids: [],
  },
  { id: 101,
    title: 'Salad',
    image: 'connect.jpg',
    description: 'Praesentium voluptas deleniti consectetur iste. Ex voluptas ...',
    status: 'inProcess',
    currentPrice: 820,
    estimatedPrice: 2618,
    startTime: '2019-10-06T21:42:53.437Z',
    endTime: '2019-10-23T06:04:49.836Z',
    user: getMockedUserByField({id: 1}),
    bids: [],
  },
  {
    id: 27,
    title: 'Towels',
    image: 'health.jpg',
    description: 'Id in officia dolore. Ut facere rerum omnis facilis esse ...',
    status: 'pending',
    currentPrice: 251,
    estimatedPrice: 3028,
    startTime: '2019-01-08T07:25:02.972Z',
    endTime: moment().subtract(1, 'days'),
    user: getMockedUserByField({id: 1}),
    bids: [],
  },
  {
    id: 135,
    title: 'Car',
    image: 'haptic_adp_cross_platform.jpg',
    description: 'Sint quia quod ipsam consequatur iusto veniam id consequatur. ...',
    status: 'inProcess',
    currentPrice: 147,
    estimatedPrice: 1614,
    startTime: '2019-10-05T11:56:27.968Z',
    endTime: '2019-10-15T00:07:09.320Z',
    user: null,
    bids: [],
  },
  {
    id: 39,
    title: 'Keyboard',
    image: 'fuchsia_navigating.jpg',
    description: 'Reprehenderit aliquid quis aut aspernatur quia vel ipsum enim...',
    status: 'inProcess',
    currentPrice: 921,
    estimatedPrice: 3661,
    startTime: '2019-10-08T07:36:19.679Z',
    endTime: '2019-10-28T05:46:09.054Z',
    user: null,
    bids: [],
  },
];
