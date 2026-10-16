export type GestureIntent = 'pending' | 'horizontal' | 'vertical';

// Once vertical intent wins, the caller abandons the gesture for its lifetime.
// A diagonal needs a clear horizontal lead before we capture a pointer.
export function gestureIntent(dx: number, dy: number): GestureIntent {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return 'pending';
  if (Math.abs(dy) >= Math.abs(dx)) return 'vertical';
  return Math.abs(dx) > Math.abs(dy) * 1.25 ? 'horizontal' : 'pending';
}

export function projectedSnap(position: number, velocity: number, step: number, end: number, cancelled = false) {
  const projected = position + (cancelled ? 0 : Math.max(-420, Math.min(420, velocity)) * .18);
  return Math.max(0, Math.min(end, Math.round(projected / step) * step));
}
