import { z } from 'zod'

export const premieCalculatorSchema = z.object({
  categorie: z.enum(['motor', 'reis', 'woon', 'leven']),
  dagwaarde: z
    .number({ error: 'Vul een geldig bedrag in' })
    .positive('Dagwaarde moet groter dan 0 zijn')
    .max(10_000_000, 'Dagwaarde lijkt niet realistisch'),
})

export type PremieCalculatorInput = z.infer<typeof premieCalculatorSchema>

export interface PremieCalculatorResult {
  premie: number
  minimumToegepast: boolean
}