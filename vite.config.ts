import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined'
  },
  build: {
    lib: {
      entry: './lib/index.ts',
      name: 'laddie',
      fileName: 'laddie'
    }
  },
  // @ts-ignore
  test: {
    includeSource: ['lib/**/*.{ts,js}'],
    include: []
  },
  plugins: [dts()]
})
