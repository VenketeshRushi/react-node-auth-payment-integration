import { Pipeline } from 'ioredis';
import { redisClient } from './client.js';
import { logger } from '@/config/logger/index.js';

/**
 * Get value by key
 */
export const getKey = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error('Redis getKey error:', error);
    throw new Error(`Failed to get key: ${key}`);
  }
};

/**
 * Set value with optional TTL (in seconds)
 */
export const setKey = async (
  key: string,
  value: string | number,
  ttl?: number
): Promise<void> => {
  try {
    if (ttl) {
      await redisClient.setex(key, ttl, value.toString());
    } else {
      await redisClient.set(key, value.toString());
    }
  } catch (error) {
    logger.error('Redis setKey error:', error);
    throw new Error(`Failed to set key: ${key}`);
  }
};

/**
 * Increment value with optional TTL
 */
export const incrKey = async (
  key: string,
  ttl?: number,
  increment: number = 1
): Promise<number> => {
  try {
    let result: number;

    if (increment === 1) {
      result = await redisClient.incr(key);
    } else {
      result = await redisClient.incrby(key, increment);
    }

    // Set TTL only when key is newly created (result === increment)
    if (ttl && result === increment) {
      await redisClient.expire(key, ttl);
    }

    return result;
  } catch (error) {
    logger.error('Redis incrKey error:', error);
    throw new Error(`Failed to increment key: ${key}`);
  }
};

/**
 * Delete a single key
 */
export const delKey = async (key: string): Promise<number> => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    logger.error('Redis delKey error:', error);
    throw new Error(`Failed to delete key: ${key}`);
  }
};

/**
 * Delete multiple keys
 */
export const delKeys = async (keys: string[]): Promise<number> => {
  try {
    if (keys.length === 0) return 0;
    return await redisClient.del(...keys);
  } catch (error) {
    logger.error('Redis delKeys error:', error);
    throw new Error(`Failed to delete keys: ${keys.join(', ')}`);
  }
};

/**
 * Check if key exists
 */
export const exists = async (key: string): Promise<boolean> => {
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    logger.error('Redis exists error:', error);
    throw new Error(`Failed to check existence of key: ${key}`);
  }
};

/**
 * Get TTL of a key
 */
export const getTTL = async (key: string): Promise<number> => {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    logger.error('Redis getTTL error:', error);
    throw new Error(`Failed to get TTL for key: ${key}`);
  }
};

/**
 * Set expiry for a key
 */
export const expire = async (key: string, ttl: number): Promise<boolean> => {
  try {
    const result = await redisClient.expire(key, ttl);
    return result === 1;
  } catch (error) {
    logger.error('Redis expire error:', error);
    throw new Error(`Failed to set expiry for key: ${key}`);
  }
};

/**
 * Create a Redis pipeline for batch operations
 */
export const pipeline = (): Pipeline => {
  return redisClient.pipeline() as Pipeline;
};
