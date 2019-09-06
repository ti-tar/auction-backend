import { HttpException, NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from '../config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      const decoded: any = jwt.verify(token, SECRET);

      const user = await this.usersService.findOneById(decoded.id);

      if (!user) {
        throw new HttpException({ message: 'User not found.'}, HttpStatus.UNAUTHORIZED);
      }

      req.user = user;
      next();

    } else {
      throw new HttpException({ message: 'You are not authorized.'}, HttpStatus.UNAUTHORIZED);
    }
  }
}
