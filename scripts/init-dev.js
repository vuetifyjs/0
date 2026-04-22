import { copyFileSync, existsSync } from 'node:fs'

const dest = 'dev/src/Playground.vue'
const template = 'dev/src/Playground.template.vue'

if (!existsSync(dest)) {
  copyFileSync(template, dest)
  console.log('[init-dev] Created Playground.vue from template')
}
