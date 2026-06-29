/**
 * Versions to collect historical benchmark metrics for — must be published to npm.
 *
 * The harness installs `@vuetify/v0@<version>` and benches it with the CURRENT
 * suite + toolchain (see `generate-metrics-history.ts`), so versions are directly
 * comparable. Track the 1.0 line onward; append each 1.x release as it ships.
 *
 * Re-run `pnpm metrics:history` after adding an entry (existing per-version files
 * are skipped; `--force` re-measures all). To retire a version, delete its
 * `apps/docs/src/data/metrics/<version>.json` and remove it here — the docs trend
 * lines read whatever snapshot files remain in that directory.
 */
export const versions: string[] = [
  '1.0.0-beta.0',
  '1.0.0-beta.1',
  '1.0.0-beta.2',
  '1.0.0-beta.3',
]
