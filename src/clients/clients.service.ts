import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateClientDTO } from './dto/create-client.dto';
import { GetClientDTO } from './dto/get-client.dto';
import { UpdateClientDTO } from './dto/update-client.dto';
import { CreateContactDTO } from './dto/create-contact.dto';
import { GetContactDTO } from './dto/get-contact.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string): Promise<GetClientDTO> {
    return await this.prisma.client.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        contacts: true,
      },
    });
  }

  async create(client: CreateClientDTO): Promise<GetClientDTO> {
    return await this.prisma.client.create({
      data: {
        firstName: client.firstName,
        lastName: client.lastName,
        patronymic: client.patronymic,
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
    await this.prisma.client.update({
      where: {
        id,
      },
      data: {
        firstName: client.firstName,
        lastName: client.lastName,
        patronymic: client.patronymic,
      },
    });
  }

  async updateClientContacts(
    id: string,
    contacts: CreateContactDTO[],
  ): Promise<void> {
    await this.prisma.$transaction(async (tr): Promise<void> => {
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
    await this.prisma.client.delete({
      where: {
        id,
      },
    });
  }
}
