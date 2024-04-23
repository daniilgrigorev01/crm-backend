import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ClientsService } from './clients.service';
import { CreateClientDTO } from './dto/create-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { PaginatedClientsDTO } from './dto/paginated-clients.dto';
import { ClientsQueryParametersDTO } from './dto/clients-query-parameters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Clients')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: GetClientDTO, description: 'Клиент найден' })
  @ApiNotFoundResponse({ description: 'Клиент с таким ID не найден' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при поиске клиента',
  })
  @ApiUnauthorizedResponse({ description: 'Нет авторизации' })
  async findById(@Param('id') id: string): Promise<GetClientDTO> {
    try {
      const client: GetClientDTO = await this.clientsService.findById(id);

      return plainToInstance(GetClientDTO, client);
    } catch (error) {
      throw error instanceof Prisma.PrismaClientKnownRequestError
        ? error
        : new InternalServerErrorException(
            'Ошибка при поиске уникального клиента в базе данных',
          );
    }
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiOkResponse({ type: PaginatedClientsDTO })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при получении списка клиентов',
  })
  @ApiUnauthorizedResponse({ description: 'Нет авторизации' })
  async findAll(
    @Query() query: ClientsQueryParametersDTO,
  ): Promise<PaginatedClientsDTO> {
    try {
      const pageClients: PaginatedClientsDTO =
        await this.clientsService.findAll(
          query.limit ?? 10,
          query.page ?? 1,
          query.sortBy ?? 'createdAt',
          query.sortOrder ?? 'asc',
          query.search,
        );
      return plainToInstance(PaginatedClientsDTO, pageClients);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Ошибка валидации данных при получении списка клиентов из базы данных',
        );
      } else {
        throw new InternalServerErrorException(
          'Ошибка при получении списка клиентов из базы данных',
        );
      }
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
  @ApiUnauthorizedResponse({ description: 'Нет авторизации' })
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

  @Patch(':id')
  @ApiOkResponse({
    type: GetClientDTO,
    description: 'Данные клиента обновлены',
  })
  @ApiNotFoundResponse({ description: 'Клиент не найден' })
  @ApiConflictResponse({ description: 'Нарушение уникального ограничения' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при обновлении записи в базе данных',
  })
  @ApiUnauthorizedResponse({ description: 'Нет авторизации' })
  async update(
    @Param('id') id: string,
    @Body() client: UpdateClientDTO,
  ): Promise<GetClientDTO> {
    try {
      await this.clientsService.updateClient(id, client);

      if (client.contacts) {
        await this.clientsService.updateClientContacts(id, client.contacts);
      }

      const updatedClient: GetClientDTO =
        await this.clientsService.findById(id);

      return plainToInstance(GetClientDTO, updatedClient);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Ошибка валидации данных при обновлении клиента в базе данных',
        );
      } else {
        throw new InternalServerErrorException(
          'Ошибка при обновлении клиента в базе данных',
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
  @ApiUnauthorizedResponse({ description: 'Нет авторизации' })
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
