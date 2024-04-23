import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { GetUserDTO } from './dto/get-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUsername(username: string): Promise<GetUserDTO> {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        username,
      },
    });
  }

  async findById(id: string): Promise<GetUserDTO> {
    return await this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async create(user: CreateUserDTO): Promise<GetUserDTO> {
    return await this.prismaService.user.create({
      data: {
        username: user.username,
        password: user.password,
      },
    });
  }
}
