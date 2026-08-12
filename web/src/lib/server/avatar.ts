import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { auth } from '@/lib/auth'
import { avatarUploadSchema } from '@/lib/validators/avatar.schema'

// Zelfde map als in de nieuwe uploads/avatars.$filename.ts-serveerroute.
// Bewust BUITEN public/, zie toelichting daar.
const AVATARS_DIR =
    process.env.UPLOADS_DIR
        ? path.join(process.env.UPLOADS_DIR, 'avatars')
        : path.join(process.cwd(), 'data', 'uploads', 'avatars')

export const uploadAvatar = createServerFn({ method: 'POST' })
    .validator(avatarUploadSchema)
    .handler(async ({ data }) => {
        const request = getRequest()
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
            throw new Error('Niet ingelogd.')
        }

        const match = data.dataUrl.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/)
        if (!match) {
            throw new Error('Ongeldig afbeeldingsformaat.')
        }

        const [, extRaw, base64] = match
        const ext = extRaw === 'jpeg' ? 'jpg' : extRaw
        const buffer = Buffer.from(base64, 'base64')

        if (buffer.byteLength > 2 * 1024 * 1024) {
            throw new Error('Afbeelding is te groot (max 2MB).')
        }

        await mkdir(AVATARS_DIR, { recursive: true })

        const filename = `${session.user.id}-${randomUUID()}.${ext}`
        await writeFile(path.join(AVATARS_DIR, filename), buffer)

        // Nieuwe URL: via de dynamische serveerroute, niet meer via /uploads/...
        // (dat pad hoort bij de statische public/-map en werkt niet meer na een
        // productie-build).
        return { url: `/api/uploads/avatars/${filename}` }
    })