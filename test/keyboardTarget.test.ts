import { describe, expect, it } from 'vitest';
import { isEditableKeyboardTarget } from '../src/utils/keyboardTarget';

describe('isEditableKeyboardTarget', () => {
  it('detects form and contenteditable keyboard targets', () => {
    expect(isEditableKeyboardTarget({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'textarea' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'SELECT' } as unknown as EventTarget)).toBe(true);
    expect(isEditableKeyboardTarget({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)).toBe(true);
  });

  it('ignores ordinary targets and missing targets', () => {
    expect(isEditableKeyboardTarget({ tagName: 'BUTTON' } as unknown as EventTarget)).toBe(false);
    expect(isEditableKeyboardTarget({} as EventTarget)).toBe(false);
    expect(isEditableKeyboardTarget(null)).toBe(false);
  });
});
