import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { contactMessages } from '@/db/schema'
import { contactSchema, type ContactResult } from '@/lib/validators/contact.schema'

export const verstuurContactBericht = createServerFn({ method: 'POST' })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<ContactResult> => {
    if (!process.env.DATABASE_URL) {
      throw new Error('Contactformulier is tijdelijk niet beschikbaar. Probeer het later opnieuw.')
    }

    const [saved] = await db
      .insert(contactMessages)
      .values({
        naam: data.naam,
        email: data.email,
        bericht: data.bericht,
      })
      .returning()

    return { success: true, id: saved.id }
  })
