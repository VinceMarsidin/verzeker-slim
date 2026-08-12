import { createFileRoute } from '@tanstack/react-router'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const CONTENT_TYPES: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
}

// Let op: dit is ALLEEN voor via het dashboard geüploade logo's/homepage-
// afbeeldingen. De geseede afbeeldingen (public/companies/<slug>/logo.png)
// staan gewoon in git en blijven via de normale statische public/-route
// werken — die hoeven niet aangepast te worden.
const COMPANIES_DIR =
    process.env.UPLOADS_DIR
        ? path.join(process.env.UPLOADS_DIR, 'companies')
        : path.join(process.cwd(), 'data', 'uploads', 'companies')

export const Route = createFileRoute('/api/uploads/companies/$filename')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const filename = path.basename(params.filename)
                const ext = filename.split('.').pop()?.toLowerCase() ?? ''
                const contentType = CONTENT_TYPES[ext]

                if (!contentType) {
                    return new Response('Ongeldig bestandstype', { status: 400 })
                }

                try {
                    const buffer = await readFile(path.join(COMPANIES_DIR, filename))
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