import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins" // Importeer de admin client plugin

export const authClient = createAuthClient({
  plugins: [
    adminClient() // Voeg de plugin hier toe
  ]
})

export const { useSession, signIn, signOut } = authClient