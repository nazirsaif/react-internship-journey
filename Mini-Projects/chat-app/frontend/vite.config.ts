import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': path.resolve(__dirname, '../../react-ui-system/src/lib'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'class-variance-authority': path.resolve(__dirname, './node_modules/class-variance-authority'),
      'clsx': path.resolve(__dirname, './node_modules/clsx')
    }
  }
})
