// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'My Docs',
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
            sidebar: [
                {
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

                    ]