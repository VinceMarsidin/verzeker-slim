import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is niet gezet. Kopieer .env.example naar .env.local')
        process.exit(1)
    }

    const { seedPremiumsTable } = await import('../src/lib/services/insurance.ts')

    console.log('Premies seeden (premiums-tabel)...')
    const result = await seedPremiumsTable()
    console.log(
        `Klaar. ${result.created} nieuw toegevoegd, ${result.updated} bijgewerkt, ${result.skippedNoCompany} overgeslagen (geen bijbehorende maatschappij gevonden).`,
    )
    process.exit(0)
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})