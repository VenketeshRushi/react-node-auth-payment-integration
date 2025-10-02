import { eq, or } from 'drizzle-orm';

import { APIError } from '@/utils/apiError.js';
import {
  CreateUserData,
  CreatedUser,
  ExistingUser,
  UserConflictCheck,
} from '@/types/user.types.js';
import { logger } from '@/config/logger/index.js';
import { withTransaction } from '@/services/database/utils/transaction.js';
import { usersTable } from '@/models/users.model.js';

export const checkUserExists = async ({
  email,
  mobile_no,
}: UserConflictCheck): Promise<{
  exists: boolean;
  conflictField?: 'email' | 'mobile';
  user?: ExistingUser;
}> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile_no.trim();

    const existingUsers = await withTransaction(async tx => {
      return tx
        .select({
          id: usersTable.id,
          email: usersTable.email,
          mobile_no: usersTable.mobile_no,
        })
        .from(usersTable)
        .where(
          or(
            eq(usersTable.email, cleanEmail),
            eq(usersTable.mobile_no, cleanMobile)
          )
        )
        .limit(1);
    });

    if (existingUsers.length === 0) {
      return { exists: false };
    }

    const user = existingUsers[0];
    const conflictField = user?.email === cleanEmail ? 'email' : 'mobile';

    return {
      exists: true,
      conflictField,
      user: {
        id: user!.id,
        email: user!.email,
        mobile_no: user!.mobile_no,
      },
    };
  } catch (error) {
    logger.error('Failed to check user existence:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    throw new APIError('Database query failed', 500, 'DB_ERROR');
  }
};

export const createUser = async (
  userData: CreateUserData
): Promise<CreatedUser> => {
  try {
    const cleanData = {
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      mobile_no: userData.mobile_no.trim(),
      password: userData.password,
    };

    const newUser = await withTransaction(async tx => {
      // Double-check for conflicts within the transaction
      const existingUser = await tx
        .select()
        .from(usersTable)
        .where(
          or(
            eq(usersTable.email, cleanData.email),
            eq(usersTable.mobile_no, cleanData.mobile_no)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        throw new APIError(
          'User registration failed due to conflicts',
          409,
          'USER_EXISTS'
        );
      }

      const [insertedUser] = await tx
        .insert(usersTable)
        .values({
          name: cleanData.name,
          email: cleanData.email,
          mobile_no: cleanData.mobile_no,
          password: cleanData.password,
          is_active: true,
        })
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          mobile_no: usersTable.mobile_no,
          role: usersTable.role,
          created_at: usersTable.created_at,
        });

      if (!insertedUser) {
        throw new APIError(
          'Failed to create user',
          500,
          'USER_CREATION_FAILED'
        );
      }

      return insertedUser;
    });

    logger.info('User created successfully', {
      userId: newUser.id,
      email: cleanData.email,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      mobile_no: newUser.mobile_no,
      role: newUser.role,
      created_at: newUser.created_at,
    };
  } catch (error) {
    logger.error('Failed to create user:', {
      error: error instanceof Error ? error.message : error,
      email: userData.email.toLowerCase().trim(),
    });

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError('Failed to create user', 500, 'USER_CREATION_ERROR');
  }
};

export const findUserByEmail = async (
  email: string
): Promise<{
  id: string;
  name: string;
  email: string;
  mobile_no: string;
  role: string;
  password: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  try {
    const cleanEmail = email.toLowerCase().trim();

    const users = await withTransaction(async tx => {
      return tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, cleanEmail))
        .limit(1);
    });

    if (users.length === 0 || users[0] === undefined) {
      return null;
    }
    return users[0];
  } catch (error) {
    logger.error('Failed to find user by email:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    throw new APIError('Database query failed', 500, 'DB_ERROR');
  }
};

export const findUserByMobile = async (
  mobile_no: string
): Promise<{
  id: string;
  name: string;
  email: string;
  mobile_no: string;
  role: string;
  password: string;
  is_active: boolean;
  created_at: Date;
} | null> => {
  try {
    const cleanMobile = mobile_no.trim();

    const users = await withTransaction(async tx => {
      return tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.mobile_no, cleanMobile))
        .limit(1);
    });

    if (users.length === 0 || users[0] === undefined) {
      return null;
    }
    return users[0];
  } catch (error) {
    logger.error('Failed to find user by mobile:', {
      error: error instanceof Error ? error.message : error,
      mobile: '****',
    });
    throw new APIError('Database query failed', 500, 'DB_ERROR');
  }
};

export const updateUserLastLogin = async (userId: string): Promise<void> => {
  try {
    await withTransaction(async tx => {
      await tx
        .update(usersTable)
        .set({
          updated_at: new Date(),
        })
        .where(eq(usersTable.id, userId));
    });

    logger.info('User last login updated', { userId });
  } catch (error) {
    logger.error('Failed to update user last login:', {
      error: error instanceof Error ? error.message : error,
      userId,
    });
    throw new APIError('Failed to update user data', 500, 'DB_ERROR');
  }
};
