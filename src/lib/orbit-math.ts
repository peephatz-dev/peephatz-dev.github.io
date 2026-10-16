export const TAU = Math.PI * 2;
export const wrap = (value: number, length: number) => ((value % length) + length) % length;
export function orbitState(rotation: number, count: number) {
  const raw = rotation / (TAU / count);
  const steps = Math.abs(raw - Math.round(raw)) < 1e-8 ? Math.round(raw) : raw;
  const cycle = wrap(steps, count);
  return { active: wrap(Math.round(steps), count), percent: cycle / count * 100, revolution: Math.floor(steps / count) };
}
export function snapOrbit(rotation: number, velocity: number, count: number, cancelled = false) {
  const step = TAU / count;
  const inertia = cancelled ? 0 : Math.max(-3, Math.min(3, velocity)) * .16;
  return Math.round((rotation + inertia) / step) * step;
}
export function cardPosition(index: number, count: number, rotation: number, radiusX: number, radiusZ: number) {
  const angle = index * TAU / count - rotation;
  return { x: Math.sin(angle) * radiusX, z: Math.cos(angle) * radiusZ, angle };
}
export function finiteScrollProgress(scrollY: number, sectionTop: number, sectionHeight: number, viewportHeight: number) {
  return Math.max(0, Math.min(1, (scrollY - sectionTop) / Math.max(1, sectionHeight - viewportHeight)));
}
export function finiteScrollActive(progress: number, count: number) {
  return Math.min(count - 1, Math.floor(Math.max(0, Math.min(1, progress)) * count + .5));
}
