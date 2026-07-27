import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': '/../react-ui-system/src/lib',
      '@hooks': '/../react-ui-system/src/hooks'
    }
  }
});
