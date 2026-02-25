import { copyFileSync, existsSync } from 'node:fs'

const dest = 'playground/src/Playground.vue'
const template = 'playground/src/Playground.template.vue'

if (!existsSync(dest)) {
  copyFileSync(template, dest)
  console.log('[init-playground] Created Playground.vue from template')
}
