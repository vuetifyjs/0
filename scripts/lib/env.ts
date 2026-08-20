/**
 * Environment fingerprint recorded alongside every benchmark artifact.
 *
 * This is what remains of the host-calibration apparatus, and it is the part
 * that was always worth having. The rest — a synthetic anchor suite, a stored
 * baseline, a trimmed geometric mean, a scale divisor — tried to *correct* for
 * the machine. This merely *records* it, which turns out to be both cheaper and
 * more useful: when a number looks wrong, the question is almost always "did
 * something about the machine change", and a fingerprint answers that directly
 * while a correction factor only obscures it.
 *
 * Why correcting was abandoned: benchmarks now run on one fixed workstation, so
 * there is no host rotation left to correct for. Measured on four full-suite
 * runs of identical code, dividing by the anchor-derived scale made results
 * *less* reproducible than leaving them alone — per-feature spread 6.23% median
 * normalized versus 2.16% raw — because the anchors did not track the suite.
 * See `.claude/rules/benchmarks.md` for the full numbers.
 */

import { cpus } from 'node:os'

export interface HostFacts {
  /** Fraction of whole-machine CPU busy with other work when the run started. */
  busy: number | null
  /** Busiest single logical CPU over the sample window. */
  peak: number | null
  /** Scaling governor in force while measuring. */
  governor: string | null
}

export interface EnvFingerprint {
  cpu: string | null
  cores: number | null
  arch: string
  platform: string
  node: string
  pnpm: string | null
  /** GHA runner image, e.g. "ubuntu24" / "20260701.1". Null off CI. */
  imageOs: string | null
  imageVersion: string | null
  ci: boolean
  /**
   * How busy the machine was with other work, and the governor in force. `peak`
   * is the load-bearing one — a single saturated core is only ~2.8% of a
   * 36-thread host, so the whole-machine figure can look idle while a competing
   * process runs. Absent on artifacts written before the host guard.
   */
  busy?: number | null
  peak?: number | null
  governor?: string | null
}

function pnpmVersion (): string | null {
  // "pnpm/11.16.0 npm/? node/v26.0.0 linux x64"
  const agent = process.env.npm_config_user_agent
  return agent?.match(/pnpm\/(\S+)/)?.[1] ?? null
}

/**
 * Describe the machine that produced a set of numbers.
 *
 * Recorded so a future whole-suite shift is one lookup instead of a forensic
 * dig. PR #714 cost an hour of bisecting precisely because nothing in the
 * artifact said which machine produced it — the shift was only attributable by
 * elimination. Comparing two artifacts whose fingerprints differ in `cpu` or
 * `node` is the signal that their absolute numbers are not comparable; there is
 * no correction factor that rescues that, so the honest move is to re-measure.
 */
export function describeEnv (host?: HostFacts): EnvFingerprint {
  let cpu: string | null = null
  let cores: number | null = null
  try {
    const list = cpus()
    cpu = list[0]?.model?.trim() ?? null
    cores = list.length
  } catch {
    // os.cpus() can return [] in some sandboxes — a missing fingerprint is not
    // a reason to fail a bench run.
  }
  return {
    cpu,
    cores,
    arch: process.arch,
    platform: process.platform,
    node: process.version,
    pnpm: pnpmVersion(),
    imageOs: process.env.ImageOS ?? null,
    imageVersion: process.env.ImageVersion ?? null,
    ci: process.env.CI === 'true',
    ...(host === undefined ? {} : { busy: host.busy, peak: host.peak, governor: host.governor }),
  }
}
