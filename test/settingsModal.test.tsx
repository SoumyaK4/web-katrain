import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { SettingsModal } from '../src/components/SettingsModal';

describe('SettingsModal', () => {
  it('uses theme-aware tab classes instead of hard-coded dark colors', () => {
    const html = renderToStaticMarkup(<SettingsModal onClose={() => undefined} />);

    expect(html).toContain('settings-modal');
    expect(html).toContain('settings-tabs');
    expect(html).toContain('settings-tab-active');
    expect(html).not.toContain('border-blue-500');
    expect(html).not.toContain('text-white border-b-2');
    expect(html).not.toContain('text-white');
    expect(html).not.toContain('bg-slate-900/60');
    expect(html).not.toContain('bg-slate-800/70');
  });

  it('keeps deep settings labels on theme tokens', () => {
    const source = readFileSync('src/components/SettingsModal.tsx', 'utf8');

    expect(source).not.toContain('text-slate-300');
    expect(source).not.toContain('text-slate-400');
    expect(source).not.toContain('border-slate-700/50');
  });

  it('shows board theme descriptions in the Kaya-style picker', () => {
    const html = renderToStaticMarkup(<SettingsModal onClose={() => undefined} />);

    expect(html).toContain('Kaya-style previews');
    expect(html).toContain('Traditional clamshell and slate stones');
  });
});
