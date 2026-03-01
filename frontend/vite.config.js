import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/register": "http://localhost:5000",
      "/login": "http://localhost:5000",
      "/verify-token": "http://localhost:5000",
    },
  },
});