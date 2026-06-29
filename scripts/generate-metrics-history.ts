/**
 * @fileoverview Generate per-version historical benchmark metrics.
 *
 * For each version in `metrics-history.config.ts`:
 *   1. Skip if `apps/docs/src/data/metrics/<version>.json` exists (unless --force)
 *   2. Create a git worktree at `.claude/worktrees/metrics-v<version>` on tag `v<version>`
 *   3. `pnpm install --frozen-lockfile` inside the worktree
 *   4. `pnpm test:bench:json` to produce `apps/docs/public/benchmarks.json`
 *   5. Transform that JSON via the shared lib into the per-item shape
 *   6. Write `apps/docs/src/data/metrics/<version>.json` in the main repo
 *   7. Remove the worktree
 *
 * On any failure for a version, write an error stub so the slot is marked
 * processed (use --force to retry).
 *
 * Flags:
 *   --force             Regenerate even if the output file exists
 *   --only <version>    Process only the given version
 *   --list              Print what would be done; do not run
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildItemBenchmarks, extractName, type ItemBenchmarks } from './lib/benchmarks.ts'
import { versions } from './metrics-history.config.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUTPUT_DIR = resolve(ROOT, 'apps/docs/src/data/metrics')
const WORKTREE_BASE = resolve(ROOT, '.claude/worktrees')

interface HistoryFile {
  version: string
  generatedAt: string
  items?: Record<string, { benchmarks: ItemBenchmarks }>
  error?: string
}

function parseArgs (argv: string[]): { force: boolean, only: string | null, list: boolean } {
  let force = false
  let list = false
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
      case '--only': {
        only = argv[++i] ?? null
        break
      }
    }
  }
  return { force, only, list }
}

function outputPath (version: string): string {
  return resolve(OUTPUT_DIR, `${version}.json`)
}

function worktreePath (version: string): string {
  return resolve(WORKTREE_BASE, `metrics-v${version}`)
}

function exec (file: string, args: string[], cwd: string, description: string): void {
  console.log(`  $ ${file} ${args.join(' ')}`)
  try {
    execFileSync(file, args, { cwd, stdio: 'inherit' })
  } catch (error) {
    throw new Error(`${description} failed: ${(error as Error).message}`, { cause: error })
  }
}

function writeOutputFile (version: string, body: Partial<HistoryFile>): void {
  const file: HistoryFile = {
    version,
    generatedAt: new Date().toISOString(),
    ...body,
  }
  writeFileSync(outputPath(version), JSON.stringify(file, null, 2) + '\n')
}

function tagExists (version: string): boolean {
  try {
    execFileSync('git', ['rev-parse', '--verify', `v${version}`], { cwd: ROOT, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function removeWorktreeQuietly (wt: string): void {
  try {
    execFileSync('git', ['worktree', 'remove', '--force', wt], { cwd: ROOT, stdio: 'ignore' })
  } catch {
    if (existsSync(wt)) rmSync(wt, { recursive: true, force: true })
  }
}

function processVersion (version: string, force: boolean): void {
  const outPath = outputPath(version)
  if (!force && existsSync(outPath)) {
    console.log(`[${version}] skipping — output exists (use --force to regenerate)`)
    return
  }

  console.log(`\n[${version}] starting`)

  if (!tagExists(version)) {
    console.log(`[${version}] tag v${version} not found — writing error stub`)
    writeOutputFile(version, { error: `tag v${version} not found` })
    return
  }

  const wt = worktreePath(version)
  removeWorktreeQuietly(wt)

  try {
    exec('git', ['worktree', 'add', wt, `v${version}`], ROOT, 'git worktree add')
    exec('pnpm', ['install', '--frozen-lockfile'], wt, 'pnpm install')
    exec('pnpm', ['test:bench:json'], wt, 'pnpm test:bench:json')

    const benchPath = resolve(wt, 'apps/docs/public/benchmarks.json')
    if (!existsSync(benchPath)) {
      throw new Error(`benchmarks.json not produced at ${benchPath}`)
    }
    const raw = JSON.parse(readFileSync(benchPath, 'utf8'))

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
    removeWorktreeQuietly(wt)
  }
}

function main (): void {
  const { force, only, list } = parseArgs(process.argv.slice(2))

  const selected = only ? [only] : versions
  if (only && !versions.includes(only)) {
    console.warn(`--only ${only}: not in config, running anyway`)
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true })
  if (!existsSync(WORKTREE_BASE)) mkdirSync(WORKTREE_BASE, { recursive: true })

  if (list) {
    console.log('Versions in config:')
    for (const v of selected) {
      const status = existsSync(outputPath(v)) ? 'exists' : 'missing'
      console.log(`  ${v}  [${status}]`)
    }
    return
  }

  for (const v of selected) processVersion(v, force)
}

main()
