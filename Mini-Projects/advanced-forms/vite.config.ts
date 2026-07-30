import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-internship-journey/advanced-forms/',
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': '/../react-ui-system/src/lib',
      '@hooks': '/../react-ui-system/src/hooks'
    }
  }
})
