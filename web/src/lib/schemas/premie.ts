import { z } from 'zod'

const geldigeCategorieen = ['motor', 'reis', 'woon', 'leven'] as const

export const premieInputSchema = z.object({
  categorie: z.enum(geldigeCategorieen, {
    error: `categorie moet één van: ${geldigeCategorieen.join(', ')}`,
  }),
  type: z.string().trim().min(1, 'Type is verplicht').max(150),
  premieBedrag: z.string().trim().min(1, 'Premiebedrag is verplicht').max(50),
  maatschappijId: z.coerce.number().int().positive('Ongeldige maatschappij'),
})

export type PremieInput = z.infer<typeof premieInputSchema>