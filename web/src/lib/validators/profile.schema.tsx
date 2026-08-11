import { z } from 'zod'

export const profileSchema = z.object({
  naam: z
    .string({ error: 'Vul je naam in' })
    .min(2, 'Naam moet minstens 2 tekens zijn')
    .max(100, 'Naam is te lang'),
})

export type ProfileInput = z.infer<typeof profileSchema>