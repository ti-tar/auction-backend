import { IsNotEmpty } from 'class-validator';

export class ForgotUserDto {
  @IsNotEmpty()
  readonly email: string;
}
