import './load-env'

import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { user } from '#/db/schema'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()

  if (!email) {
    console.error('Gebruik: pnpm promote-admin email@voorbeeld.sr')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL ontbreekt. Zet .env.local of .env.')
    process.exit(1)
  }

  const updated = await db
    .update(user)
    .set({ role: 'admin', banned: false, banReason: null, banExpires: null })
    .where(eq(user.email, email))
    .returning({ email: user.email, role: user.role })

  if (updated.length === 0) {
    console.error(`Geen gebruiker gevonden met e-mail: ${email}`)
    process.exit(1)
  }

  console.log(`✓ ${updated[0].email} is nu admin (rol: ${updated[0].role})`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fout bij promotie:', err)
  process.exit(1)
})
