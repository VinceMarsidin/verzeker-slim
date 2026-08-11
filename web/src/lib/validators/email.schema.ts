import { z } from 'zod'

export const changeEmailSchema = z.object({
    nieuwEmail: z.email('Vul een geldig e-mailadres in'),
})

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>