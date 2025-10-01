import { logger } from '../../config/index.js';
import { db } from '../../config/database/index.js';
import type { NodePgTransaction } from 'drizzle-orm/node-postgres';

export const withTransaction = async <T>(
  callback: (tx: NodePgTransaction<any, any>) => Promise<T>
): Promise<T> => {
  try {
    return await db.transaction(async tx => callback(tx));
  } catch (error) {
    logger.error('DB Transaction failed:', error);
    throw error; // rethrow so the caller can handle it
  }
};
