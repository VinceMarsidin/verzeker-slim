import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { auth } from '@/lib/auth'
import { avatarUploadSchema } from '@/lib/validators/avatar.schema'

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

        // Nogmaals checken op de daadwerkelijke bytes, niet alleen de
        // base64-stringlengte (die kan iets afwijken van de echte bestandsgrootte).
        if (buffer.byteLength > 2 * 1024 * 1024) {
            throw new Error('Afbeelding is te groot (max 2MB).')
        }

        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
        await mkdir(uploadsDir, { recursive: true })

        // Bestandsnaam wordt door de server bepaald (userId + willekeurige id),
        // nooit de originele bestandsnaam van de gebruiker — voorkomt path
        // traversal en naamconflicten tussen gebruikers.
        const filename = `${session.user.id}-${randomUUID()}.${ext}`
        await writeFile(path.join(uploadsDir, filename), buffer)

        return { url: `/uploads/avatars/${filename}` }
    })