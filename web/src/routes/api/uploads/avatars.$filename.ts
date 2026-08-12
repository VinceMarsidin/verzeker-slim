import { createFileRoute } from '@tanstack/react-router'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
}

// Zelfde map als waar avatar.ts naar schrijft — bewust BUITEN public/, want
// public/ wordt bij `vite build` gekopieerd naar .output/public/ en daarna
// niet meer live gelezen. Bestanden die na de build worden geschreven
// (runtime-uploads) zijn via de statische public/-route dus nooit vindbaar.
const AVATARS_DIR =
    process.env.UPLOADS_DIR
        ? path.join(process.env.UPLOADS_DIR, 'avatars')
        : path.join(process.cwd(), 'data', 'uploads', 'avatars')

export const Route = createFileRoute('/api/uploads/avatars/$filename')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                // Voorkomt path traversal (../../etc) — alleen de kale bestandsnaam.
                const filename = path.basename(params.filename)
                const ext = filename.split('.').pop()?.toLowerCase() ?? ''
                const contentType = CONTENT_TYPES[ext]

                if (!contentType) {
                    return new Response('Ongeldig bestandstype', { status: 400 })
                }

                try {
                    const buffer = await readFile(path.join(AVATARS_DIR, filename))
                    return new Response(buffer, {
                        headers: {
                            'Content-Type': contentType,
                            'Cache-Control': 'public, max-age=31536000, immutable',
                        },
                    })
                } catch {
                    return new Response('Niet gevonden', { status: 404 })
                }
            },
        },
    },
})