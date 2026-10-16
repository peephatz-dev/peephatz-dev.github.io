# Peeraphat · Personal orbit

A personal link hub for a first-year KMUTT builder. The primary task is discovering real work and making contact.

Ice #EDF3FC, Cloud #F8FAFF, Ink #111D37, Cobalt #1550ED, Slate #52627E, Chrome #BAC8DD. Syne display typography, DM Sans UI, and Noto Sans Thai fallback. The supplied reference guides the airy sky, reflection, glass fan, perspective angles, and chrome orbit composition.

Desktop places the introduction on the left and an interactive sculpture on the right, above five glass links. Desktop and landscape keep the original layout. Portrait screens up to 800px use a separate Floating Cloud Orbit hero. The seven-project section includes native detail dialogs and category filters. Navigation and every destination remain usable without dragging.

## Mobile portrait: Floating Cloud Orbit

Experience mode. Sky #A9D4F6, Ice #F3F9FF, Ink #142D50, Electric blue #124DE6, chrome borders #B5CBE3. Syne carries the oversized introduction and project titles; DM Sans keeps descriptions readable. One 82vw × 60dvh glass project card dominates the center, with neighboring artwork peeking at the edges. The card uses a viewport-aware minimum height with a constrained artwork area; its body and controls participate in normal document flow, so short screens and enlarged text can extend the page without clipping or nested card scrolling. The wheel is a 200vw circle projected into the sky plane behind the active card; cards translate and scale without rotating their text.

Seven original projects form a finite 276° sequence with 46° spacing. Pointer input locks only after a clear horizontal gesture and converts horizontal travel to angle. It estimates recent angular velocity, projects inertia, and springs to the nearest project. Vertical gestures always yield to native page scrolling; gestures beginning on links or buttons are excluded. Clamped angular position / 276° drives the live exploration number and progress track: the first project is 0%, the last is 100%. It never loops or reports a synthetic loading percentage. Arrow buttons and ArrowLeft/ArrowRight/Home/End provide alternatives to dragging; inactive cards are inert. Dragging suppresses accidental link activation while taps retain normal navigation.

The existing 91KB sky image supplies the backdrop and three masked photographic cloud layers. Independent transform animations drift at 48, 32, and 23 seconds; foreground clouds pass across the lower card edge without intercepting input. Touch and optional device orientation add spring parallax. Device orientation permission is requested only from Enable tilt; denied or unsupported sensors leave touch navigation available. Cloud playback pauses on user request, offscreen, when the document is hidden, and under prefers-reduced-motion. Reduced motion also removes snapping inertia. Mobile portrait does not mount the desktop WebGL scene.

## Real assets

MODHEW, Mitsubishi Electric, S&P, and Sam Hao use the exact user-supplied artwork. WebP derivatives reduce transfer size without replacing project visuals. Originals remain in `public/assets/`. The PowerGuard preview is the project's own coastal-community illustration from https://peephatz-dev.github.io/community-field-notes/energy-platform/powerguard/scenes/coastal-community.png. Its community link is reproduced as provided by the user. The linked prototype has an engineer 3D mode; the portfolio does not claim a live monitoring deployment.

The rounded 3D lowercase p is assembled from capsule and torus geometry so highlights flow around curved chrome surfaces. A transparent Fresnel shell adds edge reflections to the glass sphere. Chrome materials reflect a local generated studio-light environment; no external HDR download is required. Geometry is shared and disposed on unmount, environment capture occurs once, DPR is capped at 1.5, the sky slowly zooms from 1 to 1.12 over 45 seconds and returns over 45 seconds, and rendering pauses when the hero or document is hidden. A static generated-art fallback covers unsupported WebGL and reduced-motion preference.

## Generated assets

Built-in imagegen created the original sculpture artwork and edited the sky asset. These are decorative art, not project evidence or a portrait.

Original prompt: A premium photorealistic 3D art render, landscape 1536x1024. A sculptural lowercase letter p made from thick liquid mirror chrome, suspended in a clear spherical glass bubble with two thin tilted chrome orbital rings. Upper middle 40% of the image, airy clean negative space on the sides and bottom. Pale icy blue sky, soft luminous white clouds, subtle reflective pale silver floor, blue reflections, polished glass caustics, futuristic Y2K editorial aesthetic, daylight. Front view, calm balanced composition. No people, cards, interface, other text, labels or watermarks.

Original output: `/Users/nokia/.codex/generated_images/01a14025-63e4-7c22-a1ec-9dea3fbdfca1/exec-61f780fd-7600-4c46-89c9-2824a40aa3d8.png`. Optimized asset: `public/assets/orbit-fallback.webp`.

Sky edit: Remove the chrome letter p, sphere, orbit rings, and their reflections; retain the realistic pale blue sky, clouds, reflected floor, original framing and lighting. No text or added objects.

Edited output: `/Users/nokia/.codex/generated_images/01a14025-63e4-7c22-a1ec-9dea3fbdfca1/exec-0f045d90-506e-42a8-9244-17b73349815f.png`. Optimized asset: `public/assets/sky.webp`.

Scroll interaction updates are documented in `SCROLL-AUDIT.md`. The desktop sculpture uses the same horizontal gesture recognizer as the card wheel; Drei OrbitControls is removed so it cannot set touch-action:none or register a non-passive wheel listener. The decorative canvas does not receive pointer events.


## Cloud Observatory portrait polish — 2026-10-16

The portrait edition uses sky blue (#a9d4f6), ice (#edf3fc), glass white (#f5f9ff), chrome silver (#b4cbe2), ink (#142d50), and electric blue (#124de6). Syne carries the display hierarchy; DM Sans keeps descriptions and controls readable. The visual focus stays on original project artwork, with a small static chrome orbit echoing the desktop sculpture.

The opening hierarchy is identity → editorial headline → floating artwork → navigation. Cards occupy 84vw, with an adaptive 54svh minimum and natural content height. This makes room for the scroll cue and progress controls without clipping long descriptions. Project sections use larger images, quieter framing, legible impact details, and a cloud-backed contact panel. All new section styling is portrait-scoped; desktop styling and interaction code are unchanged. No new assets, dependencies, continuous animation, or backdrop-filter regions were added.

Validation: gesture tests (3), typecheck and production build pass. Browser checks confirmed native pan-y, project 2/7 at 17%, #about landing with roughly 44px clearance, no horizontal overflow and accessible card content at actual 320×567 and 390×844 CSS viewports. Physical iPhone Safari was not tested in this pass.
