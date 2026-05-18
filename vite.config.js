import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to GitHub Pages under https://<user>.github.io/<repo>/,
// set base to '/<repo>/'. For a custom domain or root deploy, set to '/'.
// The GitHub Actions workflow passes VITE_BASE so you don't need to edit this.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
