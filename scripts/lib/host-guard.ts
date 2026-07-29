/**
 * Host readiness guard — refuse to bench on a machine that is busy doing
 * something else.
 *
 * Context: benchmarks are measured on a fixed workstation rather than a CI
 * runner, because `runs-on: ubuntu-24.04` pins the OS image and not the CPU —
 * see the header of `calibration.ts` for the +50.9% host-rotation evidence.
 * A fixed host removes that variance, but introduces one CI never had: the
 * machine is a real desktop that other people use. A bench run that overlaps a
 * game, a build, or a browser is not a slow measurement, it is a wrong one, and
 * nothing downstream can tell the difference afterwards.
 *
 * The signal is deliberately direct. "Is another user logged in" is the obvious
 * check and the wrong one — an idle desktop session is not contention, so that
 * rule is red permanently and gets switched off within a week. Sampling
 * aggregate non-idle CPU out of /proc/stat measures the thing we actually care
 * about, and logged-in users are reported only as context when it trips.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { loadavg } from 'node:os'

/** Fraction of total CPU time that may be busy before a run is refused. */
const BUSY_LIMIT = 0.05

/** Sampling window for the busy measurement. Long enough to survive a scheduler blip. */
const SAMPLE_MS = 1000

/** Governor that keeps clocks from drifting mid-suite. Anything else is a warning. */
const WANTED_GOVERNOR = 'performance'

export interface HostReport {
  /** Fraction of CPU time busy across the sample window, or null if unreadable. */
  busy: number | null
  /** Distinct scaling governors seen across all CPUs, or null where cpufreq is absent. */
  governor: string | null
  /** 1-minute load average. */
  load: number
  /** Interactive logins other than the current user, for context on a trip. */
  others: string[]
  /** Conditions that make the measurement untrustworthy. */
  blocks: string[]
  /** Conditions that degrade it without invalidating it. */
  warns: string[]
}

interface Cpu {
  busy: number
  total: number
}

/**
 * Aggregate CPU counters from the summary line of /proc/stat.
 *
 * Fields are: user nice system idle iowait irq softirq steal guest guest_nice.
 * Idle and iowait are the not-busy pair; everything else counts as busy.
 */
function readCpu (): Cpu | null {
  try {
    const line = readFileSync('/proc/stat', 'utf8').split('\n')[0]
    if (!line?.startsWith('cpu ')) return null
    const parts = line.slice(4).trim().split(/\s+/).map(Number)
    if (parts.some(Number.isNaN)) return null
    const total = parts.reduce((sum, v) => sum + v, 0)
    const idle = (parts[3] ?? 0) + (parts[4] ?? 0)
    return { busy: total - idle, total }
  } catch {
    return null
  }
}

/** Busy fraction across a sample window. Null when /proc/stat is unavailable. */
export function sampleBusy (ms: number = SAMPLE_MS): number | null {
  const first = readCpu()
  if (!first) return null
  // A blocking sleep is correct here: the point is to observe wall-clock time
  // passing on a machine we are about to measure, and the caller has nothing
  // useful to do meanwhile.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
  const second = readCpu()
  if (!second) return null
  const total = second.total - first.total
  if (total <= 0) return null
  return (second.busy - first.busy) / total
}

/**
 * The scaling governor in force, or null where cpufreq is absent (common in
 * VMs and containers). Reports `mixed` when CPUs disagree, which is itself a
 * reason not to trust the numbers.
 */
export function readGovernor (): string | null {
  const base = '/sys/devices/system/cpu'
  try {
    if (!existsSync(base)) return null
    const seen = new Set<string>()
    for (const entry of readdirSync(base)) {
      if (!/^cpu\d+$/.test(entry)) continue
      const path = `${base}/${entry}/cpufreq/scaling_governor`
      if (!existsSync(path)) continue
      seen.add(readFileSync(path, 'utf8').trim())
    }
    if (seen.size === 0) return null
    if (seen.size > 1) return `mixed(${[...seen].toSorted().join(',')})`
    return [...seen][0]!
  } catch {
    return null
  }
}

/** Interactive logins other than the current user. Best-effort; empty when `who` is absent. */
export function otherUsers (): string[] {
  try {
    const self = process.env.USER ?? process.env.LOGNAME ?? ''
    const out = execFileSync('who', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    const names = out
      .split('\n')
      .map(line => line.trim().split(/\s+/)[0])
      .filter((name): name is string => Boolean(name) && name !== self)
    return [...new Set(names)].toSorted()
  } catch {
    return []
  }
}

/**
 * Inspect the host and classify what is wrong with it.
 *
 * Blocking and warning are split on whether the condition corrupts the
 * measurement or merely degrades it. Competing load corrupts: the numbers are
 * wrong and silently so. A non-performance governor degrades: clocks drift
 * during the suite, which widens dispersion without inventing a fake result —
 * and on a machine where the governor cannot be set without root, promoting
 * that to a block would make the guard unusable by the account that runs it.
 */
export function checkHost (limit: number = BUSY_LIMIT): HostReport {
  const busy = sampleBusy()
  const governor = readGovernor()
  const load = loadavg()[0] ?? 0
  const others = otherUsers()
  const blocks: string[] = []
  const warns: string[] = []

  if (busy === null) {
    warns.push('could not read /proc/stat — host contention was not verified')
  } else if (busy > limit) {
    const pct = (busy * 100).toFixed(1)
    const cap = (limit * 100).toFixed(1)
    const who = others.length > 0 ? ` (other logins: ${others.join(', ')})` : ''
    blocks.push(`CPU is ${pct}% busy, above the ${cap}% limit${who}`)
  }

  if (governor === null) {
    warns.push('no cpufreq governor exposed — clock stability was not verified')
  } else if (governor !== WANTED_GOVERNOR) {
    warns.push(`scaling governor is "${governor}", not "${WANTED_GOVERNOR}" — clocks may drift mid-suite`)
  }

  return { busy, governor, load, others, blocks, warns }
}

/**
 * Root-owned helper that sets the scaling governor, installed on the reference
 * host with a sudoers rule scoped to this one path. Absent everywhere else,
 * which is why every call site treats it as optional.
 */
const GOVERNOR_HELPER = '/usr/local/sbin/v0-governor'

/**
 * Set the scaling governor, returning whether it took.
 *
 * Fail-soft on purpose: a machine that cannot set its governor is a machine
 * that benches slightly noisier, not one that should refuse to bench. The
 * measured difference on the reference host is small — interleaved A/B over
 * four pairs put median per-anchor CV at 1.79% on `performance` against 1.98%
 * on `powersave`, with a median speed delta of +0.06%. Worth removing as a
 * variable since the mechanism is already there; not worth failing a run over.
 */
export function setGovernor (value: 'performance' | 'powersave'): boolean {
  if (!existsSync(GOVERNOR_HELPER)) return false
  try {
    execFileSync('sudo', ['-n', GOVERNOR_HELPER, value], { stdio: 'ignore' })
    return readGovernor() === value
  } catch {
    return false
  }
}

/** One-line summary for the run log. */
export function formatHost (report: HostReport): string {
  const busy = report.busy === null ? 'unknown' : `${(report.busy * 100).toFixed(1)}%`
  return `busy=${busy} load=${report.load.toFixed(2)} governor=${report.governor ?? 'n/a'}`
}
