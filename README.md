# Peeraphat · Personal orbit

Personal portfolio and link hub, published at https://peephatz-dev.github.io/.

Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion, Three.js, React Three Fiber, and Drei. The production site is a static export suitable for GitHub Pages.

## Development

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/. To validate and export:

```sh
npm run test:gestures
npm run typecheck
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
```

`out/` is generated and ignored. `next start` does not serve this static export; use the static server above.

## Editing

- Project facts, metrics, and destinations: `src/lib/projects.ts`.
- Hero, five orbit links, filters, dialogs, and contact: `src/components/Portfolio.tsx`.
- Interactive chrome sculpture: `src/components/OrbitScene.tsx`.
- Real project artwork: `src/components/ProjectArtwork.tsx` and `public/assets/`.
- Responsive styles and design tokens: `src/app/globals.css`.

All six original project records and their destinations are retained. Sala Hum PowerGuard adds the supplied community energy project as a seventh record. Original LinkedIn short links remain unchanged; final destinations are not independently verified. Competition, learning, and simulated-data prototypes are identified in the project details.

The hero supports sphere dragging, automatic orbiting, pointer parallax, card tilting, and rotating featured links with buttons or dragging the indicator. Mobile portrait uses a radial project carousel with horizontal-only swipe recognition and native vertical page scrolling. Cards grow with content; links and buttons are excluded from dragging. Motion pauses offscreen and in background tabs; a pause control and reduced-motion preference disable decorative movement. Reduced-motion and unavailable WebGL use the static sculpture fallback. Dialogs support keyboard focus, Escape, and focus restoration.

## Deployment

Push `main` to `peephatz-dev/peephatz-dev.github.io`. `.github/workflows/deploy.yml` installs locked dependencies, runs gesture regression tests, typechecks, builds `out/`, and deploys it through GitHub Pages Actions. Pages uses the GitHub Actions source. Root hosting needs no base path. The `.nojekyll` asset is included in the export.

`dist/` and `.openai/hosting.json` preserve the previous buildless Sites version; they are not used by the GitHub Pages workflow.

Artwork provenance and generation prompts: `DESIGN.md`. Verification notes: `QA.md`.
