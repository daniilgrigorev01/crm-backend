import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContactDTO } from './create-contact.dto';

export class CreateClientDTO {
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

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Петрович',
  })
  @IsAlpha('ru-RU', {
    message: 'Отчество может содержать только русские буквы',
  })
  @IsString({ message: 'Отчество должно быть строкой' })
  @IsOptional()
  patronymic: string | null;

  @ApiProperty({ required: false, type: [CreateContactDTO] })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateContactDTO)
  @ArrayMaxSize(10, {
    message: 'Список контактов не может быть длиннее 10 контактов',
  })
  @Type(() => CreateContactDTO)
  @IsArray({ message: 'Список контактов должен являться массивом' })
  @IsOptional()
  contacts: CreateContactDTO[] | null;
}
