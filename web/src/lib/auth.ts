import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

const BASE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3001'

import { db } from '#/db'
import * as schema from '#/db/schema'

export const auth = betterAuth({
  baseURL: BASE_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // gebruiker kan dit veld niet zelf instellen bij registratie
      },
    },
  },
  plugins: [tanstackStartCookies()],
})