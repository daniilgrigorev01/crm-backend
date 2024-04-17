import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { CreateClientDTO } from './dto/create-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { CreateContactDTO } from './dto/create-contact.dto';
import { GetContactDTO } from './dto/get-contact.dto';
import { ExtendedPrismaClient } from '../prisma.extension';
import { PaginatedClientsDTO } from './dto/paginated-clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @Inject('PrismaService')
    private readonly prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async findById(id: string): Promise<GetClientDTO> {
    return await this.prismaService.client.client.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        contacts: true,
      },
    });
  }

  async findAll(
    limit: number,
    page: number,
    sortBy: string,
    sortOrder: string,
  ): Promise<PaginatedClientsDTO> {
    const [clients, meta] = await this.prismaService.client.client
      .paginate({
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          contacts: true,
        },
      })
      .withPages({
        limit,
        page,
        includePageCount: true,
      });

    return {
      clients,
      meta,
    };
  }

  async create(client: CreateClientDTO): Promise<GetClientDTO> {
    const normalizedFirstName: string =
      client.firstName.trim().charAt(0).toUpperCase() +
      client.firstName.trim().toLowerCase().slice(1);
    const normalizedLastName: string =
      client.lastName.trim().charAt(0).toUpperCase() +
      client.lastName.trim().toLowerCase().slice(1);

    const normalizedPatronymic: string | undefined = client.patronymic
      ? client.patronymic.trim().charAt(0).toUpperCase() +
        client.patronymic.trim().toLowerCase().slice(1)
      : undefined;

    return await this.prismaService.client.client.create({
      data: {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        patronymic: normalizedPatronymic,
        contacts: {
          createMany: {
            data: [...(client.contacts ?? [])],
          },
        },
      },
      include: {
        contacts: true,
      },
    });
  }

  async updateClient(id: string, client: UpdateClientDTO): Promise<void> {
    const normalizedFirstName: string | undefined = client.firstName
      ? client.firstName.trim().charAt(0).toUpperCase() +
        client.firstName.trim().toLowerCase().slice(1)
      : undefined;
    const normalizedLastName: string | undefined = client.lastName
      ? client.lastName.trim().charAt(0).toUpperCase() +
        client.lastName.trim().toLowerCase().slice(1)
      : undefined;

    const normalizedPatronymic: string | undefined = client.patronymic
      ? client.patronymic.trim().charAt(0).toUpperCase() +
        client.patronymic.trim().toLowerCase().slice(1)
      : undefined;

    await this.prismaService.client.client.update({
      where: {
        id,
      },
      data: {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        patronymic: normalizedPatronymic,
      },
    });
  }

  async updateClientContacts(
    id: string,
    contacts: CreateContactDTO[],
  ): Promise<void> {
    await this.prismaService.client.$transaction(async (tr): Promise<void> => {
      await tr.contact.deleteMany({
        where: {
          clientId: id,
        },
      });

      const updatedContacts: Omit<GetContactDTO, 'id'>[] = contacts.map(
        (contact: CreateContactDTO): Omit<GetContactDTO, 'id'> => ({
          type: contact.type,
          value: contact.value,
          clientId: id,
        }),
      );

      await tr.contact.createMany({
        data: updatedContacts,
      });
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.client.client.delete({
      where: {
        id,
      },
    });
  }
}
