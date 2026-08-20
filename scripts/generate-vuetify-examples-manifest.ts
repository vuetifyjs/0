#!/usr/bin/env node
/**
 * One-shot / occasional regen of the Vuetify 4 Open gallery path catalog.
 *
 * Usage (from repo root):
 *   node scripts/generate-vuetify-examples-manifest.ts [path-to-vuetify-examples]
 *
 * Default path: ~/sites/vuetify/packages/docs/src/examples
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'

const ROOT = resolve(
  process.argv[2]
  ?? join(homedir(), 'sites/vuetify/packages/docs/src/examples'),
)
const OUT = resolve(import.meta.dirname, '../apps/playground/src/data/vuetify-examples-manifest.json')

function walk (dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.vue')) out.push(p)
  }
  return out
}

function titleFromId (id) {
  return id
    .split('-')
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ')
}

/** Folder name → component display: `v-bottom-navigation` → `VBottomNavigation`. */
function componentTitle (name) {
  return name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

const files = walk(ROOT)
const byComponent = new Map()
let skipped = 0

for (const abs of files) {
  const rel = relative(ROOT, abs).replaceAll('\\', '/')
  const parts = rel.split('/')
  if (parts.length !== 2) {
    skipped++
    continue
  }
  const [component, file] = parts
  const id = file.replace(/\.vue$/, '')
  let code
  try {
    code = readFileSync(abs, 'utf8')
  } catch {
    skipped++
    continue
  }
  if (code.includes('ExamplesUsageExample') || code.includes('UsageExample')) {
    skipped++
    continue
  }

  if (!byComponent.has(component)) byComponent.set(component, [])
  byComponent.get(component).push({
    id,
    path: rel,
    title: titleFromId(id),
  })
}

const components = [...byComponent.entries()]
  .map(([name, examples]) => ({
    name,
    title: componentTitle(name),
    examples: examples.toSorted((a, b) => a.id.localeCompare(b.id)),
  }))
  .filter(c => c.examples.length > 0)
  .toSorted((a, b) => a.name.localeCompare(b.name))

const manifest = {
  version: 1,
  repo: 'vuetifyjs/vuetify',
  ref: 'master',
  basePath: 'packages/docs/src/examples',
  generatedAt: new Date().toISOString(),
  skipped,
  components,
}

writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`)
const exampleCount = components.reduce((n, c) => n + c.examples.length, 0)
console.log({
  root: ROOT,
  components: components.length,
  examples: exampleCount,
  skipped,
  out: OUT,
  kb: Math.round(statSync(OUT).size / 1024),
})
