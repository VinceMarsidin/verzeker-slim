import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is niet gezet. Kopieer .env.example naar .env.local')
        process.exit(1)
    }

    const { seedCompaniesTable } = await import('../src/lib/services/insurance.ts')

    console.log('Maatschappijen seeden (companies-tabel)...')
    const result = await seedCompaniesTable()
    console.log(`Klaar. ${result.created} nieuw toegevoegd, ${result.updated} bijgewerkt (van de ${result.total} totaal).`)
    process.exit(0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})