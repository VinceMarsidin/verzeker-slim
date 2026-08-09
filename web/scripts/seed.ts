import { config } from 'dotenv'
import { seedDatabase } from '../src/lib/services/insurance.ts'

config({ path: ['.env.local', '.env'] })

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is niet gezet. Kopieer .env.example naar .env.local')
    process.exit(1)
  }

  console.log('Database vullen met verzekeraars en premies...')
  await seedDatabase()
  console.log('Klaar.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
