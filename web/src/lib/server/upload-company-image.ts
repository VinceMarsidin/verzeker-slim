import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

import { auth } from '@/lib/auth'

const uploadSchema = z.object({
    slug: z
        .string()
        .trim()
        .min(1, 'Slug is verplicht voordat je een afbeelding kan uploaden')
        .regex(/^[a-z0-9-]+$/, 'Ongeldige slug'),
    soort: z.enum(['logo', 'homepage']),
    dataUrl: z
        .string()
        .refine(
            (val) => /^data:image\/(png|jpe?g|webp);base64,/.test(val),
            'Alleen PNG, JPEG of WebP toegestaan',
        )
        .refine((val) => val.length < 4_200_000, 'Afbeelding is te groot (max 3MB)'),
})

export const uploadCompanyImage = createServerFn({ method: 'POST' })
    .validator(uploadSchema)
    .handler(async ({ data }) => {
        const request = getRequest()
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
            throw new Error('Niet ingelogd.')
        }
        const role = (session.user as { role?: string }).role
        if (role !== 'admin') {
            throw new Error('Geen toegang: adminrechten vereist.')
        }

        const match = data.dataUrl.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/)
        if (!match) {
            throw new Error('Ongeldig afbeeldingsformaat.')
        }
        const [, extRaw, base64] = match
        const ext = extRaw === 'jpeg' ? 'jpg' : extRaw
        const buffer = Buffer.from(base64, 'base64')

        if (buffer.byteLength > 3 * 1024 * 1024) {
            throw new Error('Afbeelding is te groot (max 3MB).')
        }

        const dir = path.join(process.cwd(), 'public', 'companies', data.slug)
        await mkdir(dir, { recursive: true })

        // Vaste bestandsnaam (logo/homepage) i.p.v. de originele bestandsnaam van
        // de beheerder — voorkomt path traversal en overschrijft nette de vorige
        // versie voor dezelfde maatschappij.
        const filename = `${data.soort}.${ext}`
        await writeFile(path.join(dir, filename), buffer)

        return { url: `/companies/${data.slug}/${filename}` }
    })