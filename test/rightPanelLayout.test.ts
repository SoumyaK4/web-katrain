import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('RightPanel layout', () => {
  it('keeps bottom content from ending flush against the viewport', () => {
    const source = readFileSync('src/components/layout/RightPanel.tsx', 'utf8');

    expect(source).toContain('flex-1 min-h-0 overflow-y-auto overscroll-contain pb-3');
  });

  it('uses strict integer draft parsing for branch number edits', () => {
    const source = readFileSync('src/components/layout/RightPanel.tsx', 'utf8');

    expect(source).toContain("import { parseIntegerDraft } from '../../utils/numberDraft'");
    expect(source).toContain('const parsed = parseIntegerDraft(branchIndexDraft)');
    expect(source).not.toContain('Number.parseInt(branchIndexDraft.trim()');
    expect(source).toMatch(/type="number"[\s\S]{0,420}aria-label="Branch number"/);
  });
});
