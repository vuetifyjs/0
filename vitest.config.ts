import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
    globals: true,
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
