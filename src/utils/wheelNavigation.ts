export type WheelNavigationAction = 'back' | 'forward' | 'prevMistake' | 'nextMistake';

export const WHEEL_NAVIGATION_THRESHOLD = 30;
export const WHEEL_NAVIGATION_THROTTLE_MS = 50;

export function getWheelNavigationAction(args: {
  deltaX: number;
  deltaY: number;
  shiftKey?: boolean;
  threshold?: number;
}): WheelNavigationAction | null {
  const dominantDelta = Math.abs(args.deltaY) >= Math.abs(args.deltaX) ? args.deltaY : args.deltaX;
  const threshold = args.threshold ?? WHEEL_NAVIGATION_THRESHOLD;
  if (dominantDelta === 0 || Math.abs(dominantDelta) < threshold) return null;

  const scrollUp = dominantDelta < 0;
  if (args.shiftKey) return scrollUp ? 'prevMistake' : 'nextMistake';
  return scrollUp ? 'back' : 'forward';
}
