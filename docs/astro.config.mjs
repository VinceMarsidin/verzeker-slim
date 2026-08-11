// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'VerzekerSlim Docs',
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/VinceMarsidin/verzeker-slim' }],
            sidebar: [
                {
                    label: 'Guides',
                    items: [
                        { label: 'Example Guide', slug: 'guides/example' },
                    ],
                },
                {
                    label: 'Reference',
                    items: [{ autogenerate: { directory: 'reference' } }],
                },
                {
                    label: 'Admin',
                    items: [
                        { label: 'Maatschappijen overzicht', slug: 'admin/dashboard' },
                        { label: 'Gebruikers', slug: 'admin/users' },
                        { label: 'Contact', slug: 'admin/contact' },
                    ],
                },
                {
                    label: 'Premie-calculator',
                    items: [
                        { label: 'Premie berekenen', slug: 'premie-calculator' },
                    ],
                },
                {
                    label: 'Vergelijken',
                    items: [
                        { label: 'Verzekeringen vergelijken', slug: 'vergelijkingen' },
                    ],
                },
            ],
        }),
    ],
});