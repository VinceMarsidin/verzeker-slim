import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const username = "admin";                       // Dit wordt je gebruikersnaam
    const password = "test1234";                    // Dit wordt je wachtwoord
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.admin.upsert({
            where: { username: username },
            update: { password: hashedPassword },
            create: {
                username: username,
                password: hashedPassword
            },
        });
        console.log("-----------------------------------------");
        console.log("SUCCES: Admin account is klaar!");
        console.log("Gebruikersnaam:", user.username);
        console.log("Wachtwoord: test1234");
        console.log("-----------------------------------------");
    } catch (e) {
        console.error("Fout bij aanmaken admin:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();