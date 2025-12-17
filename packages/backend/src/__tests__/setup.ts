import { beforeEach } from '@jest/globals';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>();

// Reset all mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
});

// Export the mock type for use in tests
export type PrismaMockType = DeepMockProxy<PrismaClient>;
