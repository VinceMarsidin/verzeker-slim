import { z } from 'zod'

export const regionSchema = z.enum([
  'suriname',
  'aruba',
  'curacao',
  'bonaire',
  'trinidad',
  'jamaica',
  'guyana',
  'french-guiana',
])

export const insuranceTypeSchema = z.enum(['motor', 'reis', 'woon', 'leven'])

export const quotesQuerySchema = z.object({
  region: regionSchema,
  type: insuranceTypeSchema,
})

export type QuotesQuery = z.infer<typeof quotesQuerySchema>

export const companySlugSchema = z.object({
  slug: z.string().trim().min(1),
})

export type CompanySlugParam = z.infer<typeof companySlugSchema>

export const companyAdminSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is verplicht')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Alleen kleine letters, cijfers en streepjes'),
  name: z.string().trim().min(1, 'Naam is verplicht').max(200),
  logoInitial: z.string().trim().min(1, 'Verplicht (bijv. eerste letter)').max(2),
  logoUrl: z.string().trim().max(500).optional().or(z.literal('')),
  homepageImage: z.string().trim().max(500).optional().or(z.literal('')),
  region: regionSchema,
  website: z.string().trim().url('Ongeldige URL').max(300),
  description: z.string().trim().min(1, 'Beschrijving is verplicht'),
})

export type CompanyAdminInput = z.infer<typeof companyAdminSchema>