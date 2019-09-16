import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      const user = await authService.validateUser(email, password);
      if (!user) {
        done(null, false, { message: 'Email or password are incorrect, or you are unregistered yet.' });
      } else {
        done(null, user);
      }
    });
  }
}
