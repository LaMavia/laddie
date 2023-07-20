import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined'
  },
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'laddie',
      fileName: 'laddie'
    }
  },
  // @ts-ignore
  test: {
    includeSource: ['lib/**/*.{ts,js}'],
    include: []
  }
})
