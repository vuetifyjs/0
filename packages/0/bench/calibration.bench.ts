/**
 * Host calibration anchors — DO NOT EDIT.
 *
 * These benches exist to measure the *machine*, not v0. Shared GitHub Actions
 * runners vary by roughly 1.5x in single-thread throughput between host
 * generations, which shows up as a whole-suite ops/s shift on unchanged code
 * (see PR #714: the re-benched 1.0.0 npm dist moved +50.9% median with
 * identical code, flipping 35 tier badges). Dividing every measurement by the
 * anchor ratio removes that host component, so numbers taken on different
 * runners — and therefore on different releases — stay comparable.
 *
 * Why this file must never change:
 *   The stored baseline (`scripts/lib/calibration.ts`) is the anchor hz measured
 *   on one reference run. Editing any bench here silently re-defines the unit
 *   every prior snapshot was normalized in, corrupting the whole history series.
 *   `calibration.test.ts` hashes this file and fails if a byte moves. If an edit
 *   is genuinely required, it is a deliberate re-baseline: change the file,
 *   update the hash, clear the baseline, and re-measure every snapshot.
 *
 * Design constraints (all load-bearing):
 *   - Imports nothing from v0. `V0_BENCH_TARGET` aliases `@vuetify/v0` to
 *     source / dist / an installed version; an anchor that resolved through
 *     that alias would measure the thing it is supposed to be a fixed unit for.
 *   - Fixtures are built once at module scope, so setup is never timed.
 *   - Every bench writes to `sink` and the fixtures are read back, so no body
 *     can be eliminated as dead code.
 *   - Deterministic input from a fixed-seed LCG — no Math.random, no Date.
 *   - Spans ~4 decades of per-op cost (~100ns to ~1ms). One anchor cannot
 *     normalize the whole suite: sub-microsecond work is dominated by IPC and
 *     branch prediction while millisecond work is dominated by cache and
 *     memory, and those do not scale together across hosts. The scale factor
 *     is the geometric mean over the whole spread.
 *   - Monomorphic call sites and stable shapes, so results reflect the host
 *     rather than a deopt that happens to trigger on one V8 build.
 */

import { bench, describe } from 'vitest'

// =============================================================================
// FIXTURES — built once, never timed
// =============================================================================

/** Fixed-seed LCG (numerical recipes). Deterministic across hosts and V8 builds. */
function lcg (seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

interface Row {
  id: string
  index: number
  score: number
  label: string
  active: boolean
}

function rows (count: number): Row[] {
  const random = lcg(0x5f_37_59_df)
  const out: Row[] = []
  for (let i = 0; i < count; i++) {
    out.push({
      id: `id-${i}`,
      index: i,
      score: Math.floor(random() * 1000),
      label: `label-${i % 32}`,
      active: i % 3 === 0,
    })
  }
  return out
}

const SMALL = rows(100)
const MEDIUM = rows(1000)
const LARGE = rows(10_000)

const MAP = new Map(MEDIUM.map(r => [r.id, r]))
const KEYS = MEDIUM.map(r => r.id)
const SHUFFLED = MEDIUM.map(r => r.score)
const LARGE_SCORES = LARGE.map(r => r.score)
const SHAPE = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 }

interface Node { value: number, children: Node[] }

function tree (breadth: number, depth: number): Node {
  const random = lcg(0x9e_37_79_b9)
  function build (level: number): Node {
    return {
      value: Math.floor(random() * 100),
      children: level === 0 ? [] : Array.from({ length: breadth }, () => build(level - 1)),
    }
  }
  return build(depth)
}

const TREE = tree(4, 5)

/** Written by every bench so no body is eliminable. */
let sink = 0

function walk (node: Node): number {
  let total = node.value
  for (const child of node.children) total += walk(child)
  return total
}

// =============================================================================
// ANCHORS — ordered by ascending cost
// =============================================================================

describe('calibration anchors', () => {
  bench('anchor a01 property read', () => {
    let total = 0
    for (let i = 0; i < 100; i++) total += SMALL[i].index
    sink = total
  })

  bench('anchor a02 map get', () => {
    let total = 0
    for (let i = 0; i < 100; i++) total += MAP.get(KEYS[i])!.score
    sink = total
  })

  bench('anchor a03 array sum', () => {
    let total = 0
    for (let i = 0; i < MEDIUM.length; i++) total += MEDIUM[i].score
    sink = total
  })

  bench('anchor a04 object spread', () => {
    let total = 0
    for (let i = 0; i < 100; i++) {
      const merged = { ...SHAPE, a: i }
      total += merged.a + merged.j
    }
    sink = total
  })

  bench('anchor a05 closure calls', () => {
    function add (a: number, b: number): number {
      return a + b
    }
    let total = 0
    for (let i = 0; i < 10_000; i++) total = add(total, 1)
    sink = total
  })

  bench('anchor a06 map build', () => {
    const map = new Map<string, Row>()
    for (let i = 0; i < MEDIUM.length; i++) map.set(MEDIUM[i].id, MEDIUM[i])
    sink = map.size
  })

  bench('anchor a07 array sort', () => {
    const copy = SHUFFLED.slice()
    copy.sort((a, b) => a - b)
    sink = copy[0]
  })

  bench('anchor a08 tree walk', () => {
    sink = walk(TREE)
  })

  bench('anchor a09 string build', () => {
    const parts: string[] = []
    for (let i = 0; i < LARGE.length; i++) parts.push(LARGE[i].label)
    sink = parts.join(',').length
  })

  bench('anchor a10 object churn', () => {
    let total = 0
    for (const row of LARGE) {
      total += { id: row.id, score: row.score * 2, active: !row.active }.score
    }
    sink = total
  })

  bench('anchor a11 filter map reduce', () => {
    sink = LARGE
      .filter(r => r.active)
      .map(r => r.score * 2)
      .reduce((a, b) => a + b, 0)
  })

  bench('anchor a12 grouped aggregate', () => {
    const groups = new Map<string, number>()
    for (const row of LARGE) {
      groups.set(row.label, (groups.get(row.label) ?? 0) + row.score)
    }
    let total = 0
    for (const value of groups.values()) total += value
    sink = total
  })

  bench('anchor a13 large sort', () => {
    const copy = LARGE_SCORES.slice()
    copy.sort((a, b) => a - b)
    sink = copy[0]
  })
})

/**
 * Exported so `sink` is definitionally read. A module-level binding that is only
 * ever written is both a lint smell and, in principle, eliminable.
 */
export function readSink (): number {
  return sink
}
