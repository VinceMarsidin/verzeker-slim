import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { seo, SITE_URL, SITE_NAME } from '@/lib/seo'


import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: 'info@verzekerslim.sr',
  sameAs: [
    'https://facebook.com/verzekerslim',
    'https://instagram.com/verzekerslim',
    'https://x.com/verzekerslim',
    'https://linkedin.com/company/verzekerslim',
    'https://youtube.com/@verzekerslim',
  ],
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },

      ...seo({
      title: 'VerzekerSlim',
      description: 'Vergelijk verzekeringspremies van betrouwbare verzekeraars in Suriname en de regio. Snel, onafhankelijk en gratis.',
      path : '/',
    }),
    ],

    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;700&family=IBM+Plex+Mono:wght@500;600&display=swap',
      },
    ],
  }),

  notFoundComponent: () => <div>Not Found</div>,

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
       />
      </head>

      <body>
        <Navbar />

        {children}

        <Footer />

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />

        <Scripts />
      </body>
    </html>
  )
}


