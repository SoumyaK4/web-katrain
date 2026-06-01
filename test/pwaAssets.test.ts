import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(rootDir, 'public');

function readPngSize(relativePath: string): { width: number; height: number } {
  const buffer = fs.readFileSync(path.join(publicDir, relativePath));
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

describe('PWA assets', () => {
  it('ships PNG install icons for manifest and iOS home-screen installs', () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(publicDir, 'manifest.webmanifest'), 'utf8')
    ) as {
      id?: string;
      icons?: Array<{ src?: string; sizes?: string; type?: string; purpose?: string }>;
      shortcuts?: Array<{ icons?: Array<{ src?: string; sizes?: string; type?: string }> }>;
    };

    expect(manifest.id).toBe('.');
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          src: 'pwa/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        }),
        expect.objectContaining({
          src: 'pwa/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }),
      ])
    );
    expect(manifest.shortcuts?.[0]?.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: 'pwa/icon-192.png', sizes: '192x192', type: 'image/png' }),
      ])
    );

    expect(readPngSize('pwa/icon-192.png')).toEqual({ width: 192, height: 192 });
    expect(readPngSize('pwa/icon-512.png')).toEqual({ width: 512, height: 512 });
    expect(readPngSize('pwa/apple-touch-icon.png')).toEqual({ width: 180, height: 180 });

    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    expect(indexHtml).toContain('pwa/apple-touch-icon.png');

    const sw = fs.readFileSync(path.join(publicDir, 'sw.js'), 'utf8');
    expect(sw).toContain('./pwa/icon-192.png');
    expect(sw).toContain('./pwa/icon-512.png');
    expect(sw).toContain('./pwa/apple-touch-icon.png');
  });
});
