import { z } from 'zod'

const MAX_BASE64_LENGTH = 2_800_000

export const avatarUploadSchema = z.object({
    dataUrl: z
        .string({ error: 'Geen afbeelding ontvangen' })
        .refine(
            (val) => /^data:image\/(png|jpe?g|webp);base64,/.test(val),
            'Alleen PNG, JPEG of WebP toegestaan',
        )
        .refine(
            (val) => val.length < MAX_BASE64_LENGTH,
            'Afbeelding is te groot (max 2MB)',
        ),
})

export type AvatarUploadInput = z.infer<typeof avatarUploadSchema>