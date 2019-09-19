import { IsNotEmpty } from 'class-validator';

export class ResetUserDto {
  @IsNotEmpty()
  readonly password: string;
  @IsNotEmpty()
  readonly passwordConfirmation: string;
  @IsNotEmpty()
  readonly token: string;
}
