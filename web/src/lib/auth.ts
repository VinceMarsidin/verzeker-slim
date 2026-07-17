import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
const BASE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3001'

export const auth = betterAuth({
  baseURL: BASE_URL,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies()],
})
