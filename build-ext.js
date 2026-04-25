/**
 * Post-build script: copies manifest.json and icons into dist/
 * Run after: npm run build
 */

import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';

// 1. Copy manifest.json
copyFileSync('manifest.json', join(DIST, 'manifest.json'));
console.log('✓ Copied manifest.json');

// 2. Copy icons
const iconsDir = join(DIST, 'icons');
mkdirSync(iconsDir, { recursive: true });

if (existsSync('public/icons')) {
  readdirSync('public/icons').forEach(f => {
    copyFileSync(join('public/icons', f), join(iconsDir, f));
    console.log(`✓ Copied icons/${f}`);
  });
} else {
  console.warn('⚠ No public/icons directory found — add icon16.png, icon48.png, icon128.png');
}

console.log('\n🚀 dist/ is ready to load as an unpacked Chrome extension!\n');
