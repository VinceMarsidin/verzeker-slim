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
