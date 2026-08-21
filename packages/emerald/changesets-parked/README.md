# Parked changesets

Changesets for private packages (`@paper/emerald`). With
`privatePackages: { version: false }`, changesets never consumes these — but
their presence at the top level makes the release action take the version
path instead of the publish path, producing an empty Version Packages branch
and aborting the publish (first hit: v1.0.5, 2026-08-18).

They live here until the package goes public; move them back to `.changeset/`
as part of the first-publish bootstrap. New emerald changesets on master
should land here directly until then.
