import { redisClient } from './client.js';

export const checkRedisConnection = async (): Promise<boolean> => {
  try {
    return (await redisClient.ping()) === 'PONG';
  } catch {
    return false;
  }
};
