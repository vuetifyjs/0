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
 * non-idle CPU out of /proc/stat measures the thing we actually care about, and
 * logged-in users are reported only as context when it trips.
 *
 * Both a total and a per-CPU peak are sampled, because the aggregate alone has
 * a blind spot exactly where the risk is highest: one saturated core on a
 * 36-thread host is 2.8% of total CPU, under any sane whole-machine threshold,
 * yet a single competing CPU-bound process is the likeliest real contention
 * there is. Measured on the reference host, one busy thread read 2.8% aggregate
 * and sailed through a 5% total-only limit.
 */

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { loadavg } from 'node:os'

/** Fraction of *whole-machine* CPU time that may be busy before a run is refused. */
const BUSY_LIMIT = 0.05

/**
 * Fraction of a *single* logical CPU that may be busy before a run is refused.
 *
 * Set from the idle floor rather than from taste. Measured on the reference
 * host over six consecutive samples, an idle box peaks at 0–1% on its busiest
 * core, while one competing CPU-bound thread pins a core at 100%. The gap is
 * two orders of magnitude, so the threshold only has to land inside it; 0.35 is
 * far enough above the noise that a daemon blip cannot trip it and far enough
 * below a real workload to catch one long before it saturates.
 */
const CORE_LIMIT = 0.35

/** Sampling window for the busy measurement. Long enough to survive a scheduler blip. */
const SAMPLE_MS = 1000

/** Governor that keeps clocks from drifting mid-suite. Anything else is a warning. */
const WANTED_GOVERNOR = 'performance'

/**
 * Governors the helper can set, and therefore the only ones a run can promise
 * to put back. Holding `performance` is refused outright when the host started
 * on anything else — leaving somebody's desktop pinned to max clocks because
 * the original value was unrepresentable is a worse outcome than benching at
 * whatever governor was already in force.
 */
const RESTORABLE = new Set(['performance', 'powersave'])

/**
 * Root-owned helper that sets the scaling governor, installed on the reference
 * host with a sudoers rule scoped to this one path. Absent everywhere else,
 * which is why every call site treats it as optional.
 */
const GOVERNOR_HELPER = '/usr/local/sbin/v0-governor'

export interface HostReport {
  /** Fraction of whole-machine CPU time busy across the window, or null if unreadable. */
  busy: number | null
  /** Busiest single logical CPU across the window, or null if unreadable. */
  peak: number | null
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
 * CPU counters from /proc/stat, keyed by `cpu` (whole machine) plus `cpu0`,
 * `cpu1`, … (per logical CPU).
 *
 * Fields are: user nice system idle iowait irq softirq steal guest guest_nice.
 * Only `idle` counts as not-busy. `iowait` is deliberately counted as busy even
 * though the CPU is stalled during it — a disk-bound neighbour still moves
 * memory bandwidth, evicts page cache and raises interrupt load, all of which
 * land on the benchmark. Treating it as idle lets exactly that workload through.
 */
function readCpus (): Map<string, Cpu> | null {
  try {
    const out = new Map<string, Cpu>()
    for (const line of readFileSync('/proc/stat', 'utf8').split('\n')) {
      if (!line.startsWith('cpu')) continue
      const fields = line.trim().split(/\s+/)
      const name = fields[0]
      const parts = fields.slice(1).map(Number)
      if (!name || parts.length < 5 || parts.some(Number.isNaN)) continue
      const total = parts.reduce((sum, v) => sum + v, 0)
      out.set(name, { busy: total - (parts[3] ?? 0), total })
    }
    return out.size > 0 ? out : null
  } catch {
    return null
  }
}

/** Whole-machine and busiest-core busy fractions. Null when /proc/stat is unavailable. */
export function sampleBusy (ms: number = SAMPLE_MS): { busy: number, peak: number } | null {
  const first = readCpus()
  if (!first) return null
  // A blocking sleep is correct here: the point is to observe wall-clock time
  // passing on a machine we are about to measure, and the caller has nothing
  // useful to do meanwhile.
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
  const second = readCpus()
  if (!second) return null

  let busy: number | null = null
  let peak = 0
  for (const [name, after] of second) {
    const before = first.get(name)
    if (!before) continue
    const total = after.total - before.total
    if (total <= 0) continue
    const fraction = (after.busy - before.busy) / total
    if (name === 'cpu') busy = fraction
    else peak = Math.max(peak, fraction)
  }
  return busy === null ? null : { busy, peak }
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
 * during the suite, which widens dispersion without inventing a fake result.
 */
export function checkHost (limit: number = BUSY_LIMIT, core: number = CORE_LIMIT): HostReport {
  const sample = sampleBusy()
  const governor = readGovernor()
  const load = loadavg()[0] ?? 0
  const others = otherUsers()
  const blocks: string[] = []
  const warns: string[] = []
  const context = others.length > 0 ? ` (other logins: ${others.join(', ')})` : ''

  if (sample === null) {
    warns.push('could not read /proc/stat — host contention was not verified')
  } else {
    if (sample.busy > limit) {
      blocks.push(`CPU is ${(sample.busy * 100).toFixed(1)}% busy, above the ${(limit * 100).toFixed(1)}% limit${context}`)
    }
    if (sample.peak > core) {
      blocks.push(`a single CPU is ${(sample.peak * 100).toFixed(1)}% busy, above the ${(core * 100).toFixed(1)}% per-core limit${context}`)
    }
  }

  if (governor === null) {
    warns.push('no cpufreq governor exposed — clock stability was not verified')
  } else if (governor !== WANTED_GOVERNOR) {
    warns.push(`scaling governor is "${governor}", not "${WANTED_GOVERNOR}" — clocks may drift mid-suite`)
  }

  return { busy: sample?.busy ?? null, peak: sample?.peak ?? null, governor, load, others, blocks, warns }
}

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

/** True when the governor helper is installed, i.e. this is a managed reference host. */
export function isReferenceHost (): boolean {
  return existsSync(GOVERNOR_HELPER)
}

/**
 * Hold `performance` for the duration of a run and give back a release function.
 *
 * Returns null — changing nothing — when there is no helper, when the governor
 * is already `performance`, or when the original value is one the helper cannot
 * set back (`schedutil`, `ondemand`, the `mixed(...)` marker). That last case is
 * the important one: flipping to `performance` from an unrestorable governor
 * would strand somebody's desktop at max clocks forever, so the run simply
 * declines to touch it.
 *
 * Release is wired to SIGINT and SIGTERM as well as to the caller's `finally`,
 * because the window being protected is a ~25 minute suite and the likeliest
 * way it ends early is a human pressing Ctrl-C — which does not run `finally`.
 *
 * `onSignal` lets the caller tear down whatever it has in flight before the
 * process re-raises. That is not optional in practice: signal handlers only run
 * when the event loop turns, so a caller blocking on a synchronous child would
 * never reach this code until the child it wanted to abort had already
 * finished.
 */
export function holdGovernor (onStop?: (signal: NodeJS.Signals) => void): (() => void) | null {
  const previous = readGovernor()
  if (previous === null || previous === WANTED_GOVERNOR) return null
  if (!RESTORABLE.has(previous)) return null
  if (!setGovernor(WANTED_GOVERNOR)) return null

  let released = false
  function release (): void {
    if (released) return
    released = true
    process.off('SIGINT', onSignal)
    process.off('SIGTERM', onSignal)
    if (!setGovernor(previous as 'performance' | 'powersave')) {
      console.warn(`[host-guard] could not restore governor to ${previous} — host left on ${WANTED_GOVERNOR}`)
    }
  }

  function onSignal (signal: NodeJS.Signals): void {
    onStop?.(signal)
    release()
    // Re-raise with the handler removed so the exit code reflects the signal
    // rather than a clean 0, which would read as a successful bench.
    process.kill(process.pid, signal)
  }

  process.once('SIGINT', onSignal)
  process.once('SIGTERM', onSignal)
  return release
}

/** One-line summary for the run log. */
export function formatHost (report: HostReport): string {
  const busy = report.busy === null ? 'unknown' : `${(report.busy * 100).toFixed(1)}%`
  const peak = report.peak === null ? 'unknown' : `${(report.peak * 100).toFixed(1)}%`
  return `busy=${busy} peak-core=${peak} load=${report.load.toFixed(2)} governor=${report.governor ?? 'n/a'}`
}
