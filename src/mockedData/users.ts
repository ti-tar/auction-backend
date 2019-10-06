export const getMockedUserByField = (field: string, value: any) => {
  const user = mockedUsersFromDB.find(u => u[field] === value);
  return user ? {...user} : undefined;
};

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
  }, {
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
  },
];
