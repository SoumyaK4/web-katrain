export type VisualViewportLike = Pick<VisualViewport, 'addEventListener' | 'removeEventListener'>;

type VisualViewportSource = {
  visualViewport?: VisualViewportLike | null;
};

export function getVisualViewport(target?: VisualViewportSource | null): VisualViewportLike | null {
  try {
    const source = target ?? (typeof window !== 'undefined' ? window : null);
    const viewport = source?.visualViewport;
    if (!viewport) return null;
    if (typeof viewport.addEventListener !== 'function' || typeof viewport.removeEventListener !== 'function') {
      return null;
    }
    return viewport;
  } catch {
    return null;
  }
}
