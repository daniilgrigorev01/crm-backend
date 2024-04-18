import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ClientsQueryParametersDTO {
  @ApiProperty({ required: false, example: '10' })
  @Min(1, { message: 'Лимит не может быть меньше 1' })
  @IsNumber({}, { message: 'Лимит должен быть числом' })
  @Type(() => Number)
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, example: '1' })
  @Min(1, { message: 'Номер страницы не может быть меньше 1' })
  @IsNumber({}, { message: 'Номер страницы должен быть числом' })
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsIn(['firstName', 'lastName', 'patronymic', 'createdAt', 'updatedAt'], {
    message:
      'Значение поля для сортировки должно быть одним из списка: firstName, lastName, patronymic, createdAt, updatedAt',
  })
  @IsOptional()
  sortBy?: 'firstName' | 'lastName' | 'patronymic' | 'createdAt' | 'updatedAt';

  @ApiProperty({ required: false, example: 'asc' })
  @IsIn(['asc', 'desc'], {
    message: 'Направлении сортировки может быть только: asc или desc',
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ required: false, example: 'Васильев Иван' })
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  @IsOptional()
  search?: string;
}
