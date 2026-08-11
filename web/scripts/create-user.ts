// Moet de EERSTE import zijn: laadt .env.local/.env als side-effect,
// vóórdat '#/db' (via '#/lib/auth') wordt geëvalueerd en de
// database-connectie opzet.
import './load-env'

import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { user } from '#/db/schema'
import { auth } from '#/lib/auth'

async function main() {
  const [, , naam, email, wachtwoord, rol] = process.argv

  if (!naam || !email || !wachtwoord) {
    console.error(
      'Gebruik: pnpm create-user "Volledige Naam" email@voorbeeld.sr wachtwoord123 [rol]',
    )
    console.error('  [rol] is optioneel, standaard "user" (bijv. "admin")')
    process.exit(1)
  }

  if (wachtwoord.length < 8) {
    console.error('Wachtwoord moet minstens 8 tekens zijn.')
    process.exit(1)
  }

  const result = await auth.api.signUpEmail({
    body: { name: naam, email, password: wachtwoord },
  })

  if (!result?.user) {
    console.error('❌ Aanmaken van gebruiker is mislukt (bestaat het account al?).')
    process.exit(1)
  }

  // signUpEmail zet role altijd op de default ('user'), want dat veld
  // heeft input: false in de auth-config. Zet 'm hierna handmatig op de
  // gewenste rol als die is opgegeven.
  if (rol) {
    await db.update(user).set({ role: rol }).where(eq(user.id, result.user.id))
  }

  console.log(`✓ Gebruiker aangemaakt: ${email} (rol: ${rol ?? 'user'})`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Fout bij aanmaken gebruiker:', err)
  process.exit(1)
})