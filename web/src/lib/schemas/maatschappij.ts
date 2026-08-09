import { z } from 'zod'

export const maatschappijInputSchema = z.object({
  naam: z.string().trim().min(1, 'Naam is verplicht').max(150),
  logoUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  contactEmail: z
    .string()
    .trim()
    .email('Ongeldig e-mailadres')
    .max(200)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
})

export type MaatschappijInput = z.infer<typeof maatschappijInputSchema>
