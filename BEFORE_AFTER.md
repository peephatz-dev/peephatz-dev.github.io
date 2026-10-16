# Before / after

## Before

The previous first frame showed an isolated profile mark, a “Preparing your orbit…” message, and one placeholder destination while the WebGL scene initialized.

Reference assets already present in the repository:

- `preview-cloud-observatory.png`
- `preview-mobile-orbit.png`
- `preview-scroll-mobile.png`

## After

The first frame now renders a complete CSS orbit:

- MODHEW is centered and recognizable.
- Adjacent cards are partially visible with perspective, glass tint, and soft atmospheric shadows.
- Bubble-ring decorations establish the orbit silhouette.
- The five-card navigation and progress controls are immediately available.
- Clicking a card opens the holographic detail overlay; external navigation happens only from its CTA.
- WebGL crossfades over the same composition after its first usable frame.

Chrome headless/CDP screenshots were generated at the requested mobile, tablet, and desktop sizes. The reveal state was also captured on mobile and desktop. Playwright-specific automation was not run because the Playwright package is not installed in this checkout. The implementation was validated with the production build, typecheck, lint, orbit/gesture tests, and the five-destination data test.
