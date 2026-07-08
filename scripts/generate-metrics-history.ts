/**
 * @fileoverview Generate per-version historical benchmark metrics.
 *
 * Fixed-apparatus approach: the CURRENT bench suite + CURRENT toolchain are run
 * against each version's code installed from npm. Only the library varies, so the
 * series is comparable across versions and survives future bench/toolchain changes.
 *
 * The version set is DISCOVERED from npm per the policy in
 * `metrics-history.config.ts` (major line + `since` floor + `exclude`), so new
 * 1.x releases are benched automatically without editing config. For each
 * discovered version:
 *   1. Skip if `apps/docs/src/data/metrics/<version>.json` exists (unless --force)
 *   2. `npm install @vuetify/v0@<version>` into an isolated temp dir
 *   3. Run the current benches with `V0_BENCH_TARGET=<install>/dist` so vitest
 *      resolves `@vuetify/v0` to that version's built dist (--outputJson to a temp file)
 *   4. Transform that JSON via the shared lib into the per-item shape
 *   5. Write `apps/docs/src/data/metrics/<version>.json`
 *   6. Remove the temp dir
 *
 * A benchmark importing a symbol absent in the installed version errors for that
 * version only → it is simply omitted (no point), which is honest. On total
 * failure, write an error stub so the slot is marked processed (use --force to retry).
 *
 * Flags:
 *   --force             Regenerate even if the output file exists
 *   --only <version>    Process only the given version (skips discovery)
 *   --list              Print discovered versions + snapshot status; do not run
 *   --print-missing     Print space-separated discovered versions lacking a
 *                       snapshot file, then exit. The CI gate uses this to decide
 *                       whether a publish introduced anything new to bench.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildItemBenchmarks, extractName, type ItemBenchmarks } from './lib/benchmarks.ts'
import { config } from './metrics-history.config.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUTPUT_DIR = resolve(ROOT, 'apps/docs/src/data/metrics')

interface HistoryFile {
  version: string
  generatedAt: string
  items?: Record<string, { benchmarks: ItemBenchmarks }>
  error?: string
}

interface Semver {
  major: number
  minor: number
  patch: number
  /** Prerelease identifiers, e.g. `['beta', 3]`; empty for a stable release. */
  pre: (string | number)[]
}

/** Parse `M.m.p` or `M.m.p-pre.n`. Throws on anything that isn't valid semver. */
function parseVersion (version: string): Semver {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/.exec(version)
  if (!match) throw new Error(`unparseable version: ${version}`)
  const [, major, minor, patch, pre] = match
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    pre: pre ? pre.split('.').map(id => (/^\d+$/.test(id) ? Number(id) : id)) : [],
  }
}

/**
 * Semver precedence (SemVer §11). Numeric release parts compare numerically; a
 * version WITH a prerelease sorts BELOW the same version without one; prerelease
 * identifiers compare field-by-field (numeric < numeric numerically, otherwise
 * ASCII, numeric identifiers always below non-numeric). Enough for the 1.x line's
 * `alpha < beta < rc < <stable>` cuts without pulling in the `semver` dependency.
 */
function compareVersion (a: string, b: string): number {
  const x = parseVersion(a)
  const y = parseVersion(b)
  if (x.major !== y.major) return x.major - y.major
  if (x.minor !== y.minor) return x.minor - y.minor
  if (x.patch !== y.patch) return x.patch - y.patch
  // A prerelease has lower precedence than the associated stable release.
  if (x.pre.length === 0 || y.pre.length === 0) {
    return (x.pre.length === 0 ? 1 : 0) - (y.pre.length === 0 ? 1 : 0)
  }
  for (let i = 0; i < Math.max(x.pre.length, y.pre.length); i++) {
    const l = x.pre[i]
    const r = y.pre[i]
    if (l === undefined) return -1 // shorter set of identifiers has lower precedence
    if (r === undefined) return 1
    if (l === r) continue
    const ln = typeof l === 'number'
    const rn = typeof r === 'number'
    if (ln && rn) return l - (r as number)
    if (ln !== rn) return ln ? -1 : 1 // numeric identifiers always rank below strings
    return String(l) < String(r) ? -1 : 1
  }
  return 0
}

/**
 * Discover the versions to bench from npm, applying the config policy: on the
 * configured `major` line, at or above the `since` floor, minus `exclude`, sorted
 * oldest → newest. Throws (rather than returning an empty set) if npm is
 * unreachable, so a network blip fails loud instead of silently regenerating none.
 */
function discoverVersions (): string[] {
  let raw: string
  try {
    raw = execFileSync('npm', ['view', '@vuetify/v0', 'versions', '--json'], { encoding: 'utf8' })
  } catch (error) {
    throw new Error(`npm view @vuetify/v0 versions failed: ${(error as Error).message}`, { cause: error })
  }
  const parsed: unknown = JSON.parse(raw)
  const all: string[] = Array.isArray(parsed) ? parsed : [parsed as string]
  return all
    .filter(v => parseVersion(v).major === config.major)
    .filter(v => compareVersion(v, config.since) >= 0)
    .filter(v => !config.exclude.includes(v))
    .toSorted(compareVersion)
}

function parseArgs (argv: string[]): { force: boolean, only: string | null, list: boolean, printMissing: boolean } {
  let force = false
  let list = false
  let printMissing = false
  let only: string | null = null
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    switch (arg) {
      case '--force': {
        force = true
        break
      }
      case '--list': {
        list = true
        break
      }
      case '--print-missing': {
        printMissing = true
        break
      }
      case '--only': {
        only = argv[++i] ?? null
        break
      }
    }
  }
  return { force, only, list, printMissing }
}

function outputPath (version: string): string {
  return resolve(OUTPUT_DIR, `${version}.json`)
}

function writeOutputFile (version: string, body: Partial<HistoryFile>): void {
  const file: HistoryFile = {
    version,
    generatedAt: new Date().toISOString(),
    ...body,
  }
  writeFileSync(outputPath(version), JSON.stringify(file, null, 2) + '\n')
}

/** Install @vuetify/v0@version into an isolated dir; return the path to its built dist. */
function installVersion (version: string, dir: string): string {
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'v0-metrics-tmp', private: true }) + '\n')
  console.log(`  $ npm install @vuetify/v0@${version}`)
  // @js-temporal/polyfill is an externalized dependency of the date adapter
  // (dist/date imports it from beta.2 on); install it so useDate benches resolve
  // against every version's dist. It is constant apparatus, not the lib under test.
  execFileSync('npm', ['install', `@vuetify/v0@${version}`, '@js-temporal/polyfill', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit' })
  const dist = join(dir, 'node_modules/@vuetify/v0/dist')
  if (!existsSync(join(dist, 'composables/index.mjs'))) {
    throw new Error(`installed @vuetify/v0@${version} has no dist/composables (got ${dist})`)
  }
  return dist
}

/** Run the current bench suite against `dist`; return the parsed benchmarks JSON. */
function benchAgainst (dist: string, jsonOut: string): { files?: { filepath: string }[] } {
  // Mirror `test:bench:json`, but target a temp output and a specific dist via the
  // V0_BENCH_TARGET alias (read in packages/0/vitest.config.ts). Vitest may exit
  // non-zero if a bench references a symbol absent in this version — that's fine;
  // we read whatever results were written.
  try {
    execFileSync('pnpm', ['exec', 'vitest', 'bench', '--run', '--outputJson', jsonOut], {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, V0_BENCH_TARGET: dist },
    })
  } catch {
    console.warn('  (vitest exited non-zero — likely a bench for an API absent in this version; using partial results)')
  }
  if (!existsSync(jsonOut)) {
    throw new Error('no benchmark JSON produced')
  }
  return JSON.parse(readFileSync(jsonOut, 'utf8'))
}

function processVersion (version: string, force: boolean): void {
  const outPath = outputPath(version)
  if (!force && existsSync(outPath)) {
    console.log(`[${version}] skipping — output exists (use --force to regenerate)`)
    return
  }

  console.log(`\n[${version}] starting`)
  const dir = mkdtempSync(join(tmpdir(), `v0-metrics-${version}-`))

  try {
    const dist = installVersion(version, dir)
    const raw = benchAgainst(dist, join(dir, 'benchmarks.json'))

    const items: Record<string, { benchmarks: ItemBenchmarks }> = {}
    for (const file of raw.files ?? []) {
      const name = extractName(file.filepath)
      if (!name) continue
      items[name] = { benchmarks: buildItemBenchmarks(file) }
    }

    writeOutputFile(version, { items })
    console.log(`[${version}] done — wrote ${Object.keys(items).length} items`)
  } catch (error) {
    const message = (error as Error).message
    console.error(`[${version}] FAILED: ${message}`)
    writeOutputFile(version, { error: message })
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function main (): void {
  const { force, only, list, printMissing } = parseArgs(process.argv.slice(2))

  // `--only` targets one explicit version and skips npm discovery entirely, so it
  // stays usable offline / for one-off re-measures.
  const discovered = only ? [only] : discoverVersions()

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })

  if (printMissing) {
    // Machine-readable gate output: only the versions with no snapshot yet, on
    // one line. The CI regen job skips the (expensive) bench run when empty.
    console.log(discovered.filter(v => !existsSync(outputPath(v))).join(' '))
    return
  }

  if (list) {
    console.log('Discovered versions:')
    for (const v of discovered) {
      const status = existsSync(outputPath(v)) ? 'exists' : 'missing'
      console.log(`  ${v}  [${status}]`)
    }
    return
  }

  for (const v of discovered) processVersion(v, force)
}

main()
