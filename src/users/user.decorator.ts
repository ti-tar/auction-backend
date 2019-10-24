import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, req) => {
  if ( !req.user ) {
    throw new UnauthorizedException('Unauthorized. Try to relogin.');
  }
  return req.user;
});

export interface IUserDecorator {
  lots: null;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  bids: null;
  id: number;
  email: string;
  status: string;
  token: string;
}
