import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class RegistrationUserDTO {
  @ApiProperty({ example: 'username' })
  @Matches(/\w+/, {
    message:
      'Имя пользователя может состоять только из: латинских букв, цифр 0-9 и символа _',
  })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  username: string;

  @ApiProperty({ example: 'password' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    },
    {
      message:
        'Пароль должен иметь длину не менее 8 символов и может состоять только из: латинских букв, цифр 0-9 и спецсимволов',
    },
  )
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  password: string;
}
