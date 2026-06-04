import type { KataGoBackendPreference } from '../../types';

export type KataGoModelLoadStage = 'fetch' | 'parse' | 'warmup';

export const normalizeKataGoBackendPreference = (
  backend?: KataGoBackendPreference | null
): KataGoBackendPreference => (backend === 'wasm' || backend === 'cpu' ? backend : 'webgpu');

export function shouldRetryKataGoModelLoadOnFallback(args: {
  requestedBackend: KataGoBackendPreference;
  activeBackend: string | null | undefined;
  stage: KataGoModelLoadStage;
}): boolean {
  return (
    args.stage === 'warmup' &&
    args.requestedBackend === 'webgpu' &&
    args.activeBackend?.trim().toLowerCase() === 'webgpu'
  );
}

export function shouldCacheKataGoFallbackForRequest(args: {
  requestedBackend: KataGoBackendPreference;
  fallbackBackend: string | null | undefined;
}): boolean {
  const fallbackBackend = args.fallbackBackend?.trim().toLowerCase();
  return args.requestedBackend === 'webgpu' && !!fallbackBackend && fallbackBackend !== 'webgpu';
}
