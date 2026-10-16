# Reference audit — orbital Linktree

## Evidence and limits

The attachment supplied with this request contains the written brief only. No reference image is present in the attachment directory or repository. Consequently no image-specific composition, camera, proportions, materials, typography or spacing can be visually verified. All target values below are deliberate approximations from the written brief; this is not a pixel-match claim. Repository assets contain project logos, a sky, an abstract orbit poster and a community illustration, but no authorized personal portrait. Use an explicitly abstract P monogram.

## Verified implementation gaps before this change

- Desktop cards in `Portfolio.tsx` use slot-based X/Y transforms and slight CSS tilt. They do not traverse a circular world-space X/Z orbit and cannot be occluded by the Three.js sculpture.
- The old `OrbitScene.tsx` renders a chrome P sculpture and rings separately from the links. Its rotation and card ordering are separate interactions.
- Portrait `MobileCloudOrbit.tsx` projects a circle into translations, opacity and scale. Cards have no true depth buffer or shared camera.
- Profile identity is an offset tag on desktop and a small header on mobile, not a centered, anchored profile composition.
- The current home opens with portfolio prose. The requested primary flow is profile → rotate → open destination.
- Existing project data and working native-scroll gesture direction detection should be retained.

## Target approximations (not measurements of the missing image)

| Property | Implementation direction |
| --- | --- |
| Composition | Compact header, centered profile medallion, elliptical cards, bottom controls |
| Camera | Perspective camera with distinct portrait position/FOV and card dimensions |
| Orbit | Shared world-space sine X / cosine Z; front and back travel, depth-tested geometry |
| Cards | Beveled acrylic slab, chrome edge, transparent face artwork, readable dark ink |
| Chrome | PBR metal, generated local studio environment captured once; no borrowed HDR assets |
| Profile | Abstract P monogram inside a chrome/glass circular frame, real name and requested subtitle |
| Sky | Existing authorized sky asset; restrained transform-only layers and floor reflection impression |
| Type | Existing Syne / DM Sans with concise link names, supporting DOM text for accessibility |
| Navigation | Previous/next, arrow keys, explicit wheel-mode control, stable cycle indicator |
| Mobile | Native pan-y, horizontal intent and cancellation, reachable DOM destination link |

Wheel-mode deliberately requires opt-in on desktop and is scoped to the scene. Ordinary document wheel scrolling remains native. The new request authorizes desktop composition changes, superseding the earlier request to preserve the desktop hero exactly. All seven projects and destinations remain available below the orbit.
