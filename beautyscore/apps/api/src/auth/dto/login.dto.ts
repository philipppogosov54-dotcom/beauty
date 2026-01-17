import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(1, { message: 'Введите пароль' })
  @MaxLength(128)
  password: string;
}
