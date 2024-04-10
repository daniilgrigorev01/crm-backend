import { EContact } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { ValidateContact } from '../decorators/validate-contact.decorator';

export class CreateContactDto {
  @ApiProperty({ enum: EContact })
  @IsEnum(EContact, {
    message: 'Тип контакта должен содержать разрешенное значение ',
  })
  @IsString({ message: 'Тип контакта должен быть строкой' })
  @IsNotEmpty({ message: 'Тип контакта не может быть пустым' })
  type: EContact;

  @ApiProperty({ example: '+79999999999' })
  @ValidateContact({
    message: (arguments_: ValidationArguments): string => {
      const { type } = arguments_.object as CreateContactDto;
      return `Значение контакта типа ${type} должно быть валидным`;
    },
  })
  @IsString({ message: 'Значение контакта должно быть строкой' })
  @IsNotEmpty({ message: 'Значение контакта не может быть пустым' })
  value: string;
}
