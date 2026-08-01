import { z } from 'zod'

export const contactSchema = z.object({
  naam: z
    .string({ error: 'Vul je naam in' })
    .trim()
    .min(2, 'Naam moet minstens 2 tekens bevatten')
    .max(100, 'Naam is te lang'),
  email: z
    .string({ error: 'Vul je e-mailadres in' })
    .trim()
    .email('Vul een geldig e-mailadres in')
    .max(150, 'E-mailadres is te lang'),
  bericht: z
    .string({ error: 'Vul een bericht in' })
    .trim()
    .min(10, 'Je bericht moet minstens 10 tekens bevatten')
    .max(2000, 'Je bericht is te lang'),
})

export type ContactInput = z.infer<typeof contactSchema>

export interface ContactResult {
  success: true
  id: number
}