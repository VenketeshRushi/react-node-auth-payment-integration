import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';
import { logger } from '../utils/logger.js';

export interface AwsSecretResult {
  [key: string]: any;
}

/**
 * Retrieve a secret from AWS Secrets Manager.
 * @param secretName The secret’s ID or ARN
 * @param region AWS region name (e.g. "us-east-1")
 * @returns The parsed secret object
 * @throws Error or AWS SDK exception if retrieval fails
 */
export async function getAwsSecret(
  secretName: string,
  region: string
): Promise<AwsSecretResult> {
  const client = new SecretsManagerClient({ region });

  const cmd = new GetSecretValueCommand({ SecretId: secretName });

  let resp: GetSecretValueCommandOutput;
  try {
    resp = await client.send(cmd);
  } catch (err) {
    // You can inspect `err.name` / `err.code` (e.g. ResourceNotFoundException, DecryptionFailure, etc.)
    logger.error(
      `Error fetching secret ${secretName} from Secrets Manager`,
      err
    );
    throw err;
  }

  if (resp.SecretString) {
    try {
      const parsed = JSON.parse(resp.SecretString);
      return parsed;
    } catch (parseErr) {
      logger.warn(
        `SecretString is not valid JSON for secret ${secretName}, returning raw string`,
        parseErr
      );
      // Optionally you could return { raw: resp.SecretString } or throw
      return { raw: resp.SecretString };
    }
  } else if (resp.SecretBinary) {
    // SecretBinary is Uint8Array or Buffer-like
    const buff = Buffer.from(resp.SecretBinary);
    const decoded = buff.toString('utf-8');
    try {
      const parsed = JSON.parse(decoded);
      return parsed;
    } catch (parseErr) {
      logger.warn(
        `SecretBinary decoded to non-JSON for secret ${secretName}, returning raw`,
        parseErr
      );
      return { raw: decoded };
    }
  }

  throw new Error(
    `Secret ${secretName} has no SecretString or SecretBinary field`
  );
}
