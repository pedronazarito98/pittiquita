import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { pittiquita } from 'pittiquita/vite'

export default defineConfig({
  plugins: [react(), pittiquita()],
})
