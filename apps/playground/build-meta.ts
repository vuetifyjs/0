import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

/**
 * Identity of the v0play process, read once when Vite (or Vitest) loads.
 *
 * Commit prefers `GITHUB_SHA` so a CI build reports the workflow commit
 * even when the runner's checkout is shallow. Version numbers come from
 * the workspace packages the shell actually compiles, not the REPL pins.
 */
export interface PlayBuildMeta {
  version: string
  commit: string
  commitFull: string
  dirty: boolean
  built: string
  vue: string
  v0: string
  genesis: string
}

function readVersion (file: string): string {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as { version?: unknown }
    if (typeof parsed.version === 'string' && parsed.version) return parsed.version
  } catch {
    // Missing package.json — the row shows "unknown" rather than failing the build.
  }
  return 'unknown'
}

function git (args: string[], cwd: string): string {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return ''
  }
}

export function readPlayBuildMeta (configUrl: string): PlayBuildMeta {
  const root = fileURLToPath(new URL('../..', configUrl))
  const version = readVersion(fileURLToPath(new URL('package.json', configUrl)))
  const v0 = readVersion(fileURLToPath(new URL('../../packages/0/package.json', configUrl)))
  const genesis = readVersion(fileURLToPath(new URL('../../packages/genesis/package.json', configUrl)))

  let vue = 'unknown'
  try {
    const require = createRequire(configUrl)
    const pkg = require('vue/package.json') as { version?: unknown }
    if (typeof pkg.version === 'string' && pkg.version) vue = pkg.version
  } catch {
    vue = 'unknown'
  }

  const fromEnv = process.env.GITHUB_SHA ?? ''
  const full = /^[0-9a-f]{7,40}$/i.test(fromEnv) ? fromEnv : git(['rev-parse', 'HEAD'], root)
  const commitFull = full || 'unknown'
  const known = commitFull !== 'unknown'

  return {
    version,
    commit: known ? commitFull.slice(0, 7) : 'unknown',
    commitFull,
    dirty: known && git(['status', '--porcelain'], root).length > 0,
    built: new Date().toISOString(),
    vue,
    v0,
    genesis,
  }
}

/** Vite `define` replacements. Values are JS expressions, not quoted twice. */
export function playBuildDefines (meta: PlayBuildMeta): Record<string, string> {
  return {
    __PLAY_VERSION__: JSON.stringify(meta.version),
    __PLAY_COMMIT__: JSON.stringify(meta.commit),
    __PLAY_COMMIT_FULL__: JSON.stringify(meta.commitFull),
    __PLAY_DIRTY__: JSON.stringify(meta.dirty),
    __PLAY_BUILT__: JSON.stringify(meta.built),
    __PLAY_VUE__: JSON.stringify(meta.vue),
    __PLAY_V0__: JSON.stringify(meta.v0),
    __PLAY_GENESIS__: JSON.stringify(meta.genesis),
  }
}
