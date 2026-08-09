import { z } from 'zod'

export const reviewSchema = z.object({
  companySlug: z
    .string({ error: 'Selecteer een maatschappij' })
    .trim()
    .min(1, 'Selecteer een maatschappij'),
  rating: z
    .number({ error: 'Geef een beoordeling' })
    .int('Beoordeling moet een heel getal zijn')
    .min(1, 'Minimaal 1 ster')
    .max(5, 'Maximaal 5 sterren'),
  title: z
    .string({ error: 'Vul een titel in' })
    .trim()
    .min(3, 'Titel moet minstens 3 tekens bevatten')
    .max(150, 'Titel is te lang'),
  body: z
    .string({ error: 'Vul je review in' })
    .trim()
    .min(20, 'Je review moet minstens 20 tekens bevatten')
    .max(2000, 'Je review is te lang'),
})

export type ReviewInput = z.infer<typeof reviewSchema>

export interface ReviewResult {
  success: true
  id: number
}
