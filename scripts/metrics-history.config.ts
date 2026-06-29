/**
 * Versions to collect historical benchmark metrics for.
 *
 * Append each minor/major release tag (without the leading `v`) as they ship.
 * Patch releases are intentionally excluded — they rarely change benchmark
 * behavior and would balloon the history for no signal.
 *
 * Re-run `pnpm metrics:history` after adding a new entry. Existing per-version
 * files are skipped; only missing versions are generated.
 *
 * To retire a version (e.g. dropping pre-1.0 snapshots once 1.0 ships), delete
 * its `apps/docs/src/data/metrics/<version>.json` and remove it here — the docs
 * trend lines read whatever snapshot files remain in that directory.
 */
export const versions: string[] = [
  '0.1.0',
  '0.2.0',
  '1.0.0-alpha.0',
]
