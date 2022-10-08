/* eslint-disable */
// @ts-check
import { clientEnv, clientSchema } from './schema.mjs';

const parsedClientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) => Object.entries(errors)
  .map(([name, value]) => {
    if (value && '_errors' in value) { return `${name}: ${value._errors.join(', ')}\n`; }
  })
  .filter(Boolean);

if (parsedClientEnv.success === false) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(parsedClientEnv.error.format()),
  );
  throw new Error('Invalid environment variables');
}

/**
 * Validate that client-side environment variables are exposed to the client.
 */
for (const key of Object.keys(parsedClientEnv.data)) {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
    );

    throw new Error('Invalid public environment variable name');
  }
}

export const env = parsedClientEnv.data;
