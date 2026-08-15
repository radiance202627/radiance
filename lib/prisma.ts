import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres.jirnbhdyfatvnlftzmos:pa%2F%2C2cFFjm!g%2F%263@aws-0-us-west-2.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true';

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
 * Wraps a Prisma query with a fast timeout (default 15000ms) to ensure UI responsiveness
 * if PostgreSQL database server is offline or unreachable.
 */
export async function withDbTimeout<T>(promise: Promise<T>, timeoutMs = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database query timed out')), timeoutMs)
    ),
  ]);
}

export default prisma;
