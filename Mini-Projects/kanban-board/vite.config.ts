import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, filename: 'bundle-stats.html' })
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@lib': '/../react-ui-system/src/lib',
      '@hooks': '/../react-ui-system/src/hooks'
    }
  }
});
