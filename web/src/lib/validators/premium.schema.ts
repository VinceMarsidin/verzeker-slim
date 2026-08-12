import { z } from 'zod'

export const premiumAdminSchema = z.object({
    companyId: z.coerce.number().int().positive('Kies een maatschappij'),
    insuranceType: z.enum(['motor', 'reis', 'woon', 'leven'], {
        error: 'Kies een categorie',
    }),
    monthlyPremium: z.coerce.number().positive('Premie moet groter dan 0 zijn'),
    currency: z.string().trim().min(1, 'Verplicht (bijv. SRD)').max(10),
    deductible: z.coerce.number().min(0, 'Mag niet negatief zijn'),
    rating: z.coerce.number().min(0).max(5),
    coverage: z
        .string()
        .trim()
        .min(1, 'Vul minstens één dekking in (komma-gescheiden)')
        .transform((val) => val.split(',').map((s) => s.trim()).filter(Boolean)),
    badge: z.enum(['populair', 'beste prijs', 'beste dekking', '']).optional(),
})

export type PremiumAdminInput = z.infer<typeof premiumAdminSchema>