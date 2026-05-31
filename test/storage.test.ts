import { afterEach, describe, expect, it } from 'vitest';
import { defaultUiState, loadUiState, saveUiState, UI_STATE_KEY } from '../src/components/layout/types';
import {
  getLocalStorage,
  readLocalStorage,
  removeLocalStorage,
  writeLocalStorage,
} from '../src/utils/storage';

const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function restoreLocalStorage() {
  if (originalLocalStorage) {
    Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
  } else {
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
}

function installMemoryStorage() {
  const values = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: storage,
  });
  return storage;
}

afterEach(() => {
  restoreLocalStorage();
});

describe('safe localStorage helpers', () => {
  it('reads, writes, and removes values when storage is available', () => {
    installMemoryStorage();

    expect(writeLocalStorage('key', 'value')).toBe(true);
    expect(readLocalStorage('key')).toBe('value');
    expect(removeLocalStorage('key')).toBe(true);
    expect(readLocalStorage('key')).toBeNull();
  });

  it('swallows storage access exceptions', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('storage blocked');
      },
    });

    expect(getLocalStorage()).toBeNull();
    expect(readLocalStorage('key')).toBeNull();
    expect(writeLocalStorage('key', 'value')).toBe(false);
    expect(removeLocalStorage('key')).toBe(false);
  });
});

describe('UI state storage', () => {
  it('falls back to defaults when localStorage is blocked', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        throw new Error('storage blocked');
      },
    });

    expect(loadUiState()).toEqual(defaultUiState());
    expect(() => saveUiState(defaultUiState())).not.toThrow();
  });

  it('loads saved UI state through the safe storage path', () => {
    const storage = installMemoryStorage();
    storage.setItem(UI_STATE_KEY, JSON.stringify({ mode: 'analyze' }));

    expect(loadUiState().mode).toBe('analyze');
  });
});
