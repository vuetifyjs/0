import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

import base from './vitest.config'

// Spike config: compiles the REAL packages/0 Atom.vue in Vapor mode via
// plugin-vue's `features.vapor` (plugin-level force for SFCs without the
// per-file marker), while every other SFC keeps per-file behavior. Kept out
// of vitest.config.ts because interop.vapor.test.ts depends on Atom staying
// classic there. Run: pnpm exec vitest run -c vitest.spike.config.ts
const atomSfc = fileURLToPath(new URL('../../packages/0/src/components/Atom/Atom.vue', import.meta.url))

export default defineConfig({
  ...base,
  plugins: [
    vue({ exclude: [atomSfc] }),
    vue({ include: [atomSfc], features: { vapor: true } }),
  ],
  test: {
    ...base.test,
    include: ['spike/**/*.spike.test.ts'],
  },
})
