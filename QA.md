# Verification · 15 October 2026 · Next.js redesign

- `npm run typecheck` passes.
- `npm run build` succeeds and emits the production static export in `out/` (Next.js 16.4.1).
- Production export served over HTTP and inspected in the in-app browser.
- Seven project cards render. Products / AI & learning / Community return 2 / 2 / 3 cards; Everything restores 7.
- All seven dialogs open with their correct project title and supplied destinations, fit the measured 320px viewport, and close with the close button. Escape closes the dialog and restores focus to the opener.
- Copy email invokes the clipboard API and shows success feedback. Automation's separate clipboard surface has not independently verified the pasted contents.
- No horizontal page overflow at measured CSS widths 320, 390, and 1440. Header action bounds fit at 320px. Mobile sculpture now starts below the introduction rather than behind its text.
- WebGL canvas loads and the static poster switches to the interactive sculpture. Rotation controls change the featured link order. Pause toggles its accessible pressed state and Play/Pause label.
- Desktop and mobile compositions visually inspected. Actual user logos are used. Large logo WebP derivatives reduce download size; below-fold images are lazy-loaded.
- Reduced-motion CSS and Framer Motion preference support were reviewed in source. An OS-level reduced-motion emulation was not performed in this browser.
- Browser emitted a Three.js Clock deprecation warning from the rendering dependency, without blocking the scene.
- Original LinkedIn short URLs are preserved. Their redirect destinations were not independently verified.

Responsive viewport controls apply a display scale; dimensions above use the measured page CSS width.

Follow-up visual adjustment: replaced flat text extrusion with rounded chrome capsule/torus geometry and added a Fresnel glass shell. Added a 90-second sky zoom cycle (45s in / 45s out). Browser computed styles confirm the zoom transform progresses, pauses with the motion control, and resumes. Typecheck and production build pass after this change.
