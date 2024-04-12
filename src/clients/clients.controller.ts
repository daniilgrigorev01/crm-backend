import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ClientsService } from './clients.service';
import { CreateClientDTO } from './dto/create-client.dto';
import { GetClientDTO } from './dto/get-client.dto';

@ApiTags('Clients')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  @ApiOkResponse({ type: GetClientDTO, description: 'Клиент найден' })
  @ApiNotFoundResponse({ description: 'Клиент с таким ID не найден' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при поиске клиента',
  })
  async findOne(@Param('id') id: string): Promise<GetClientDTO> {
    try {
      const client: GetClientDTO = await this.clientsService.findOne(id);

      return plainToInstance(GetClientDTO, client);
    } catch (error) {
      throw error instanceof Prisma.PrismaClientKnownRequestError
        ? error
        : new InternalServerErrorException(
            'Ошибка при поиске уникального клиента в базе данных',
          );
    }
  }

  @Post()
  @ApiCreatedResponse({
    type: GetClientDTO,
    description: 'Клиент добавлен в базу данных',
  })
  @ApiConflictResponse({ description: 'Нарушение уникального ограничения' })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации данных',
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при записи в базу данных',
  })
  async create(@Body() client: CreateClientDTO): Promise<GetClientDTO> {
    try {
      const newClient: GetClientDTO = await this.clientsService.create(client);

      return plainToInstance(GetClientDTO, newClient);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Ошибка валидации данных при добавлении клиента в базу данных',
        );
      } else {
        throw new InternalServerErrorException(
          'Ошибка при добавлении клиента в базу данных',
        );
      }
    }
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Клиент успешно удален' })
  @ApiNotFoundResponse({ description: 'Клиент не найден' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при удалении из база данных',
  })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.clientsService.delete(id);
    } catch (error) {
      throw error instanceof Prisma.PrismaClientKnownRequestError
        ? error
        : new InternalServerErrorException(
            'Ошибка при удалении клиента из базы данных',
          );
    }
  }
}
