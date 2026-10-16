# Visual audit

## Scope

The orbit hero now has a static-first presentation. The first rendered UI contains the sky, heading, badge, five project cards, bubble rings, progress controls, and functional detail-opening buttons before the WebGL scene is ready. WebGL is mounted progressively and crossfades only after its first ready callback.

## Validation checklist

| Check | Result |
|---|---|
| Five primary destinations | Pass: MODHEW, MET Safety Day 2026, Sam Hao, GitHub, Contact |
| Initial state has no loading message | Pass: no spinner, percentage, or “Preparing your orbit…” state |
| WebGL failure fallback | Pass: CSS orbit remains visible and interactive |
| Reduced motion | Pass: existing motion preference handling remains active |
| External destinations | Pass: moved into the project detail CTA/contact methods |
| Typecheck, lint, production build | Pass |
| Orbit and gesture tests | Pass |
| Playwright viewport capture | Blocked: Playwright package is not installed in this environment |

Chrome headless/CDP captures were generated for the available local browser:

- `artifacts/screenshots/first-render-mobile-390x844.png`
- `artifacts/screenshots/first-render-tablet-768x1024.png`
- `artifacts/screenshots/first-render-desktop-1440x900.png`
- `artifacts/screenshots/project-reveal-mobile-390x844.png`
- `artifacts/screenshots/project-reveal-desktop-1440x900.png`

The static orbit intentionally uses lightweight CSS transforms and local project images. It is a visual and functional fallback, not a claim of physically accurate WebGL rendering.
