import { describe, expect, it } from 'vitest';
import {
  isEditableKeyboardTarget,
  isTextEntryTarget,
  shouldIgnoreKeyboardShortcutTarget,
} from '../src/utils/keyboardTarget';

describe('isTextEntryTarget', () => {
  it('detects form fields and contenteditable paste targets', () => {
    expect(isTextEntryTarget({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true);
    expect(isTextEntryTarget({ tagName: 'textarea' } as unknown as EventTarget)).toBe(true);
    expect(isTextEntryTarget({ tagName: 'SELECT' } as unknown as EventTarget)).toBe(true);
    expect(isTextEntryTarget({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)).toBe(true);
    expect(isTextEntryTarget({
      tagName: 'SPAN',
      closest: (selector: string) => (selector.includes('contenteditable') ? ({} as Element) : null),
    } as unknown as EventTarget)).toBe(true);
  });

  it('does not treat ordinary controls as text entry targets', () => {
    expect(isTextEntryTarget({ tagName: 'BUTTON' } as unknown as EventTarget)).toBe(false);
    expect(isTextEntryTarget({ tagName: 'DIV' } as unknown as EventTarget)).toBe(false);
    expect(isTextEntryTarget(null)).toBe(false);
  });
});

describe('isEditableKeyboardTarget', () => {
  it('detects form and contenteditable keyboard targets', () => {
    expect(isEditableKeyboardTarget({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'textarea' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'SELECT' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)).toBe(true);
  });

  it('detects focused interactive controls', () => {
    expect(isEditableKeyboardTarget({ tagName: 'BUTTON' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'a' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({
      tagName: 'DIV',
      getAttribute: (name: string) => (name === 'role' ? 'tab' : null),
    } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({
      tagName: 'DIV',
      getAttribute: (name: string) => (name === 'role' ? 'slider' : null),
    } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({
      tagName: 'DIV',
      getAttribute: (name: string) => (name === 'role' ? 'treeitem' : null),
    } as unknown as EventTarget)).toBe(true);
  });

  it('ignores ordinary targets and missing targets', () => {
    expect(isEditableKeyboardTarget({} as EventTarget)).toBe(false);
    expect(isEditableKeyboardTarget(null)).toBe(false);
  });
});

describe('shouldIgnoreKeyboardShortcutTarget', () => {
  it('blocks shortcuts from either the event target or active element', () => {
    expect(shouldIgnoreKeyboardShortcutTarget({ tagName: 'BUTTON' } as unknown as EventTarget, null)).toBe(true);
    expect(shouldIgnoreKeyboardShortcutTarget({} as EventTarget, { tagName: 'INPUT' } as unknown as EventTarget)).toBe(true);
    expect(shouldIgnoreKeyboardShortcutTarget({} as EventTarget, {} as EventTarget)).toBe(false);
  });
});
