import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly passwordConfirm: string;

  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
