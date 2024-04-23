import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
