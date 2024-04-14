import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma';
import { ClientsModule } from './clients/clients.module';
import { extendedPrismaClient } from './prisma.extension';

@Module({
  imports: [
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',
      useFactory: () => extendedPrismaClient,
    }),
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
