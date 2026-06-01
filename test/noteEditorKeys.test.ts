import { describe, expect, it } from 'vitest';
import { getNoteEditorKeyAction } from '../src/utils/noteEditorKeys';

describe('note editor keyboard actions', () => {
  it('saves on Enter while keeping Shift+Enter available for multiline notes', () => {
    expect(getNoteEditorKeyAction({ key: 'Enter' })).toBe('save');
    expect(getNoteEditorKeyAction({ key: 'NumpadEnter' })).toBe('save');
    expect(getNoteEditorKeyAction({ key: 'Enter', shiftKey: true })).toBe('none');
  });

  it('supports command save and Escape cancel without stealing IME composition', () => {
    expect(getNoteEditorKeyAction({ key: 's', ctrlKey: true })).toBe('save');
    expect(getNoteEditorKeyAction({ key: 'S', metaKey: true })).toBe('save');
    expect(getNoteEditorKeyAction({ key: 'Escape' })).toBe('cancel');
    expect(getNoteEditorKeyAction({ key: 'Enter', isComposing: true })).toBe('none');
  });

  it('leaves alternate enter chords alone for browser and platform text editing', () => {
    expect(getNoteEditorKeyAction({ key: 'Enter', altKey: true })).toBe('none');
    expect(getNoteEditorKeyAction({ key: 's', ctrlKey: true, altKey: true })).toBe('none');
  });
});
