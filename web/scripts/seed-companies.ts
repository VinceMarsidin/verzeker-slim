import { config } from 'dotenv'
import { seedCompaniesTable } from '../src/lib/services/insurance.ts'

config({ path: ['.env.local', '.env'] })

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is niet gezet. Kopieer .env.example naar .env.local')
        process.exit(1)
    }

    console.log('Maatschappijen seeden (companies-tabel)...')
    const result = await seedCompaniesTable()
    console.log(`Klaar. ${result.created} toegevoegd, ${result.skipped} bestonden al (van de ${result.total} totaal).`)
    process.exit(0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})