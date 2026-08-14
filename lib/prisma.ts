import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:pa%2F%2C2cFFjm!g%2F%263@db.jirnbhdyfatvnlftzmos.supabase.co:5432/postgres?schema=public';

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: connectionUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Wraps a Prisma query with a fast timeout (default 2000ms) to ensure UI responsiveness
 * if PostgreSQL database server is offline or unreachable.
 */
export async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 2000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

export default prisma;
