// Moet de EERSTE import zijn, zie scripts/load-env.ts.
import './load-env'

import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { listCompanies } from '#/lib/services/insurance'
import { SITE_URL } from '#/lib/seo'

// Vaste, publieke pagina's. /vergelijkingen/$type staat er niet in — die
// route redirect direct door naar /vergelijkingen?type=... en heeft dus
// geen eigen indexeerbare inhoud. Privé-routes (login, dashboard, admin,
// account) staan hier ook niet in — die worden al geweerd via robots.txt.
const staticRoutes: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/vergelijkingen', changefreq: 'daily', priority: '0.9' },
  { path: '/premie-calculator', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'yearly', priority: '0.3' },
]

function urlEntry(loc: string, changefreq: string, priority: string) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
}

async function main() {
  const companies = await listCompanies()

  const entries = [
    ...staticRoutes.map((r) => urlEntry(`${SITE_URL}${r.path}`, r.changefreq, r.priority)),
    ...companies.map((c) =>
      urlEntry(`${SITE_URL}/maatschappijen/${c.slug}`, 'weekly', '0.7'),
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`

  const outPath = resolve(import.meta.dirname, '../public/sitemap.xml')
  await writeFile(outPath, xml, 'utf-8')
  console.log(`sitemap.xml geschreven met ${entries.length} URL's -> ${outPath}`)
}

main().catch((err) => {
  console.error('Genereren van sitemap.xml is mislukt:', err)
  process.exit(1)
})