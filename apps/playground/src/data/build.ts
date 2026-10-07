/**
 * Compile-time identity of this v0play build.
 *
 * The `__PLAY_*` constants are injected by `apps/playground/vite.config.ts`
 * so a production bundle reports the commit and clock it was built from,
 * not whatever the dev server happens to be running later.
 */

export interface PlayBuild {
  name: string
  version: string
  commit: string
  commitFull: string
  dirty: boolean
  built: string
  vue: string
  v0: string
  genesis: string
}

export interface BuildRow {
  label: string
  value: string
  /** Longer form used by Copy. The visible cell keeps `value`. */
  detail?: string
  href?: string
}

const REPO = 'https://github.com/vuetifyjs/0'

export const playBuild: PlayBuild = {
  name: 'Vuetify0 Play',
  version: __PLAY_VERSION__,
  commit: __PLAY_COMMIT__,
  commitFull: __PLAY_COMMIT_FULL__,
  dirty: __PLAY_DIRTY__,
  built: __PLAY_BUILT__,
  vue: __PLAY_VUE__,
  v0: __PLAY_V0__,
  genesis: __PLAY_GENESIS__,
}

function releaseHref (repo: string, version: string): string | undefined {
  if (!/^\d+\.\d+\.\d+/.test(version)) return undefined
  return `${repo}/releases/tag/v${version}`
}

/** `2026-10-06T18:04:12.345Z` → `2026-10-06 18:04 UTC`. */
export function formatBuilt (iso: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(iso)
  if (!match) return iso || 'unknown'
  return `${match[1]} ${match[2]} UTC`
}

/**
 * Short browser name for the About row. Full UA stays on `detail` for Copy.
 * Order matters: Edge and Chrome both advertise Safari.
 */
export function browserLabel (ua: string): string {
  const edge = /Edg\/(\d+)/.exec(ua)
  const firefox = /Firefox\/(\d+)/.exec(ua)
  const chrome = /Chrome\/(\d+)/.exec(ua)
  const safari = /Version\/(\d+)(?:\.\d+)* Safari/.exec(ua)

  let name = ''
  if (edge) name = `Edge ${edge[1]}`
  else if (firefox) name = `Firefox ${firefox[1]}`
  else if (chrome) name = `Chrome ${chrome[1]}`
  else if (safari) name = `Safari ${safari[1]}`

  let os = ''
  if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/iPhone|iPad/.test(ua)) os = 'iOS'
  else if (/Linux/.test(ua)) os = 'Linux'

  if (name && os) return `${name} · ${os}`
  if (name) return name
  if (os) return os
  return ua
}

export function buildRows (build: PlayBuild = playBuild, mode = import.meta.env.MODE): BuildRow[] {
  const commitKnown = /^[0-9a-f]{7,40}$/i.test(build.commitFull)

  return [
    { label: 'Version', value: build.version },
    {
      label: 'Commit',
      value: build.dirty ? `${build.commit} (dirty)` : build.commit,
      href: commitKnown ? `${REPO}/commit/${build.commitFull}` : undefined,
    },
    { label: 'Built', value: formatBuilt(build.built) },
    { label: 'Mode', value: mode },
    {
      label: 'Vue',
      value: build.vue,
      href: releaseHref('https://github.com/vuejs/core', build.vue),
    },
    {
      label: '@vuetify/v0',
      value: build.v0,
      href: releaseHref(REPO, build.v0),
    },
    { label: '@paper/genesis', value: build.genesis },
  ]
}

/** Plain-text dump for pasting into a bug report. */
export function buildReport (rows: BuildRow[], name = playBuild.name): string {
  const lines = [name]
  for (const row of rows) {
    lines.push(`${row.label}: ${row.detail ?? row.value}`)
  }
  return lines.join('\n')
}
