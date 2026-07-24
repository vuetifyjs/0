/**
 * Guards the calibration anchor suite against edits.
 *
 * `scripts/lib/calibration.ts` stores anchor throughput measured on one
 * reference run. Every normalized number in metrics.json and in every
 * per-version history snapshot is expressed in that unit. Editing an anchor
 * changes what the unit *means* without changing any stored baseline, so the
 * entire history series silently starts comparing against a different ruler —
 * a failure with no symptom until someone tries to explain a trend line.
 *
 * These assertions make that edit loud. If one fails, either revert the change
 * or commit to a full re-baseline: update the hash here, set
 * `BASELINE_ANCHOR_HZ` back to `null`, and re-measure every snapshot.
 */

import { createHash } from 'node:crypto'

import { assert, describe, expect, it } from 'vitest'

// Imported through Vite's `?raw` rather than read off disk: the v0:unit project
// runs on the `vmThreads` pool, where `import.meta.url` is not a file: URL, so
// fs-based resolution from the test's own location is not available.
// @ts-expect-error -- `?raw` is a Vite virtual module; packages/0 does not pull in vite/client types.
import TEXT from './calibration.bench.ts?raw'

/**
 * sha256 of calibration.bench.ts. Update ONLY as part of a deliberate
 * re-baseline — see the file header.
 */
const EXPECTED_HASH = 'f2617bf499f968a9a82c3e2d3da7b31d0d05fb2b81e256165902a81c4ffc32c3'

/** Must match ANCHOR_COUNT in scripts/lib/calibration.ts. */
const EXPECTED_ANCHORS = 13

describe('calibration anchors', () => {
  it('is byte-identical to the hashed reference', () => {
    const actual = createHash('sha256').update(TEXT, 'utf8').digest('hex')
    // assert.equal rather than expect().toBe() purely to carry the message —
    // whoever trips this needs to know that bumping the hash is not the fix.
    assert.equal(
      actual,
      EXPECTED_HASH,
      'calibration.bench.ts changed. Every stored benchmark is normalized against '
      + 'these anchors, so an edit re-defines the unit for the whole history series. '
      + 'Revert, or do a full re-baseline (see the file header).',
    )
  })

  it('declares exactly the expected number of anchors', () => {
    const count = TEXT.match(/^\s*bench\('anchor a\d+ /gm)?.length ?? 0
    expect(count).toBe(EXPECTED_ANCHORS)
  })

  it('imports nothing from v0', () => {
    // V0_BENCH_TARGET aliases @vuetify/v0 to source, this package's dist, or an
    // installed version's dist. An anchor resolving through that alias would
    // vary with the thing it is supposed to be a fixed unit for — so the scale
    // factor would absorb v0's own performance changes and cancel them out of
    // the results, which is the exact opposite of the intent.
    const imports = [...TEXT.matchAll(/^import\s[^;]*?from\s+'([^']+)'/gm)].map(m => m[1])
    expect(imports).toEqual(['vitest'])
  })
})
