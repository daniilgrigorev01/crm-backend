import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContactDto } from './create-contact.dto';

export class CreateClientDto {
  @ApiProperty({ example: 'Иван' })
  @IsAlpha('ru-RU', {
    message: 'Имя может содержать только русские буквы',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не может быть пустым' })
  firstName: string;

  @ApiProperty({ example: 'Васильев' })
  @IsAlpha('ru-RU', {
    message: 'Фамилия может содержать только русские буквы',
  })
  @IsString({ message: 'Фамилия может быть только строкой' })
  @IsNotEmpty({ message: 'Фамилия не может быть пустой' })
  lastName: string;

  @ApiProperty({ required: false, example: 'Петрович' })
  @IsAlpha('ru-RU', {
    message: 'Отчество может содержать только русские буквы',
  })
  @IsString({ message: '' })
  @IsOptional()
  patronymic?: string;

  @ApiProperty({ required: false, type: [CreateContactDto] })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateContactDto)
  @IsArray({ message: 'Список контактов должен являться массивом' })
  @IsOptional()
  contacts?: CreateContactDto[];
}
