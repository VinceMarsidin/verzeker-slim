import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'

export const haalContactBerichten = createServerFn({ method: 'GET' }).handler(
    async () => {
        const berichten = await db
            .select()
            .from(contactMessages)
            .orderBy(desc(contactMessages.createdAt))

        return berichten
    },
)