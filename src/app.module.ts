import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma';
import { ClientsModule } from './clients/clients.module';
import { extendedPrismaClient } from './prisma.extension';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
    ClientsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
