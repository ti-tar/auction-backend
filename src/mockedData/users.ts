import { findOneMockFromMocked } from './helpers';

export const getMockedUserByField = (fieldsToFind) => findOneMockFromMocked(fieldsToFind, mockedUsersFromDB);

export const mockedUsersFromDB = [
  {
    id: 1,
    email: 'user1@gmail.com',
    phone: '380991234567',
    password: '6d6cd63284be4a47ba7aec4a3458939a95dcbdd5cd0438f23d7457099b4b917c',
    firstName: 'Approved User',
    lastName: 'lastName',
    status: 'approved',
    token: 'token_user_1',
    lots: null,
    bids: null,
    beforeInsert: null,
  },
  {
    id: 2,
    email: 'user2@gmail.com',
    phone: '380991234567',
    password: '6d6cd63284be4a47ba7aec4a3458939a95dcbdd5cd0438f23d7457099b4b917c',
    firstName: 'Pending User',
    lastName: 'lastName',
    status: 'pending',
    token: 'token_user_2',
    lots: null,
    bids: null,
    beforeInsert: null,
  },
  {
    id: 3,
    email: 'user3@gmail.com',
    phone: '380991234567',
    password: '6d6cd63284be4a47ba7aec4a3458939a95dcbdd5cd0438f23d7457099b4b917c',
    firstName: 'Approved User #2',
    lastName: 'lastName',
    status: 'approved',
    token: 'token_user_3',
    lots: null,
    bids: null,
    beforeInsert: null,
  },
];
