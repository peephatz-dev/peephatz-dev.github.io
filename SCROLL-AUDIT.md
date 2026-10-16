# Scroll and gesture audit — 16 October 2026

Source inspected before refactoring: commit `2f83cfa`.

## Findings and root causes

| Severity | Location | Evidence and effect |
| --- | --- | --- |
| High | `src/app/mobile-orbit.css`, `.cloud-wheel` | `touch-action: pinch-zoom` excludes native one-finger vertical panning over most of the hero. This is the primary mobile scroll blocker. |
| High | `src/components/MobileCloudOrbit.tsx`, `begin` / `move` | Starts on every descendant, including links/buttons. A 7px Euclidean threshold captures both horizontal and vertical movement without direction arbitration. Vertical intent can rotate projects and suppress a click. |
| Medium | `src/components/MobileCloudOrbit.tsx`, `pointerAngle` | Calls `getBoundingClientRect()` on every pointer event and maps vertical motion to angular rotation. Angular input is unsuitable when vertical movement must remain native scroll. |
| High | `src/components/OrbitScene.tsx`, Drei `OrbitControls` | Installed Three.js controls set `canvas.style.touchAction = 'none'`, register a non-passive canvas wheel listener, and use document pointer listeners during drag. `enableZoom=false` currently returns before wheel `preventDefault`, so document wheel hijacking was **not** found; the canvas touch override is real. |
| Medium | `src/app/mobile-orbit.css`, hero/cards | Absolutely positioned cards inside a clipped 100dvh hero have fixed dvh heights. Short viewports / larger text can push essential content into controls or outside the clipped region. No normal-flow space is reserved for card content growth. |
| Medium | `src/components/MobileCloudOrbit.tsx`, angle subscription | Calls `setActive()` on every motion frame, including frames that do not change the nearest project. React often bails out for identical values; this is avoidable scheduling, not evidence that a full render happens on every frame. |
| Medium | Mobile progress | Visual percentage has no progressbar semantics; live announcement reports index only. Link accessible name replaces “Explore project” with unrelated destination wording (WCAG 2.5.3). |
| Low | Anchor navigation | Root scroll padding exists, but sections lack explicit `scroll-margin-top`. Footer `#home` targets a hidden desktop hero in mobile portrait. |

## Checked and not implicated

- No application document `wheel`, `touchstart`, `touchmove`, or `scroll` listeners; no full-page scroll snapping.
- `preventDefault` appears for carousel keyboard navigation, accidental post-drag click suppression, native image dragging, and WebGL context loss. The context-loss handler is unrelated to scrolling.
- `body:has(dialog[open]) { overflow: hidden }` is restricted to an open native modal. The dialog itself has `overflow:auto` and a viewport-relative max height. This is intentional modal containment, not a persistent page lock; retain it and verify restoration after close.
- Other `overflow:hidden` / `overflow:clip` rules crop decorative artwork and orbit geometry, rather than locking body/html. Decorative overlays already use `pointer-events:none`; preserve that.
- Desktop hero parallax and card tilt use motion values but read bounding boxes during pointer events. Existing offscreen/document visibility gates cover desktop motion; mobile visibility restoration can incorrectly restart motion when the hero is below the viewport.
- Glass blur is confined to small controls and the modal backdrop, not a full-screen animated filter. Cloud layers reuse one local optimized sky image.

## Refactor and validation

Implementation changes and verification results will be recorded here after the fixes. Actual device/browser checks will be distinguished from source review and simulated checks.

### Fixes implemented

- `src/hooks/useHorizontalGesture.ts` and `src/lib/gesture-intent.ts`: shared direction lock with 8px threshold, clear horizontal lead, irreversible vertical yield, and capture only after horizontal intent. Links, buttons and form controls never start dragging. Input is batched once per requestAnimationFrame. No pointer/wheel/touch preventDefault, no document input listeners, and no gesture-time layout reads. Only post-drag clicks on the non-interactive surface and native non-interactive image dragging are cancelled.
- `src/components/MobileCloudOrbit.tsx`: horizontal travel maps to radial angle consistently across card positions; spring inertia remains finite. State updates only when the nearest project changes. Accurate `progressbar` attributes follow the actual motion value; the visible link name is included in its accessible name. Visibility restoration uses IntersectionObserver state.
- `src/app/mobile-orbit.css`: `touch-action:pan-y`; card and navigation now contribute to normal flow. Card minimum height is viewport-aware, artwork is max-height constrained, and full descriptions/actions remain accessible by scrolling the document. The hero has only a minimum viewport height, with no fixed height or nested card scroller. Next card still peeks. Clear “Scroll down” anchor added.
- `src/components/OrbitScene.tsx`: removed OrbitControls. The decorative canvas receives no input; its parent uses the shared gesture recognizer and motion values. Mouse wheel always remains native. Dragging the sculpture also rotates the featured cards.
- `src/components/Portfolio.tsx`: desktop track and drag indicator use the shared recognizer; previous/next remain native buttons. Hero/card hover bounds are cached on pointer entry rather than read during every move. Mobile footer targets the visible hero.
- `src/app/globals.css`: native pan policy for desktop gesture surfaces; explicit section scroll margins; decorative canvas pointer events disabled. The intentional modal-only body lock is retained, with native momentum-enabled dialog scrolling.
- `src/components/ProjectArtwork.tsx`: native image dragging disabled without cancelling pointer events.
- `tests/gesture-intent.test.ts`, `package.json`, `.github/workflows/deploy.yml`: repeatable regression tests for jitter, vertical/diagonal yield, both horizontal directions, finite inertia, and cancellation. These run in Pages CI before typecheck/build.

### Validation actually performed

- `npm run test:gestures`: 3 tests passed. `npm run typecheck`: passed. Production `npm run build`: passed, including TypeScript and static export.
- Connected desktop **Chrome** at 1200×597: native wheel over the sculpture scrolled the document from y=0 to y=298.5 while card order stayed 1/5. Mouse drag changed order to 2/5 without scrolling; next button advanced to 3/5. Canvas computed touch-action is `auto`; decorative parent pointer-events is `none`. No horizontal document overflow.
- In-app browser at 390×844: vertical pointer drags beginning on image, card copy, background and button area kept the project index unchanged. Native scrolling over each area advanced the document. A first immediate read after scrolling the copy was inconclusive; a fresh state check confirmed y=422 and unchanged index. These are pointer-drag + native scroll checks, **not physical touchscreen swipes**.
- Horizontal pointer swipes in both directions advance/return projects. Keyboard Home and End settle at 0% and 100%; progressbar reports `100% explored, project 7 of 7`. Tab reaches the active project link with a visible 3px outline, then the details control. Every other card is reachable through previous/next or carousel arrow keys.
- Short 320×568 and tall 430×932: no horizontal overflow; active card after the introduction; navigation after the card; card content fits its natural box. Card heights measured 339.9px and 559.2px. The short layout deliberately extends the document instead of clipping into a fixed viewport.
- Native anchors to #work and #about change the hash, scroll the document and settle with clearance above the section. About settled at y=43.8px from the viewport top. Clouds report paused when offscreen.
- Detail dialog opens with modal-only body overflow:hidden; Escape closes it, restores focus to the details button, and restores body overflow:visible. Scrolling is not left locked.
- No browser console errors in either inspected browser. Screenshot: `preview-scroll-mobile.png`. Temporary viewport overrides reset.
- **Not verified:** physical iPhone Safari momentum/finger gestures, device orientation permission, Firefox, VoiceOver/screen-reader announcements, OS reduced-motion emulation, or low-end-device frame timing. Source review confirms native pan-y, no document wheel interception, reduced-motion guards, and live progress semantics. The connected browser inventory has Chrome and the in-app browser; no Safari/Firefox test surface was exposed.

Accessibility disposition: the inspected fixes address scroll reflow/access to controls (WCAG 1.4.10), visible link naming (2.5.3), keyboard alternatives (2.1.1/2.5.7), and programmatic progress state (4.1.2). This is not a full WCAG conformance assessment; untested assistive-technology coverage is excluded.

Approve for the inspected scope.
