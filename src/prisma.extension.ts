import { PrismaClient } from '@prisma/client';
import { paginate } from 'prisma-extension-pagination';

export const extendedPrismaClient = new PrismaClient().$extends({
  model: {
    client: {
      paginate,
    },
  },
});

export type ExtendedPrismaClient = typeof extendedPrismaClient;
