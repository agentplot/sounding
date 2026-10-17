# The site

sounding's site at https://agentplot.github.io/sounding, an
[Astro](https://astro.build) site with
[Starlight](https://starlight.astro.build), published by
`.github/workflows/pages.yml` on every push to `main` that touches it.

```sh
devenv shell -- site-build     # moon run site:build: dist/, every internal link checked
devenv shell -- prose          # Vale over the pages and the README
cd site && bun run dev         # http://localhost:4321/sounding/
devenv shell -- site-shots <dir>   # screenshots: every page, both widths, both themes, and diagram frames
```

The family's look is `@agentplot/site-theme`: its `starlight.css` carries
the type, the ink and paper of both themes and the accent, `--ap-accent`,
which its family bar sets from the family list (sounding's magenta). Its
header puts the family bar above Starlight's, its footer adds the family's,
its banner says sounding is designed and not built, and How it fits shows
its family diagram with sounding highlighted.

## Where things live

| path | what |
|---|---|
| `src/content/docs/` | one page per file: start, how it works, how it fits, design, roadmap |
| `src/diagrams/` | the SVG diagrams, drawn at build time: `kit.ts` the builder, one file per diagram |
| `src/components/Diagram.astro` | inlines a diagram's wide and narrow layouts and shows the one its column fits |
| `src/components/Rounds.astro` | the rounds, drawn on a canvas from the time in its loop |
| `src/components/Hero.astro` | the start page's hero, with the animated diagram |
| `src/styles/brand.css` | the diagrams' palette, `--dg-*`, drawn from the theme's `--ap-*` tokens |
| `scripts/shots.mjs` | the screenshots, with Playwright and the Chromium devenv provides |

## The diagrams

Each SVG diagram uses CSS keyframes only, so it animates with no script
and follows the theme toggle through the `--dg-*` variables. Each makes
one claim, and its animation shows the mechanism moving. A reader who asks
for less motion sees one still frame chosen to hold the whole claim. Every
diagram is drawn twice, a wide layout for a column of 600 pixels or more
and a narrow one for a phone.

The rounds diagram is a canvas, since the conclusion itself travels: out
of the worktree, back into it as a round, and on into millpond. It reads
the same `--dg-*` variables, redraws when the theme changes, and draws
every frame from the time in its loop, so its still and a screenshot's
frame are exact; an `sd:frame` event on its figure holds one.

millpond's accent, `--dg-pond`, where a diagram draws millpond's inbox,
comes from the family list too.

`bun run readme-diagram` writes the hero as a standalone SVG with its own
palette, `docs/diagrams/sounding.svg`, for the README.
