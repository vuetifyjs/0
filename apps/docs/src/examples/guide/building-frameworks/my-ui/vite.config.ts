import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyUI',
      formats: ['es', 'cjs'],
      fileName: format => `my-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@vuetify/v0'],
      output: {
        globals: {
          'vue': 'Vue',
          '@vuetify/v0': 'Vuetify0',
        },
      },
    },
  },
})
