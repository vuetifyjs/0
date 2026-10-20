---
"@paper/genesis": minor
---

feat(genesis): add GnDocsCallout and an optional host icon renderer (#593)

A presentational admonition for `tip`, `note`, `warning`, `caution`, and `important`. Colors follow the active v0 theme (`--v0-success` / `--v0-info` / `--v0-warning` / `--v0-error` / `--v0-accent`) with hex fallbacks; the `icon` and `title` slots override the defaults.

Chrome icons (callout, peek, example actions) resolve through optional `provideGnIcons` — a host renderer keyed by genesis roles — then a component-local inline SVG. Named slots still win. No genesis icon plugin or glyph registry.
