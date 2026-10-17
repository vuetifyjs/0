/// <reference types="node" />
/**
 * Structural locks for conventions that were previously only written down.
 * See johnleider/ops#74. Allowlists are explicit so a new gap fails;
 * do not add to them to get a PR green.
 */
import { execFileSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

import * as ts from 'typescript'
import { describe, expect, it } from 'vitest'

function findRepo (start: string): string {
  let dir = start
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir
    dir = path.dirname(dir)
  }
  throw new Error('repo root not found')
}

const REPO = findRepo(fileURLToPath(import.meta.url))
const SRC = path.join(REPO, 'packages/0/src')

function missingChangeset (files: { status: string, filename: string }[]): string {
  const code = `
    import { missingChangeset } from './scripts/changeset-required.js'
    const message = missingChangeset(${JSON.stringify(files)})
    process.stdout.write(message ?? '')
  `
  return execFileSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: REPO,
    encoding: 'utf8',
  })
}

const LEVELS = new Set(['draft', 'preview', 'stable', 'mature', 'deprecated'])

const CATEGORIES = {
  components: new Set(['primitives', 'providers', 'actions', 'forms', 'disclosure', 'data', 'semantic']),
  composables: new Set(['foundation', 'registration', 'selection', 'forms', 'data', 'plugins', 'system', 'reactivity', 'transformers', 'semantic']),
}

// PHILOSOPHY §6.10. A new collection factory must be added here and must not grow an items option.
const COLLECTION_FACTORIES = [
  'createRegistry',
  'createModel',
  'createSelection',
  'createSingle',
  'createGroup',
  'createStep',
  'createNested',
  'createSortable',
  'createKanban',
  'createQueue',
  'createTimeline',
  'createTokens',
  'createDataTable',
]

// TODO(ops#74): these families have index.test.ts and no index.browser.test.ts.
// Do not add a name. New components need a browser test.
const BROWSER_TEST_ALLOWLIST = [
  'Carousel',
  'Image',
  'Locale',
  'NumberField',
  'Overflow',
  'Progress',
  'Rating',
  'Tooltip',
]

// Existing it() / it.each() titles that do not start with "should".
// New titles must. Delete a line when that title is renamed; do not add one.
const SHOULD_TITLE_ALLOWLIST = new Set([
  'packages/0/src/components/AlertDialog/index.browser.test.ts\treactively honors a blocking alert dialog when its scrim is clicked',
  'packages/0/src/components/AlertDialog/index.browser.test.ts\tregisters the alert-dialog element as the stack top element while open',
  'packages/0/src/components/Atom/index.hydration.test.ts\tcontrol: detects a deliberate server/client mismatch',
  'packages/0/src/components/Atom/index.hydration.test.ts\thydrates a stable Atom with zero mismatch warnings',
  'packages/0/src/components/Dialog/index.browser.test.ts\treactively honors a blocking dialog when its scrim is clicked',
  'packages/0/src/components/Dialog/index.browser.test.ts\tregisters the dialog element as the stack top element while open',
  'packages/0/src/components/Dialog/index.hydration.test.ts\thydrates a closed Dialog without mismatch warnings',
  'packages/0/src/components/Portal/index.browser.test.ts\tfalls back to body when no modal is open',
  'packages/0/src/components/Portal/index.browser.test.ts\tteleports into the topmost modal element when one is open',
  'packages/0/src/components/Snackbar/index.browser.test.ts\tdefaults teleport to top-layer and renders into an open modal',
  'packages/0/src/components/Snackbar/index.browser.test.ts\thonors an explicit body target',
  'packages/0/src/components/Snackbar/index.browser.test.ts\tstill renders inline with teleport=false',
  'packages/0/src/components/Tabs/index.hydration.test.ts\thydrates with stable useId-derived ARIA IDs and zero mismatch warnings',
  'packages/0/src/components/Tabs/index.hydration.test.ts\trenders the correct initial selection state',
  'packages/0/src/composables/plugins.meta.test.ts\t%s has an index.ssr.test.ts file',
  'packages/0/src/composables/plugins.meta.test.ts\tdiscovers at least one plugin composable',
  'packages/0/src/composables/useBreakpoints/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useBreakpoints/index.ssr.test.ts\tfalls back to xs breakpoint with zero dimensions',
  'packages/0/src/composables/useBreakpoints/index.ssr.test.ts\tonly xs is true in fallback; larger breakpoints are false',
  'packages/0/src/composables/useBreakpoints/index.ssr.test.ts\tsets isMobile to true in SSR fallback',
  'packages/0/src/composables/useBreakpoints/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useFeatures/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useFeatures/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useFeatures/index.ssr.test.ts\tvariation returns null by default when no fallback argument given',
  'packages/0/src/composables/useFeatures/index.ssr.test.ts\tvariation returns the provided fallback when no plugin is installed',
  'packages/0/src/composables/useHotkey/index.test.ts\thandles symbol alias %s',
  'packages/0/src/composables/useHotkey/index.test.ts\twarns on invalid slash structure: %s',
  'packages/0/src/composables/useHydration/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useHydration/index.ssr.test.ts\tfallback reports isHydrated as true (safe-passthrough in SSR)',
  'packages/0/src/composables/useHydration/index.ssr.test.ts\tfallback reports isSettled as true',
  'packages/0/src/composables/useHydration/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useLocale/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useLocale/index.ssr.test.ts\tt() returns the key when no locale plugin is installed',
  'packages/0/src/composables/useLocale/index.ssr.test.ts\tti() returns undefined when no locale plugin is installed',
  'packages/0/src/composables/useLocale/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useLogger/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useLogger/index.ssr.test.ts\terror() writes to console.error in SSR',
  'packages/0/src/composables/useLogger/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useLogger/index.ssr.test.ts\twarn() writes to console.warn in SSR',
  'packages/0/src/composables/useNotifications/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useNotifications/index.ssr.test.ts\tsend() returns a stub notification without crashing',
  'packages/0/src/composables/useNotifications/index.ssr.test.ts\tsize is 0 in SSR fallback',
  'packages/0/src/composables/useNotifications/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/usePermissions/index.ssr.test.ts\tcan() returns false for all actions when no plugin is installed',
  'packages/0/src/composables/usePermissions/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/usePermissions/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useRtl/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useRtl/index.ssr.test.ts\tisRtl defaults to false in SSR fallback',
  'packages/0/src/composables/useRtl/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useRules/index.ssr.test.ts\taliases are empty when no plugin is installed',
  'packages/0/src/composables/useRules/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useRules/index.ssr.test.ts\tresolve() returns an array containing the raw function when no alias is registered',
  'packages/0/src/composables/useRules/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useStack/index.test.ts\taccepts a getter for el',
  'packages/0/src/composables/useStack/index.test.ts\tignores non-modal (scrim:false) tickets',
  'packages/0/src/composables/useStack/index.test.ts\tis null when no overlay is selected',
  'packages/0/src/composables/useStack/index.test.ts\tresolves to the topmost selected modal element',
  'packages/0/src/composables/useStack/index.test.ts\tskips selected modal tickets that have no resolvable element',
  'packages/0/src/composables/useStack/index.test.ts\tupdates as modals select and unselect',
  'packages/0/src/composables/useStorage/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useStorage/index.ssr.test.ts\tset/get round-trips through the memory adapter',
  'packages/0/src/composables/useStorage/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances (no cross-request contamination)',
  'packages/0/src/composables/useStorage/index.ssr.test.ts\tuses an in-memory adapter in SSR (does not access window.localStorage)',
  'packages/0/src/composables/useTheme/index.ssr.test.ts\tcolors returns an empty object in SSR fallback',
  'packages/0/src/composables/useTheme/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useTheme/index.ssr.test.ts\tisDark defaults to false in SSR fallback',
  'packages/0/src/composables/useTheme/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
  'packages/0/src/composables/useTooltip/index.ssr.test.ts\tdoes not throw when called without a provider',
  'packages/0/src/composables/useTooltip/index.ssr.test.ts\tisAnyOpen is false with no registered tooltips',
  'packages/0/src/composables/useTooltip/index.ssr.test.ts\topenDelay defaults to 700ms in SSR fallback',
  'packages/0/src/composables/useTooltip/index.ssr.test.ts\ttwo calls without a provider return distinct fallback instances',
])

const VISUAL_STYLE = /(?<![\w-])(?:color|background(?:-color)?|padding|margin)\s*:|(?<![\w-])font-/

function walk (dir: string, predicate: (file: string) => boolean, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file, predicate, out)
    else if (predicate(file)) out.push(file)
  }

  return out
}

function read (file: string): string {
  return fs.readFileSync(file, 'utf8')
}

function repoPath (file: string): string {
  return path.relative(REPO, file)
}

function kebab (name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function stripComments (source: string): string {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function scriptsOf (source: string, file: string): string[] {
  if (!file.endsWith('.vue')) return [source]

  return [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1] ?? '')
}

function maturity (): {
  components: Record<string, { level: string, category: string, since?: string | null, description?: string }>
  composables: Record<string, { level: string, category: string, since?: string | null, description?: string }>
} {
  return JSON.parse(read(path.join(SRC, 'maturity.json')))
}

describe('written conventions', () => {
  it('should keep the root README identical to the package README', () => {
    expect(read(path.join(REPO, 'README.md'))).toBe(read(path.join(REPO, 'packages/0/README.md')))
  })

  it('should give every composable directory a colocated index.test.ts', () => {
    const missing = fs.readdirSync(path.join(SRC, 'composables'), { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => fs.existsSync(path.join(SRC, 'composables', name, 'index.ts')))
      .filter(name => !fs.existsSync(path.join(SRC, 'composables', name, 'index.test.ts')))

    expect(missing).toEqual([])
  })

  it('should give every component a browser test, except the allowlisted families', () => {
    const components = fs.readdirSync(path.join(SRC, 'components'), { withFileTypes: true })
      .filter(entry => entry.isDirectory() && entry.name !== 'fixtures')
      .map(entry => entry.name)

    const missing = components.filter(name => {
      const hasBrowser = fs.existsSync(path.join(SRC, 'components', name, 'index.browser.test.ts'))
      if (hasBrowser) return false
      return !BROWSER_TEST_ALLOWLIST.includes(name)
    })

    const allowlistedWithoutUnit = BROWSER_TEST_ALLOWLIST.filter(name =>
      !fs.existsSync(path.join(SRC, 'components', name, 'index.test.ts')),
    )

    const allowlistedThatNowHaveBrowser = BROWSER_TEST_ALLOWLIST.filter(name =>
      fs.existsSync(path.join(SRC, 'components', name, 'index.browser.test.ts')),
    )

    expect(missing).toEqual([])
    expect(allowlistedWithoutUnit).toEqual([])
    expect(allowlistedThatNowHaveBrowser).toEqual([])
  })

  it('should match maturity.json entries to the documented schema', () => {
    const data = maturity()
    const problems: string[] = []

    for (const kind of ['components', 'composables'] as const) {
      for (const [name, entry] of Object.entries(data[kind])) {
        if (!LEVELS.has(entry.level)) problems.push(`${kind}.${name} level ${entry.level}`)
        if (!CATEGORIES[kind].has(entry.category)) problems.push(`${kind}.${name} category ${entry.category}`)
        if (entry.level === 'draft') continue
        if (!('since' in entry)) problems.push(`${kind}.${name} missing since`)
        if (!entry.description) problems.push(`${kind}.${name} missing description`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should give every shipped feature a docs page and an example', () => {
    const data = maturity()
    const problems: string[] = []

    for (const kind of ['components', 'composables'] as const) {
      for (const [name, entry] of Object.entries(data[kind])) {
        if (entry.level === 'draft') continue
        const slug = kebab(name)
        const page = path.join(REPO, 'apps/docs/src/pages', kind, entry.category, `${slug}.md`)
        const exampleDir = path.join(REPO, 'apps/docs/src/examples', kind, slug)

        if (!fs.existsSync(page)) problems.push(`missing page ${repoPath(page)}`)

        const examples = walk(exampleDir, file => file.endsWith('.vue'))
        if (examples.length === 0) problems.push(`missing example vue under apps/docs/src/examples/${kind}/${slug}`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should list every shipped feature on its index page', () => {
    const data = maturity()
    const problems: string[] = []

    for (const kind of ['components', 'composables'] as const) {
      const index = read(path.join(REPO, 'apps/docs/src/pages', kind, 'index.md'))
      for (const [name, entry] of Object.entries(data[kind])) {
        if (entry.level === 'draft') continue
        const slug = kebab(name)
        if (!index.includes(`/${slug}`)) problems.push(`${kind} index missing /${slug}`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should require frontmatter on component and composable pages', () => {
    const pages = [
      ...walk(path.join(REPO, 'apps/docs/src/pages/components'), file => file.endsWith('.md')),
      ...walk(path.join(REPO, 'apps/docs/src/pages/composables'), file => file.endsWith('.md')),
    ]
    const problems: string[] = []

    for (const file of pages) {
      const text = read(file)
      const end = text.startsWith('---\n') ? text.indexOf('\n---', 4) : -1
      const frontmatter = end === -1 ? '' : text.slice(4, end)
      const where = repoPath(file)

      if (!frontmatter) problems.push(`${where} missing frontmatter`)
      if (!/^title:/m.test(frontmatter)) problems.push(`${where} missing title`)
      if (!/^meta:/m.test(frontmatter)) problems.push(`${where} missing meta`)
      if (!/^features:/m.test(frontmatter)) problems.push(`${where} missing features`)
      if (!/^related:/m.test(frontmatter)) problems.push(`${where} missing related`)
      if (!/level:\s*[123]\b/.test(frontmatter)) problems.push(`${where} missing features.level`)
    }

    expect(problems).toEqual([])
  })

  it('should keep backticks out of headings and link text', () => {
    const problems: string[] = []

    for (const file of walk(path.join(REPO, 'apps/docs/src/pages'), file => file.endsWith('.md'))) {
      let fenced = false
      const lines = read(file).split('\n')

      for (const [index, line] of lines.entries()) {
        if (/^(?:`{3,}|~{3,})/.test(line)) {
          fenced = !fenced
          continue
        }
        if (fenced) continue
        if (/^#{1,6}\s.*`/.test(line) || /\[`[^`]+`\]\(/.test(line)) {
          problems.push(`${repoPath(file)}:${index + 1}`)
        }
      }
    }

    expect(problems).toEqual([])
  })

  it('should name example files and folders in kebab or Pascal case', () => {
    const problems: string[] = []
    const root = path.join(REPO, 'apps/docs/src/examples')

    function visit (dir: string) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) problems.push(`dir ${repoPath(file)}`)
          visit(file)
          continue
        }
        if (entry.name === 'index.vue') problems.push(repoPath(file))
        if (!entry.name.endsWith('.vue')) continue
        const stem = entry.name.slice(0, -'.vue'.length)
        const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        const pascalCase = /^[A-Z][A-Za-z0-9]*$/
        if (!kebabCase.test(stem) && !pascalCase.test(stem)) problems.push(repoPath(file))
      }
    }

    visit(root)
    expect(problems).toEqual([])
  })

  it('should not use the ltr: variant in package, docs example, or dev source', () => {
    const roots = [
      path.join(REPO, 'packages'),
      path.join(REPO, 'apps/docs/src/examples'),
      path.join(REPO, 'dev'),
    ]
    const problems: string[] = []

    for (const root of roots) {
      for (const file of walk(root, candidate => !candidate.endsWith('.test.ts') && !candidate.endsWith('.md'))) {
        if (read(file).includes('ltr:')) problems.push(repoPath(file))
      }
    }

    expect(problems).toEqual([])
  })

  it('should document public composables with module, see, remarks, and example', () => {
    const barrel = read(path.join(SRC, 'composables/index.ts'))
    const names = [...barrel.matchAll(/export \* from '\.\/([^']+)'/g)].map(match => match[1] ?? '')
    const problems: string[] = []

    for (const name of names) {
      const text = read(path.join(SRC, 'composables', name, 'index.ts'))
      const header = text.match(/^\/\*\*[\s\S]*?\*\//)?.[0] ?? ''
      for (const tag of ['@module', '@see', '@remarks', '@example']) {
        if (!header.includes(tag)) problems.push(`${name} missing ${tag}`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should name every component with defineOptions matching its file', () => {
    const problems: string[] = []
    const files = walk(path.join(SRC, 'components'), file => file.endsWith('.vue') && !file.includes(`${path.sep}fixtures${path.sep}`))

    for (const file of files) {
      const stem = path.basename(file, '.vue')
      const names = [...read(file).matchAll(/defineOptions\(\s*\{[\s\S]*?name:\s*['"]([^'"]+)['"]/g)].map(match => match[1])
      if (names.length === 0) problems.push(`${repoPath(file)} missing defineOptions name`)
      for (const name of names) {
        if (name !== stem) problems.push(`${repoPath(file)} name ${name}`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should order script attributes setup-before-lang, lang-before-setup when generic', () => {
    const problems: string[] = []
    const files = walk(path.join(SRC, 'components'), file => file.endsWith('.vue') && !file.includes(`${path.sep}fixtures${path.sep}`))

    for (const file of files) {
      for (const tag of read(file).match(/<script\b[^>]*>/g) ?? []) {
        const hasSetup = /\bsetup\b/.test(tag)
        const hasLang = /\blang=/.test(tag)
        if (!hasSetup || !hasLang) continue
        const setupAt = tag.search(/\bsetup\b/)
        const langAt = tag.search(/\blang=/)
        const generic = /\bgeneric=/.test(tag)
        const wrong = generic ? langAt > setupAt : langAt < setupAt
        if (wrong) problems.push(`${repoPath(file)} ${tag}`)
      }
    }

    expect(problems).toEqual([])
  })

  it('should keep utility classes and visual css out of component source', () => {
    const problems: string[] = []
    const files = walk(path.join(SRC, 'components'), file => file.endsWith('.vue') && !file.includes(`${path.sep}fixtures${path.sep}`))

    for (const file of files) {
      const source = stripComments(read(file)).replace(/const visuallyHiddenStyle = \{[\s\S]*?\} as const/g, '')
      if (/\bclass\s*=/.test(source) || VISUAL_STYLE.test(source)) problems.push(repoPath(file))
    }

    for (const file of walk(path.join(SRC, 'composables/useTheme/adapters'), file => file.endsWith('.ts') && !file.endsWith('.test.ts'))) {
      if (VISUAL_STYLE.test(stripComments(read(file)))) problems.push(repoPath(file))
    }

    expect(problems).toEqual([])
  })

  it('should mark exported utilities no-side-effects and pure allocations', () => {
    const problems: string[] = []
    const files = walk(path.join(SRC, 'utilities'), file => file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.bench.ts') && !file.endsWith('index.ts'))

    for (const file of files) {
      const text = read(file)
      const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

      for (let index = 0; index < source.statements.length; index++) {
        const node = source.statements[index]
        if (!node) continue

        if (ts.isFunctionDeclaration(node) && node.name && node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
          const previous = index === 0 ? 0 : (source.statements[index - 1]?.end ?? 0)
          const between = text.slice(previous, node.getStart(source))
          if (!between.includes('#__NO_SIDE_EFFECTS__')) problems.push(`${repoPath(file)} ${node.name.text}`)
        }

        if (!ts.isVariableStatement(node)) continue
        if (!node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue

        for (const declaration of node.declarationList.declarations) {
          const initializer = declaration.initializer
          if (!initializer || !ts.isNewExpression(initializer)) continue
          const ctor = initializer.expression.getText(source)
          if (ctor !== 'Set' && ctor !== 'Map') continue
          const leading = text.slice(initializer.getFullStart(), initializer.getStart(source))
          if (!leading.includes('@__PURE__')) {
            const name = declaration.name.getText(source)
            problems.push(`${repoPath(file)} ${name} missing @__PURE__`)
          }
        }
      }
    }

    expect(problems).toEqual([])
  })

  it('should put a colon in static context namespace strings', () => {
    const problems: string[] = []
    // createContext/index.test.ts deliberately passes keys with no colon to assert the warning.
    const namespaceAllowlist = new Set([
      'packages/0/src/composables/createContext/index.test.ts',
    ])
    const files = walk(SRC, file => /\.(?:ts|vue)$/.test(file) && !file.endsWith('.bench.ts') && !file.includes(`${path.sep}fixtures${path.sep}`))

    for (const file of files) {
      if (namespaceAllowlist.has(repoPath(file))) continue
      for (const script of scriptsOf(read(file), file)) {
        const source = ts.createSourceFile(file, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

        function visit (node: ts.Node) {
          if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text.endsWith('Context')) {
            const [first] = node.arguments
            if (first && ts.isStringLiteral(first) && !first.text.includes(':')) {
              problems.push(`${repoPath(file)} ${node.expression.text}('${first.text}')`)
            }
            if (first && ts.isObjectLiteralExpression(first)) {
              for (const property of first.properties) {
                if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name) || property.name.text !== 'namespace') continue
                if (ts.isStringLiteral(property.initializer) && !property.initializer.text.includes(':')) {
                  problems.push(`${repoPath(file)} namespace '${property.initializer.text}'`)
                }
              }
            }
          }
          ts.forEachChild(node, visit)
        }

        visit(source)
      }
    }

    expect(problems).toEqual([])
  })

  it('should escape dynamic querySelector templates', () => {
    const problems: string[] = []
    const files = walk(SRC, file => /\.(?:ts|vue)$/.test(file) && !file.includes('.test.') && !file.endsWith('.bench.ts'))

    for (const file of files) {
      for (const script of scriptsOf(read(file), file)) {
        const source = ts.createSourceFile(file, script, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

        function visit (node: ts.Node) {
          if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
            const name = node.expression.name.text
            const [argument] = node.arguments
            if ((name === 'querySelector' || name === 'querySelectorAll') && argument && ts.isTemplateExpression(argument) && !argument.getText(source).includes('CSS.escape')) {
              problems.push(repoPath(file))
            }
            if ((name === 'querySelector' || name === 'querySelectorAll') && argument && ts.isNoSubstitutionTemplateLiteral(argument) && argument.text.includes('${')) {
              problems.push(repoPath(file))
            }
          }
          ts.forEachChild(node, visit)
        }

        visit(source)
      }
    }

    expect(problems).toEqual([])
  })

  it('should not give collection factories an items option', () => {
    const problems: string[] = []

    for (const name of COLLECTION_FACTORIES) {
      const file = path.join(SRC, 'composables', name, 'index.ts')
      const text = read(file)
      const bodies = [...text.matchAll(/export interface \w*Options\b[^{]*\{([\s\S]*?)\n\}/g)].map(match => match[1] ?? '')
      for (const body of bodies) {
        if (/^\s*items\??:/m.test(body)) problems.push(name)
      }
    }

    expect(problems).toEqual([])
  })

  it('should start test titles with should, except the allowlist', () => {
    const found = new Set<string>()
    const fresh: string[] = []

    for (const file of walk(path.join(REPO, 'packages/0'), file => file.endsWith('.test.ts'))) {
      const text = read(file)
      const relative = repoPath(file)
      const titles: string[] = []

      for (const match of text.matchAll(/\bit\(\s*(['"`])([\s\S]*?)\1/g)) {
        const title = (match[2] ?? '').replace(/\s+/g, ' ').trim()
        if (!title.includes('${')) titles.push(title)
      }
      for (const match of text.matchAll(/it\.each\([\s\S]*?\)\(\s*(['"`])([^'"`\n]*)\1/g)) {
        titles.push((match[2] ?? '').trim())
      }

      for (const title of titles) {
        if (title.startsWith('should ')) continue
        const key = `${relative}\t${title}`
        found.add(key)
        if (!SHOULD_TITLE_ALLOWLIST.has(key)) fresh.push(key)
      }
    }

    const stale = [...SHOULD_TITLE_ALLOWLIST].filter(key => !found.has(key))

    expect(fresh).toEqual([])
    expect(stale).toEqual([])
  })

  it('should require a changeset when package source changes', () => {
    expect(missingChangeset([
      { status: 'M', filename: 'packages/0/src/components/Atom/Atom.vue' },
    ])).toContain('changeset')

    expect(missingChangeset([
      { status: 'M', filename: 'packages/0/src/components/Atom/Atom.vue' },
      { status: 'A', filename: '.changeset/example.md' },
    ])).toBe('')

    expect(missingChangeset([
      { status: 'M', filename: 'apps/docs/src/pages/index.md' },
    ])).toBe('')

    expect(missingChangeset([
      { status: 'M', filename: 'packages/0/src/components/Atom/Atom.vue' },
      { status: 'A', filename: '.changeset/README.md' },
    ])).toContain('changeset')
  })
})
