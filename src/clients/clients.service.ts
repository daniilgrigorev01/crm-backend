import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateClientDTO } from './dto/create-client.dto';
import { GetClientDTO } from './dto/get-client.dto';

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

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: {
        id,
      },
    });
  }
}
