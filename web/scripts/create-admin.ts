// Moet de EERSTE import zijn: laadt .env.local/.env als side-effect,
// vóórdat '#/db' (via '#/lib/auth') wordt geëvalueerd en de
// database-connectie opzet. Zie scripts/load-env.ts.
import './load-env'

import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { user } from '#/db/schema'
import { auth } from '#/lib/auth'

async function main() {
  const [, , naam, email, wachtwoord] = process.argv

  if (!naam || !email || !wachtwoord) {
    console.error(
      'Gebruik: pnpm create-admin "Volledige Naam" email@voorbeeld.sr wachtwoord123',
    )
    process.exit(1)
  }

  if (wachtwoord.length < 8) {
    console.error('Wachtwoord moet minstens 8 tekens zijn.')
    process.exit(1)
  }

  // Better Auth regelt hashing en maakt de user/account-records aan
  // volgens zijn eigen verwachte formaat — daarom NIET zelf hashen
  // en direct in de database schrijven.
  const result = await auth.api.signUpEmail({
    body: { name: naam, email, password: wachtwoord },
  })

  if (!result?.user) {
    console.error('Aanmaken van gebruiker is mislukt (bestaat het account al?).')
    process.exit(1)
  }

  // signUpEmail zet role altijd op de default ('user'), want dat veld
  // heeft input: false in de auth-config — dus zetten we 'm hierna
  // handmatig op 'admin'.
  await db
    .update(user)
    .set({ role: 'admin' })
    .where(eq(user.id, result.user.id))

  console.log(`✓ Admin-account aangemaakt: ${email}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fout bij aanmaken admin-account:', err)
  process.exit(1)
})