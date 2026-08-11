import './load-env'

import { eq } from 'drizzle-orm'

import { db } from '#/db'
import { account, user } from '#/db/schema'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()

  if (!email) {
    console.error('Gebruik: pnpm diagnose-user email@voorbeeld.sr')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL ontbreekt. Zet .env.local of .env.')
    process.exit(1)
  }

  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!foundUser) {
    console.log(`Geen gebruiker gevonden met e-mail: ${email}`)
    console.log('\nOplossing: maak een admin-account aan met:')
    console.log(`  pnpm create-admin "Naam" ${email} wachtwoord123`)
    process.exit(0)
  }

  const accounts = await db
    .select({
      id: account.id,
      providerId: account.providerId,
      hasPassword: account.password,
    })
    .from(account)
    .where(eq(account.userId, foundUser.id))

  console.log('--- Gebruiker ---')
  console.log(`ID:             ${foundUser.id}`)
  console.log(`Naam:           ${foundUser.name}`)
  console.log(`E-mail:         ${foundUser.email}`)
  console.log(`Rol:            ${foundUser.role}`)
  console.log(`Geblokkeerd:    ${foundUser.banned ? 'ja' : 'neen'}`)
  if (foundUser.banned) {
    console.log(`Ban-reden:      ${foundUser.banReason ?? '(geen)'}`)
    console.log(`Ban verloopt:   ${foundUser.banExpires?.toISOString() ?? 'nooit'}`)
  }
  console.log(`E-mail verified: ${foundUser.emailVerified}`)

  console.log('\n--- Login-account(s) ---')
  if (accounts.length === 0) {
    console.log('Geen account-record gevonden → inloggen met wachtwoord lukt niet.')
    console.log('Account is waarschijnlijk handmatig in de database gezet.')
    console.log('\nOplossing: verwijder de user en maak opnieuw aan met:')
    console.log(`  pnpm create-admin "Naam" ${email} wachtwoord123`)
  } else {
    for (const row of accounts) {
      console.log(
        `- provider: ${row.providerId}, wachtwoord ingesteld: ${row.hasPassword ? 'ja' : 'NEEN'}`,
      )
    }
  }

  console.log('\n--- Diagnose ---')
  if (foundUser.banned) {
    console.log('Probleem: account is geblokkeerd.')
    console.log('Oplossing: zet banned op false in de database, of deblokkeer via admin.')
  } else if (accounts.length === 0) {
    console.log('Probleem: geen wachtwoord-account gekoppeld.')
  } else if (accounts.every((row) => !row.hasPassword)) {
    console.log('Probleem: account bestaat maar wachtwoord ontbreekt in de database.')
  } else if (foundUser.role !== 'admin') {
    console.log('Login kan lukken, maar dashboard is alleen voor admins.')
    console.log('Deze gebruiker heeft rol "user" — geen admin-toegang.')
    console.log('\nOplossing: maak admin met:')
    console.log(`  pnpm promote-admin ${email}`)
  } else {
    console.log('Account ziet er correct uit (admin + wachtwoord).')
    console.log('Controleer of het ingevoerde wachtwoord klopt.')
    console.log('Maak desnoods opnieuw aan (andere e-mail) of reset het wachtwoord.')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('Fout bij diagnose:', err)
  process.exit(1)
})
