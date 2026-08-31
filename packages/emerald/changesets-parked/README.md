# Parked changesets (historical)

This folder is leftover parking from when `@paper/emerald` was private.

With `privatePackages: { version: false }`, changesets never consumed these notes — but their presence at the top level made the release action take the version path instead of the publish path, producing an empty Version Packages branch and aborting the publish (first hit: v1.0.5, 2026-08-18). They were parked here so master could still ship.

`@paper/emerald` is now public (`0.1.0`, `publishConfig.access: public`). New emerald changeset notes go in `.changeset/` at the repo root, same as every other public package.

Do not add new files here. The `*.md` notes already in this folder are historical; they are invisible to changesets and are not part of a first-publish bootstrap.
