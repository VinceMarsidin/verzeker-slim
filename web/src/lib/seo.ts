export const SITE_URL = 'https://verzekerslim.sr'
export const SITE_NAME = 'VerzekerSlim'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`

interface SeoOptions {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

export function seo({ title, description, path, image, noIndex }: SeoOptions) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const ogImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_OG_IMAGE

  const tags = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'robots', content: noIndex ? 'noindex, nofollow' : 'index, follow' },

    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImage },
    { property: 'og:locale', content: 'nl_NL' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
  ]

  return tags
}

export function seoLinks(path: string) {
  return [{ rel: 'canonical', href: `${SITE_URL}${path}` }]
}