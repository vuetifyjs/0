/**
 * Host calibration — turn raw ops/s into a host-independent unit.
 *
 * The problem this solves: shared GHA runners differ by roughly 1.5x in
 * single-thread throughput between host generations, so the same code benched
 * on two runners produces two different sets of absolute numbers. Measured on
 * PR #714, the re-benched 1.0.0 npm dist (byte-identical code) moved +50.9%
 * median across 623 benches and flipped 35 tier badges. That makes the canary
 * gate fire on host rotation rather than on regressions, and makes any
 * cross-release comparison meaningless.
 *
 * The fix: every bench run also measures a fixed anchor suite
 * (`packages/0/src/__bench__/calibration.bench.ts`). The ratio of this run's
 * anchor throughput to the stored baseline is the host's speed relative to the
 * reference machine. Dividing measurements by that scale removes the host
 * component. Empirically this drops the whole-suite bias from +49.3% to +1.5%.
 *
 * What it does NOT fix: ~6% of benches are genuinely host-*shape*-sensitive
 * (createTokens alias resolution moves ~2.5x while everything else moves 1.47x)
 * and survive normalization as real outliers. Those need to be quarantined
 * separately; a scale factor cannot rescue them.
 */

import { cpus } from 'node:os'

import { normalizeFilepath, type BenchJson } from './bench-stable.ts'

/** Repo-relative path of the anchor suite. Hash-guarded by calibration.test.ts. */
export const CALIBRATION_FILE = 'packages/0/src/__bench__/calibration.bench.ts'

/** Bench names in the anchor suite are prefixed so they are trivially identifiable. */
const ANCHOR_PREFIX = 'anchor a'

/** Expected anchor count. A mismatch means the suite changed — refuse to scale. */
export const ANCHOR_COUNT = 13

/**
 * Anchor throughput (ops/s) on the reference run, keyed by bench name.
 *
 * `null` until a maintainer captures it from the first CI run of the anchor
 * suite, mirroring the `since: null` convention in maturity.json — the value is
 * only knowable once the measurement has actually happened on the reference
 * host, and guessing it would ossify a fictional unit. While null, `computeScale`
 * returns 1 and every artifact records `scale: 1, baseline: null`, so the
 * pipeline behaves exactly as it does today and nothing is silently rescaled.
 *
 * To capture: run metrics-regen, read `apparatus.anchors` out of the produced
 * benchmarks.json, paste it here, and re-run so every snapshot is expressed in
 * the new unit. Changing these numbers re-defines the unit for the whole
 * history series — treat it as a deliberate re-baseline, never a tweak.
 */
export const BASELINE_ANCHOR_HZ: Record<string, number> | null = null

/**
 * Anchors dropped from each end of the sorted ratio list before averaging.
 *
 * One pathological anchor should not move the scale factor. Measured across two
 * consecutive runs on a deliberately noisy machine, the worst single anchor
 * moved 29.3% while the trimmed geometric mean of the rest held to 2.2% (the
 * untrimmed mean drifted 3.5%).
 */
const TRIM = 1

export interface Apparatus {
  /** This host's speed relative to the baseline host. 1 when uncalibrated. */
  scale: number
  /** Raw anchor throughput measured on this run, keyed by bench name. */
  anchors: Record<string, number>
  /** `null` when no baseline is stored yet, so `scale` is not yet meaningful. */
  baseline: Record<string, number> | null
  /** False when the anchor suite did not run, or ran partially. */
  complete: boolean
  /** Independent bench passes median-merged into this artifact. */
  runs?: number
  env: EnvFingerprint
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
}

/** Geometric mean — the right average for ratios; an arithmetic mean is biased upward. */
function gmean (values: number[]): number {
  if (values.length === 0) return Number.NaN
  const sum = values.reduce((acc, v) => acc + Math.log(v), 0)
  return Math.exp(sum / values.length)
}

function trimmedGmean (ratios: number[]): number {
  const sorted = [...ratios].toSorted((a, b) => a - b)
  const trimmed = sorted.length > TRIM * 2 + 1
    ? sorted.slice(TRIM, -TRIM)
    : sorted
  return gmean(trimmed)
}

/** Pull anchor throughput out of a bench JSON, keyed by bench name. */
export function extractAnchors (raw: BenchJson): Record<string, number> {
  const anchors: Record<string, number> = {}
  for (const file of raw.files ?? []) {
    if (normalizeFilepath(file.filepath) !== CALIBRATION_FILE) continue
    for (const group of file.groups ?? []) {
      for (const bench of group.benchmarks ?? []) {
        if (!bench.name.startsWith(ANCHOR_PREFIX)) continue
        if (typeof bench.hz === 'number' && bench.hz > 0) anchors[bench.name] = bench.hz
      }
    }
  }
  return anchors
}

/**
 * Host scale factor: >1 means this host is faster than the baseline host, so
 * measured `hz` must be divided by it (and `mean` multiplied by it) to land in
 * baseline units.
 *
 * Returns 1 — a no-op — whenever the result would not be trustworthy: no
 * baseline stored yet, the anchor suite did not run, or the anchor set does not
 * match the baseline's. Silently scaling by a partial anchor set would be worse
 * than not scaling at all, because the error would be invisible downstream.
 */
export function computeScale (anchors: Record<string, number>): number {
  if (!BASELINE_ANCHOR_HZ) return 1
  const shared = Object.keys(anchors).filter(name => BASELINE_ANCHOR_HZ[name] > 0)
  if (shared.length < ANCHOR_COUNT) return 1
  return trimmedGmean(shared.map(name => anchors[name] / BASELINE_ANCHOR_HZ[name]))
}

function pnpmVersion (): string | null {
  // "pnpm/11.16.0 npm/? node/v26.0.0 linux x64"
  const agent = process.env.npm_config_user_agent
  return agent?.match(/pnpm\/(\S+)/)?.[1] ?? null
}

/**
 * Environment fingerprint, recorded so a future whole-suite shift is one lookup
 * instead of a forensic dig. #714 cost an hour of bisecting precisely because
 * nothing in the artifact said which machine produced it — the shift was only
 * attributable by elimination.
 */
export function describeEnv (): EnvFingerprint {
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
  }
}

/** Build the apparatus block embedded in every metrics artifact. */
export function buildApparatus (raw: BenchJson, runs?: number): Apparatus {
  const anchors = extractAnchors(raw)
  const count = Object.keys(anchors).length
  return {
    scale: computeScale(anchors),
    anchors,
    baseline: BASELINE_ANCHOR_HZ,
    complete: count === ANCHOR_COUNT,
    ...(runs === undefined ? {} : { runs }),
    env: describeEnv(),
  }
}

/** Divide out the host: raw ops/s → baseline-unit ops/s. */
export function normalizeHz (hz: number, scale: number): number {
  return hz / scale
}

/** Multiply in the host: raw ms/op → baseline-unit ms/op. */
export function normalizeMean (mean: number, scale: number): number {
  return mean * scale
}
