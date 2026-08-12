// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'VerzekerSlim Docs',
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
            sidebar: [
                {
                    label: 'Algemeen',
                    items: [
                        { label: 'Startpagina', slug: 'startpagina' },
                        { label: 'Navigatie', slug: 'navigatie' },
                    ],
                },
                {
                    label: 'Account',
                    items: [
                        { label: 'Inloggen en registreren', slug: 'authenticatie' },
                        { label: 'Reviews', slug: 'reviews' },
                    ],
                },
                {
                    label: 'Vergelijken',
                    items: [
                        { label: 'Verzekeringen vergelijken', slug: 'vergelijkingen' },
                        { label: 'Maatschappij-pagina', slug: 'maatschappijen' },
                    ],
                },
                {
                    label: 'Premie-calculator',
                    items: [
                        { label: 'Premie berekenen', slug: 'premie-calculator' },
                    ],
                },
                {
                    label: 'Admin',
                    items: [
                        { label: 'Dashboard overzicht', slug: 'admin/dashboard' },
                        { label: 'Gebruikers en rollen', slug: 'admin/users' },
                        { label: 'Contact', slug: 'admin/contact' },
                    ],
                },
            ],
        }),
    ],
});
