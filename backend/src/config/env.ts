import * as dotenv from 'dotenv';

/* Load env vars when importing this file*/
dotenv.config();

/**
 * Environment.
 */
export const nodeEnv = process.env['NODE_ENV'] || 'development';

/**
 * API server port.
 */
export const apiPort = parseInt(process.env['API_PORT']) || 3000;

/**
 * REDIS Options
 */
export const redisUrl = process.env['REDIS_URL'];

export const moralisAuthApiUrl =
  process.env['MORALIS_AUTH_API_URL'] || 'http://localhost:3000';

export const moralisEvmApiUrl = process.env['MORALIS_EVM_API_URL'] || '';
export const moralisSolanaApiUrl = process.env['MORALIS_SOLANA_API_URL'] || '';
export const moralisWeb3ApiKey = process.env['MORALIS_WEB3_API_KEY'] || '';

export const serviceName =
  process.env['SERVICE_NAME'] || 'Microservice template';
export const serviceDescription =
  process.env['SERVICE_DESCRIPTION'] || 'Microservice template Description';
export const serviceTags = process.env['SERVICE_TAGS'] || 'Microservice';

export const jwtSecret = process.env['JWT_SECRET'] || 'secret';
export const xApiKey = process.env['X_API_KEY'];
