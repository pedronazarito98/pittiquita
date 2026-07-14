import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/hooks.ts',
    next: 'src/next/plugin.ts',
    vite: 'src/vite/plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'next', 'next/navigation', 'vite'],
})
