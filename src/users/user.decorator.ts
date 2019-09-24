import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data, req) => {
  if ( !req.user ) {
    throw new UnauthorizedException('Unauthorized. Try to relogin.');
  }
  return req.user;
});
