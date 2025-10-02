import jwt, {
  type SignOptions,
  type VerifyOptions,
  type JwtPayload,
} from 'jsonwebtoken';
import { generateSecureRandom } from './crypto.js';
import { config } from '@/config/loadEnv.js';
import { logger } from '@/config/logger/index.js';
import { APIError } from './apiError.js';
import bcrypt from 'bcrypt';

interface TokenPayload {
  id: string | number;
  [key: string]: any;
}

export const signAccessToken = (
  payload: TokenPayload,
  options: SignOptions = {}
): string => {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new APIError('Invalid token payload', 400);
    }

    if (!payload.id) {
      throw new APIError('User ID is required in token payload', 400);
    }

    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new APIError('JWT secret is not configured', 500);
    }

    const defaultOptions: SignOptions = {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE,
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
      algorithm: 'HS256',
      jwtid: generateSecureRandom(16),
      subject: String(payload.id),
    };

    const tokenOptions: SignOptions = { ...defaultOptions, ...options };

    const tokenPayload = {
      ...payload,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(tokenPayload, secret, tokenOptions);

    if (typeof token !== 'string') {
      throw new APIError('Failed to generate access token', 500);
    }

    return token;
  } catch (error) {
    logger.error('Access token generation failed:', error);
    if (error instanceof APIError) throw error;
    throw new APIError('Failed to generate access token', 500);
  }
};

export const signRefreshToken = (): string => {
  try {
    return generateSecureRandom(64);
  } catch (error) {
    logger.error('Refresh token generation failed:', error);
    throw new APIError('Failed to generate refresh token', 500);
  }
};

export const verifyJwtToken = (
  token: string,
  options: VerifyOptions = {}
): JwtPayload | string => {
  try {
    if (!token || typeof token !== 'string') {
      throw new APIError('Token is required for verification', 400);
    }

    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new APIError('JWT secret is not configured', 500);
    }

    const defaultOptions: VerifyOptions = {
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE,
      algorithms: ['HS256'],
    };

    const verifyOptions: VerifyOptions = { ...defaultOptions, ...options };

    const decoded = jwt.verify(token, secret, verifyOptions);

    return decoded as JwtPayload | string;
  } catch (error: any) {
    logger.error('JWT verification failed:', error);

    if (error?.name === 'TokenExpiredError') {
      throw new APIError('Token has expired', 401);
    } else if (error?.name === 'JsonWebTokenError') {
      throw new APIError('Invalid token', 401);
    } else if (error?.name === 'NotBeforeError') {
      throw new APIError('Token not active yet', 401);
    }

    throw new APIError('Failed to verify token', 500);
  }
};

const BCRYPT_SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Password comparison failed:', error);
    throw new Error('Failed to compare password');
  }
};
