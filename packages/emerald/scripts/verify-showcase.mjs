/**
 * Structural verification of Emerald showcase surface.
 * Drives real source files (barrel, kitchen sink, main routes, inventory).
 * Run: node packages/emerald/scripts/verify-showcase.mjs
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const emerald = join(root, 'packages/emerald')
const componentsDir = join(emerald, 'src/components')
const barrelPath = join(componentsDir, 'index.ts')
const sinkPath = join(root, 'dev/src/EmeraldKitchenSink.vue')
const mainPath = join(root, 'dev/src/main.ts')
const invPath = join(emerald, 'FIGMA_INVENTORY.md')

const errors = []

function read (p) {
  if (!existsSync(p)) {
    errors.push(`missing file: ${p}`)
    return ''
  }
  return readFileSync(p, 'utf8')
}

const barrel = read(barrelPath)
const sink = read(sinkPath)
const main = read(mainPath)
const inv = read(invPath)

const families = existsSync(componentsDir)
  ? readdirSync(componentsDir, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name.startsWith('Em'))
      .map(d => d.name)
      .toSorted()
  : []

// Zero families means the dir moved or the Em* prefix changed — every per-family
// loop below would silently no-op and report PASS.
if (families.length === 0) {
  console.error('FAIL')
  console.error(' - no Em* component families discovered under', componentsDir)
  throw new Error('verify-showcase failed: zero component families discovered')
}

for (const name of families) {
  if (!barrel.includes(`./${name}`)) {
    errors.push(`barrel missing export for ${name}`)
  }
  if (!sink.includes(name)) {
    errors.push(`kitchen sink does not reference ${name}`)
  }
}

const requiredRoutes = [
  '/emerald',
  '/emerald/sink',
  '/emerald/contact',
  '/emerald/settings',
  '/emerald/pricing',
  '/emerald/features',
  '/emerald/sign-in',
  '/emerald/faqs',
  '/emerald/modals',
  '/emerald/about',
]

for (const route of requiredRoutes) {
  if (!main.includes(`path: '${route}'`) && !main.includes(`path: "${route}"`)) {
    errors.push(`main.ts missing route ${route}`)
  }
}

const doneScreens = [
  'Dashboard',
  'Contact',
  'Sign in',
  'FAQs',
  'Features',
  'Settings',
  'Pricing',
  'Modals',
  'About',
]

/** Table row whose Name cell is exactly `name`, so status words can't match elsewhere. */
function row (name) {
  return inv.split('\n').find(l =>
    l.includes('|') && l.split('|').some(cell => cell.trim() === name),
  )
}

for (const name of doneScreens) {
  const line = row(name)
  if (!line || !line.includes('done')) {
    errors.push(`FIGMA_INVENTORY missing done row for ${name}`)
  }
}

for (const name of ['Tables', 'Chat']) {
  const line = row(name)
  if (!line || !line.toLowerCase().includes('deferred')) {
    errors.push(`FIGMA_INVENTORY must explicitly defer ${name}`)
  }
}

for (const name of families) {
  const dir = join(componentsDir, name)
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.vue')) continue
    const src = readFileSync(join(dir, file), 'utf8')
    if (src.includes('@vuetify/paper') || src.includes('V0Paper')) {
      errors.push(`${name}/${file}: Paper/V0Paper forbidden`)
    }
    if (/<style\s+scoped/.test(src)) {
      errors.push(`${name}/${file}: scoped style forbidden`)
    }
  }
}

console.log(`families=${families.length} routes=${requiredRoutes.length}`)
if (errors.length > 0) {
  console.error('FAIL')
  for (const e of errors) console.error(' -', e)
  throw new Error(`verify-showcase failed with ${errors.length} issue(s)`)
}
console.log('PASS')
