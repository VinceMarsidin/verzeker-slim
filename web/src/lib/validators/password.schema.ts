import { z } from 'zod'

export const changePasswordSchema = z
    .object({
        huidigWachtwoord: z.string().min(1, 'Vul je huidige wachtwoord in'),
        nieuwWachtwoord: z.string().min(8, 'Minimaal 8 tekens'),
        bevestigWachtwoord: z.string().min(1, 'Bevestig je nieuwe wachtwoord'),
    })
    .refine((data) => data.nieuwWachtwoord === data.bevestigWachtwoord, {
        message: 'Wachtwoorden komen niet overeen',
        path: ['bevestigWachtwoord'],
    })

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>