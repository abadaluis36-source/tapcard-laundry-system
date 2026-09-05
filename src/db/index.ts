import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema.js';
import * as dotenv from 'dotenv';
dotenv.config();

let db: any;
try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
} catch {
  console.warn('[AI Studio] Database not connected — using mock');
  const createDeepMock = (): any => {
    return new Proxy(() => {}, {
      get: (_, prop) => {
        if (prop === 'then') return undefined; // Prevent infinite await loops
        return createDeepMock();
      },
      apply: () => createDeepMock(),
      construct: () => createDeepMock(),
    });
  };
  
  const noOp = { findMany: async () => [], findFirst: async () => null,
    findUnique: async () => null, create: async (d: any) => d?.data ?? {},
    update: async (d: any) => d?.data ?? {}, delete: async () => ({}) };
    
  db = new Proxy({}, {
    get: (_, prop) => {
      if (prop === 'query') return new Proxy({}, { get: () => noOp });
      if (prop === 'insert' || prop === 'select' || prop === 'update' || prop === 'delete') {
         return () => createDeepMock();
      }
      return async () => [];
    }
  });
}

export { db };
