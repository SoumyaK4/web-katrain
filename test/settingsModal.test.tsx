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

  it('binds General settings labels to their controls', () => {
    const html = renderToStaticMarkup(<SettingsModal onClose={() => undefined} />);

    [
      ['settings-sound-enabled', 'Sound Effects'],
      ['settings-timer-sound', 'Timer Sound'],
      ['settings-main-time', 'Main Time (min)'],
      ['settings-byo-length', 'Byo Length (sec)'],
      ['settings-byo-periods', 'Byo Periods'],
      ['settings-minimal-use', 'Minimal Use (sec)'],
      ['settings-show-coordinates', 'Show Coordinates'],
      ['settings-next-move-preview', 'Next Move Preview'],
      ['settings-show-move-numbers', 'Show Move Numbers'],
      ['settings-show-board-controls', 'Show Board Controls'],
      ['settings-fuzzy-stone-placement', 'Fuzzy Stone Placement'],
      ['settings-default-board-size', 'Default Board Size'],
      ['settings-default-handicap', 'Default Handicap'],
      ['settings-ui-theme', 'UI Theme'],
      ['settings-ui-density', 'UI Density'],
      ['settings-gamepad-navigation', 'Gamepad Navigation'],
      ['settings-touch-haptics', 'Touch Haptics'],
      ['settings-load-sgf-rewind', 'Load SGF Rewind'],
      ['settings-load-sgf-fast-analysis', 'Load SGF Fast Analysis'],
      ['settings-pv-animation-time', 'PV Animation Time (sec)'],
      ['settings-game-rules', 'Rules'],
    ].forEach(([id, label]) => {
      expect(html).toContain(`for="${id}"`);
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`>${label}</label>`);
    });
  });

  it('binds Analysis settings labels to their controls', () => {
    const source = readFileSync('src/components/SettingsModal.tsx', 'utf8');

    [
      ['settings-analysis-show-children', 'Show Children ('],
      ['settings-analysis-evaluation-dots', 'Evaluation Dots ('],
      ['settings-analysis-top-moves', 'Top Moves (Hints) ('],
      ['settings-analysis-policy', 'Policy ('],
      ['settings-analysis-ownership', 'Ownership (Territory) ('],
      ['settings-analysis-evaluation-theme', 'Evaluation Theme'],
      ['settings-analysis-low-visits-threshold', 'Low Visits Threshold'],
      ['settings-analysis-primary-label', 'Primary Label'],
      ['settings-analysis-secondary-label', 'Secondary Label'],
      ['settings-analysis-policy-heatmap', 'Policy Heatmap ('],
      ['settings-analysis-extra-precision', 'Extra Precision'],
      ['settings-analysis-show-ai-dots', 'Show AI Dots'],
      ['settings-analysis-save-analysis', 'Save analysis in SGF'],
      ['settings-analysis-save-sgf-marks', 'Save SGF marks (X / square)'],
      ['settings-analysis-lock-ai-details', 'Lock AI details (Play mode)'],
      ['settings-analysis-last-n-eval-dots', 'Show Last N Eval Dots'],
      ['settings-analysis-mistake-threshold', 'Mistake Threshold (Points)'],
    ].forEach(([id, label]) => {
      expect(source).toContain(`htmlFor="${id}"`);
      expect(source).toContain(`id="${id}"`);
      expect(source).toContain(label);
    });

    [
      'settings-teach-threshold',
      'settings-teach-undo',
      'settings-teach-show-dots',
      'settings-teach-save-sgf',
    ].forEach((id) => {
      expect(source).toContain(`htmlFor={\`${id}-${'${i}'}\`}`);
      expect(source).toContain(`id={\`${id}-${'${i}'}\`}`);
    });
    expect(source).toContain('<span className="sr-only"> row {i + 1}</span>');
  });
});
