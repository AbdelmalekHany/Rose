import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Format connection string for Supabase pooler
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  
  // If using Supabase pooler, add required parameters
  if (url.includes('pooler.supabase.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('sslmode', 'require');
    urlObj.searchParams.set('pgbouncer', 'true');
    urlObj.searchParams.set('connection_limit', '1');
    return urlObj.toString();
  }
  
  return url;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

