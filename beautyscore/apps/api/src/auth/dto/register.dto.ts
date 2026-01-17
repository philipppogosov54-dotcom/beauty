import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(8, { message: 'Пароль должен быть минимум 8 символов' })
  @MaxLength(128)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { message: 'Пароль должен содержать заглавную букву, строчную букву, цифру и спецсимвол' }
  )
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
