// sounding's site, built by Astro with Starlight and published to GitHub
// Pages at https://agentplot.github.io/sounding by .github/workflows/pages.yml.
// The SVG diagrams are drawn at build time by src/diagrams/*.ts and inlined,
// so they follow the theme toggle and need no script; the one canvas,
// src/components/Rounds.astro, draws itself from the time in its loop.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://agentplot.github.io',
  base: '/sounding',
  integrations: [
    starlight({
      title: 'sounding',
      description: 'One question, worked by one agent session in a worktree of its own, ending on a conclusion you decide.',
      logo: {
        light: './src/assets/mark-light.svg',
        dark: './src/assets/mark-dark.svg',
        alt: 'sounding',
      },
      favicon: '/favicon.svg',
      // The family's header (its bar above Starlight's), footer and status
      // banner, from @agentplot/site-theme; the start page's hero, with the
      // animated diagram, is sounding's own.
      components: {
        Header: '@agentplot/site-theme/starlight/Header.astro',
        Footer: '@agentplot/site-theme/starlight/Footer.astro',
        Banner: '@agentplot/site-theme/starlight/Banner.astro',
        Hero: './src/components/Hero.astro',
      },
      // The family's type, ink and accent, then the diagrams' palette.
      customCss: ['@agentplot/site-theme/starlight.css', './src/styles/brand.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/agentplot/sounding' }],
      editLink: {
        baseUrl: 'https://github.com/agentplot/sounding/edit/main/site/',
      },
      plugins: [starlightLinksValidator()],
      sidebar: [
        { label: 'Start', link: '/' },
        { label: 'How it works', link: '/how-it-works/' },
        { label: 'How it fits', link: '/how-it-fits/' },
        { label: 'Design', link: '/design/' },
        { label: 'Roadmap', link: '/roadmap/' },
      ],
    }),
  ],
});
