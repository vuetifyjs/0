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
 * (`packages/0/bench/calibration.bench.ts`). The ratio of this run's
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

/**
 * Repo-relative path of the anchor suite. Hash-guarded by calibration.test.ts.
 *
 * Deliberately outside `packages/0/src/` — the anchors measure the host, not v0,
 * and never reach the published dist. Tooling that treats a path under
 * `packages/<name>/src/` as "shipped source" (the changeset reminder, coverage)
 * would otherwise misclassify apparatus as a library change and ask for a
 * version bump that alters nothing consumers can observe.
 */
export const CALIBRATION_FILE = 'packages/0/bench/calibration.bench.ts'

/** Bench names in the anchor suite are prefixed so they are trivially identifiable. */
const ANCHOR_PREFIX = 'anchor a'

/** Expected anchor count. A mismatch means the suite changed — refuse to scale. */
export const ANCHOR_COUNT = 13

/**
 * Anchor throughput (ops/s) on the reference run, keyed by bench name.
 *
 * This is the unit. Every normalized number in the whole history series is
 * expressed as a ratio against these values, so they are not a measurement that
 * can be refreshed — they are the definition of "baseline speed".
 *
 * Captured 2026-07-28 on the reference host: Intel i9-7980XE (18C/36T), Linux
 * x64, Node v26.0.0, `V0_BENCH_TARGET=dist`, host verified idle with the
 * scaling governor held at `performance`. Each value is the median across four
 * independent full-suite runs, each itself a median of 3 — not one capture.
 * That matters: a single run bakes its own noise into the unit, and one of the
 * four diverged badly (see below). Held `null` until then, mirroring the
 * `since: null` convention in maturity.json, because the value is only knowable
 * once the measurement has actually happened and guessing it would have
 * ossified a fictional unit.
 *
 * ⚠️ Known residual, measured not theorised. Across four full-suite runs on the
 * same idle host, three produced a scale within 0.4% of 1 while one produced
 * 0.963 — its allocation-heavy anchors collapsed (`object churn` −38%,
 * `grouped aggregate` −27%) while the 446 real benches moved only +1.4%. The
 * median anchor moved −4.6%, so trimming cannot rescue it; the anchors simply
 * did not track the suite that run. Normalizing by that scale would have
 * injected ~4% of error into every bench rather than removing any. Same-host,
 * this apparatus is a no-op two runs in three and a 4% distortion in the third
 * — its value is cross-host, and it should be read as insurance against a
 * future host change rather than as something improving today's numbers.
 *
 * Re-capturing these numbers re-rulers every stored snapshot — a deliberate
 * re-baseline, never a tweak, and never a way to "fix" a suspicious result. The
 * legitimate reasons are the reference host being replaced or the anchor suite
 * itself changing. Both require re-measuring the whole history series in the new
 * unit; neither is a same-PR change. To re-baseline: reset to `null`, run
 * metrics on the new reference host, paste the resulting `apparatus.anchors`,
 * and re-run so every snapshot is re-expressed.
 *
 * Expect exactly one spurious whole-panel delta on the first regen after this
 * landed: the gate diffs a pre-apparatus (raw) `prev` against a normalized
 * `next`. Once only — every regen after it compares normalized to normalized.
 */
export const BASELINE_ANCHOR_HZ: Record<string, number> | null = {
  'anchor a01 property read': 4_467_210.901_183_255,
  'anchor a02 map get': 1_183_028.075_491_718,
  'anchor a03 array sum': 1_029_829.487_836_776,
  'anchor a04 object spread': 544_078.337_835_636,
  'anchor a05 closure calls': 231_535.284_357_314,
  'anchor a06 map build': 37_064.228_020_680_2,
  'anchor a07 array sort': 6788.042_184_798_543,
  'anchor a08 tree walk': 103_478.357_393_760_38,
  'anchor a09 string build': 3407.019_177_305_796_3,
  'anchor a10 object churn': 56_342.383_227_671_03,
  'anchor a11 filter map reduce': 6577.703_329_317_783,
  'anchor a12 grouped aggregate': 6830.500_651_511_602,
  'anchor a13 large sort': 543.437_717_789_633_8,
}

/**
 * Anchors dropped from each end of the sorted ratio list before averaging.
 *
 * One pathological anchor should not move the scale factor. Measured across two
 * consecutive runs on a deliberately noisy machine, the worst single anchor
 * moved 29.3% while the trimmed geometric mean of the rest held to 2.2% (the
 * untrimmed mean drifted 3.5%).
 *
 * Raised 1 → 2 on the reference host, where 18 runs scored as all 306 ordered
 * pairs (each run scaled against every other, so the ideal result is exactly 1)
 * gave a median scale error of 1.182% untrimmed, 0.945% at 1, 0.753% at 2,
 * 0.615% at 3, 0.565% at 4. The curve knees around 2–3; 2 buys most of the
 * improvement while still averaging 9 of 13 anchors. Dispersion on this host
 * concentrates in the allocation-heavy anchors (`object churn`,
 * `grouped aggregate`, `tree walk`) whose timing is dominated by GC scheduling,
 * and there are more than one of them — which is what a trim of 1 cannot absorb.
 *
 * Caveat on that evidence: it is single-host, so it shows trimming suppressing
 * GC noise, not trimming suppressing the host-*shape* outliers it also exists
 * for. The two should respond the same way to a wider trim, but that direction
 * is inference rather than measurement.
 *
 * Changing this is cheap only while `BASELINE_ANCHOR_HZ` is null. Afterwards it
 * shifts every computed scale by a fraction of a percent — mild next to editing
 * the anchors themselves, but still a change of ruler applied to stored history.
 */
const TRIM = 2

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

/**
 * The host-condition subset of the guard's report.
 *
 * Declared structurally rather than imported so calibration keeps depending on
 * nothing but the bench JSON — the guard decides whether to run, this file only
 * records what the machine looked like when it did.
 */
export interface HostFacts {
  busy: number | null
  peak: number | null
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
   * How busy the machine was with other work when the run started — `busy`
   * whole-machine, `peak` on its busiest single CPU — and the scaling governor
   * in force while measuring. Recorded because the fixed-host apparatus trades
   * CI's host rotation for a desktop's contention and clock drift: when a
   * snapshot later looks wrong, these are the fields that say whether the
   * machine was fit to produce it. `peak` is the load-bearing one — a single
   * saturated core is only ~2.8% of a 36-thread host, so `busy` alone can look
   * idle while a competing process runs. Absent on pre-guard artifacts.
   */
  busy?: number | null
  peak?: number | null
  governor?: string | null
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

/** Build the apparatus block embedded in every metrics artifact. */
export function buildApparatus (raw: BenchJson, runs?: number, host?: HostFacts): Apparatus {
  const anchors = extractAnchors(raw)
  const count = Object.keys(anchors).length
  return {
    scale: computeScale(anchors),
    anchors,
    baseline: BASELINE_ANCHOR_HZ,
    complete: count === ANCHOR_COUNT,
    ...(runs === undefined ? {} : { runs }),
    env: describeEnv(host),
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
