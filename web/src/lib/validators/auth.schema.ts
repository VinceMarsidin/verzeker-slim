import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Vul je naam in' })
      .trim()
      .min(2, 'Naam moet minstens 2 tekens bevatten')
      .max(100, 'Naam is te lang'),
    email: z
      .string({ error: 'Vul je e-mailadres in' })
      .trim()
      .email('Vul een geldig e-mailadres in'),
    password: z
      .string({ error: 'Vul een wachtwoord in' })
      .min(8, 'Wachtwoord moet minstens 8 tekens bevatten')
      .max(128, 'Wachtwoord is te lang'),
    confirmPassword: z.string({ error: 'Bevestig je wachtwoord' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Wachtwoorden komen niet overeen',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string({ error: 'Vul je e-mailadres in' })
    .trim()
    .email('Vul een geldig e-mailadres in'),
  password: z
    .string({ error: 'Vul je wachtwoord in' })
    .min(1, 'Vul je wachtwoord in'),
})

export type LoginInput = z.infer<typeof loginSchema>
