import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base を相対パスにしておくと GitHub Pages などサブパス配信でもそのまま動く
export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
