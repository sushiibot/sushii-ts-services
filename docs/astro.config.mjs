// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://sushii.bot',
  integrations: [
    starlight({
      title: 'sushii',
      social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/Bz5Q2WfuE7' }],
      sidebar: [
        {
          label: 'Guides',
          //items: [
          // Each item here is one entry in the navigation menu.
          // { label: 'Getting Started', slug: 'guides/getting-started' },
          // ],
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'User Reference',
          autogenerate: { directory: 'user-reference' },
        },
        {
          label: "Privacy & Terms",
          items: [
            { label: 'Privacy Policy', slug: 'privacy' },
            { label: 'Terms of Service', slug: 'tos' },
          ]
        }
      ],
      customCss: [
        '@fontsource/poppins/300.css',
        '@fontsource/poppins/400.css',
        '@fontsource/poppins/500.css',
        '@fontsource/poppins/600.css',
        "./src/styles/custom.css"
      ],
    }),
  ],
});
