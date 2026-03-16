// createAdmin.js (Tijdelijke reset versie)
import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
    const username = 'admin';
    const password = 'test1234'; // Gebruik dit om te testen
    const hashedPassword = await bcrypt.hash(password, 10);

    // upsert betekent: update als hij bestaat, maak aan als hij niet bestaat
    await prisma.admin.upsert({
        where: { username: username },
        update: { password: hashedPassword },
        create: { username: username, password: hashedPassword },
    });

    console.log('Admin wachtwoord is gereset naar: test1234');
}

main().catch(console.error).finally(() => prisma.$disconnect());