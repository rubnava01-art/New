import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset paths so the build also works from a sub-path
  // (e.g. username.github.io/nest-forge-ai/ on GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss()],
});
