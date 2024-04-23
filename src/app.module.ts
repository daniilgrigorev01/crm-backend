import { Module } from '@nestjs/common';
import { CustomPrismaModule } from 'nestjs-prisma';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore, RedisStore } from 'cache-manager-ioredis-yet';
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
    RedisModule.forRoot({
      type: 'single',
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store: RedisStore = await redisStore({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          ttl: 1000 * 30,
        });

        return {
          store,
        };
      },
    }),
    ClientsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
