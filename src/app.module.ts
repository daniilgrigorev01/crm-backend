import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [PrismaModule.forRoot({ isGlobal: true }), ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
