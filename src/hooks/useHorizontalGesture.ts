'use client';

import { useEffect, useRef, type PointerEvent, type MouseEvent, type DragEvent } from 'react';
import { gestureIntent } from '../lib/gesture-intent';

type Sample = { dx: number; dy: number; velocity: number; width: number; x: number; y: number };
type Options = {
  onStart?: () => void;
  onMove?: (sample: Sample) => void;
  onEnd: (sample: Sample & { cancelled: boolean }) => void;
};
type Gesture = Sample & { id: number; startX: number; startY: number; lastX: number; time: number; horizontal: boolean; element: HTMLElement };
const interactive = 'a,button,input,textarea,select,summary,[contenteditable="true"],[role="button"]';

/** No document listeners, wheel listeners or pointer preventDefault. CSS owns vertical panning. */
export function useHorizontalGesture(options: Options) {
  const callbacks = useRef(options);
  callbacks.current = options;
  const gesture = useRef<Gesture | null>(null);
  const frame = useRef<number | null>(null);
  const suppressUntil = useRef(0);
  function flush() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    const state = gesture.current;
    if (state?.horizontal) callbacks.current.onMove?.(state);
  }
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    suppressUntil.current = 0;
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest(interactive)) return;
    const element = event.currentTarget;
    // A single layout read at pointerdown; moves use cached width and offsets.
    gesture.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, lastX: event.clientX, time: performance.now(), horizontal: false, element,
      dx: 0, dy: 0, velocity: 0, width: element.getBoundingClientRect().width, x: event.clientX, y: event.clientY };
  }
  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;
    if (!state.horizontal) {
      const intent = gestureIntent(dx, dy);
      if (intent === 'vertical') { gesture.current = null; return; }
      if (intent === 'pending') return;
      state.horizontal = true;
      callbacks.current.onStart?.();
      state.element.dataset.dragging = 'true';
      try { state.element.setPointerCapture?.(event.pointerId); } catch { /* Pointer may already have been cancelled by the browser. */ }
    }
    const now = performance.now();
    state.velocity = state.velocity * .35 + ((event.clientX - state.lastX) / Math.max(now - state.time, 8) * 1000) * .65;
    Object.assign(state, { dx, dy, x: event.clientX, y: event.clientY, lastX: event.clientX, time: now });
    if (frame.current === null) frame.current = requestAnimationFrame(() => { frame.current = null; flush(); });
  }
  function finish(event: PointerEvent<HTMLElement>, cancelled = false) {
    const state = gesture.current;
    if (!state || state.id !== event.pointerId) return;
    if (state.horizontal) flush();
    gesture.current = null;
    delete state.element.dataset.dragging;
    if (state.element.hasPointerCapture?.(state.id)) state.element.releasePointerCapture?.(state.id);
    if (!state.horizontal) return;
    if (performance.now() - state.time > 100) state.velocity = 0;
    suppressUntil.current = performance.now() + 350;
    callbacks.current.onEnd({ ...state, cancelled });
  }
  return {
    onPointerDown, onPointerMove,
    onPointerUp: (event: PointerEvent<HTMLElement>) => finish(event),
    onPointerCancel: (event: PointerEvent<HTMLElement>) => finish(event, true),
    onLostPointerCapture: (event: PointerEvent<HTMLElement>) => finish(event, true),
    onPointerLeave: (event: PointerEvent<HTMLElement>) => { if (gesture.current && !event.currentTarget.hasPointerCapture?.(event.pointerId)) finish(event, true); },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (event.detail > 0 && performance.now() < suppressUntil.current && !(event.target as Element).closest(interactive)) {
        event.preventDefault(); event.stopPropagation();
      }
    },
    onDragStartCapture: (event: DragEvent<HTMLElement>) => { if (!(event.target as Element).closest(interactive)) event.preventDefault(); },
  };
}
