import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  normalizeKataGoBackendPreference,
  shouldCacheKataGoFallbackForRequest,
  shouldRetryKataGoModelLoadOnFallback,
} from '../src/engine/katago/backendFallback';

describe('KataGo backend fallback policy', () => {
  it('defaults to WebGPU while preserving explicit CPU/WASM choices', () => {
    expect(normalizeKataGoBackendPreference()).toBe('webgpu');
    expect(normalizeKataGoBackendPreference('webgpu')).toBe('webgpu');
    expect(normalizeKataGoBackendPreference('wasm')).toBe('wasm');
    expect(normalizeKataGoBackendPreference('cpu')).toBe('cpu');
  });

  it('retries only WebGPU warm-up failures on a fallback backend', () => {
    expect(shouldRetryKataGoModelLoadOnFallback({
      requestedBackend: 'webgpu',
      activeBackend: 'webgpu',
      stage: 'warmup',
    })).toBe(true);
    expect(shouldRetryKataGoModelLoadOnFallback({
      requestedBackend: 'webgpu',
      activeBackend: 'WebGPU',
      stage: 'warmup',
    })).toBe(true);
    expect(shouldRetryKataGoModelLoadOnFallback({
      requestedBackend: 'webgpu',
      activeBackend: 'webgpu',
      stage: 'fetch',
    })).toBe(false);
    expect(shouldRetryKataGoModelLoadOnFallback({
      requestedBackend: 'webgpu',
      activeBackend: 'wasm',
      stage: 'warmup',
    })).toBe(false);
    expect(shouldRetryKataGoModelLoadOnFallback({
      requestedBackend: 'wasm',
      activeBackend: 'wasm',
      stage: 'warmup',
    })).toBe(false);
  });

  it('caches a successful fallback backend under the original WebGPU request', () => {
    expect(shouldCacheKataGoFallbackForRequest({
      requestedBackend: 'webgpu',
      fallbackBackend: 'wasm',
    })).toBe(true);
    expect(shouldCacheKataGoFallbackForRequest({
      requestedBackend: 'webgpu',
      fallbackBackend: 'cpu',
    })).toBe(true);
    expect(shouldCacheKataGoFallbackForRequest({
      requestedBackend: 'webgpu',
      fallbackBackend: 'webgpu',
    })).toBe(false);
    expect(shouldCacheKataGoFallbackForRequest({
      requestedBackend: 'wasm',
      fallbackBackend: 'cpu',
    })).toBe(false);
  });

  it('wires the warm-up retry through the worker model load path', () => {
    const workerSource = readFileSync('src/engine/katago/worker.ts', 'utf8');

    expect(workerSource).toContain('installModel(await createWarmedModel(parsed), parsed, modelUrl);');
    expect(workerSource).toContain('shouldRetryKataGoModelLoadOnFallback({');
    expect(workerSource).toContain("stage: 'warmup'");
    expect(workerSource).toContain('await switchToWasmFallbackForRequest(requestedBackend);');
    expect(workerSource).toContain('backendPreference = requestedBackend;');
  });
});
