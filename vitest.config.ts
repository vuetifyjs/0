import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*'],
    globals: true,
    include: ['**/*.{test,spec,bench}.?(c|m)[jt]s?(x)'],
  },
})
