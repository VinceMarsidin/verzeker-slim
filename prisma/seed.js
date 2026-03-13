import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Database vullen...')

    // Maakt de tabel eerst leeg om dubbele data te voorkomen
    await prisma.verzekering.deleteMany()

    // Voegt de data toe
    await prisma.verzekering.createMany({
        data: [
            {
                categorie: 'motor',
                dekking_naam: 'Basis WA Premie',
                assuria: 'SRD 2.500',
                fatum: 'SRD 2.450',
                self_reliance: 'SRD 2.550',
                parsasco: 'SRD 2.400'
            },
            {
                categorie: 'motor',
                dekking_naam: 'Casco Dekking',
                assuria: 'Ja',
                fatum: 'Ja',
                self_reliance: 'Ja',
                parsasco: 'Beperkt'
            }
        ]
    })
    console.log('Klaar! ✅')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())