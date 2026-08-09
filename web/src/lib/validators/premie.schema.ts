import { z } from 'zod'

const huidigJaar = new Date().getFullYear()

export const voertuigTypes = [
  'auto',
  'elektrische_auto',
  'motorfiets',
  'bromfiets',
  'bus',
  'pickup_truck',
  'zwaar_materieel',
] as const

export const gebruiksdoelen = ['prive', 'taxi', 'verhuur', 'lease', 'rijles'] as const

const motorSchema = z.object({
  categorie: z.literal('motor'),
  dagwaarde: z
    .number({ error: 'Vul een geldig bedrag in' })
    .positive('Dagwaarde moet groter dan 0 zijn')
    .max(10_000_000, 'Dagwaarde lijkt niet realistisch'),
  voertuigtype: z.enum(voertuigTypes, { error: 'Kies een voertuigtype' }),
  bouwjaar: z
    .number({ error: 'Vul het bouwjaar in' })
    .int()
    .min(1980, 'Bouwjaar moet na 1980 zijn')
    .max(huidigJaar, `Bouwjaar kan niet na ${huidigJaar} zijn`),
  gebruiksdoel: z.enum(gebruiksdoelen, { error: 'Kies een gebruiksdoel' }),
  miniCasco: z.boolean().default(false),
  inzittendenverzekering: z.boolean().default(false),
})

const reisSchema = z.object({
  categorie: z.literal('reis'),
  aantalDagen: z
    .number({ error: 'Vul het aantal dagen in' })
    .int('Moet een heel getal zijn')
    .positive('Moet minstens 1 dag zijn')
    .max(365, 'Maximaal 365 dagen'),
  aantalPersonen: z
    .number({ error: 'Vul het aantal personen in' })
    .int('Moet een heel getal zijn')
    .positive('Moet minstens 1 persoon zijn')
    .max(20, 'Maximaal 20 personen'),
})

const woonSchema = z.object({
  categorie: z.literal('woon'),
  vierkanteMeters: z
    .number({ error: 'Vul het aantal m² in' })
    .positive('Moet groter dan 0 zijn')
    .max(10_000, 'Aantal m² lijkt niet realistisch'),
})

const levenSchema = z.object({
  categorie: z.literal('leven'),
  leeftijd: z
    .number({ error: 'Vul je leeftijd in' })
    .int()
    .min(18, 'Minimaal 18 jaar')
    .max(80, 'Maximaal 80 jaar'),
  looptijdJaren: z
    .number({ error: 'Vul de looptijd in' })
    .int()
    .positive('Moet minstens 1 jaar zijn')
    .max(50, 'Maximaal 50 jaar'),
  verzekerdBedrag: z
    .number({ error: 'Vul het verzekerde bedrag in' })
    .positive('Moet groter dan 0 zijn')
    .max(10_000_000, 'Bedrag lijkt niet realistisch'),
})

export const premieCalculatorSchema = z.discriminatedUnion('categorie', [
  motorSchema,
  reisSchema,
  woonSchema,
  levenSchema,
])

export const schemaPerCategorie = {
  motor: motorSchema,
  reis: reisSchema,
  woon: woonSchema,
  leven: levenSchema,
} as const

export type Categorie = keyof typeof schemaPerCategorie
export type PremieCalculatorInput = z.infer<typeof premieCalculatorSchema>

export interface PremieCalculatorResult {
  premie: number
  minimumToegepast: boolean
  toelichting: string
  breakdown: { label: string; bedrag: number }[]
}