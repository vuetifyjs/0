/**
 * Policy for which published `@vuetify/v0` versions get a historical benchmark
 * snapshot.
 *
 * Versions are DISCOVERED from npm at run time (see `generate-metrics-history.ts`)
 * rather than hand-listed, so every new 1.x release is picked up automatically —
 * no config edit per release. This file only tunes the filter:
 *
 *   - `major`   — only versions on this major line are tracked.
 *   - `since`   — floor; versions ordered below this are ignored. Set to the
 *                 `1.0.0` stable baseline: the entire pre-1.0 prerelease series
 *                 (alpha/beta/rc) sorts below it and is excluded. Those snapshots
 *                 were archived (removed) at the v1.0 baseline reset; git history
 *                 at that commit is their record.
 *   - `exclude` — explicit versions to drop even if published (yanked/broken cuts).
 *
 * The harness installs `@vuetify/v0@<version>` and benches it with the CURRENT
 * suite + toolchain, so versions stay directly comparable. To retire a version,
 * delete its `apps/docs/src/data/metrics/<version>.json` and (if it would
 * otherwise be rediscovered) add it to `exclude` — the docs trend lines read
 * whatever snapshot files remain in that directory.
 */
interface HistoryConfig {
  major: number
  since: string
  exclude: string[]
}

export const config: HistoryConfig = {
  major: 1,
  since: '1.0.0',
  exclude: [],
}
