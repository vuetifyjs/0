# @vuetify-private/vapor-tests

Isolated [Vue Vapor mode](https://github.com/vuejs/core/releases/tag/v3.6.0-rc.1)
parity tests for `@vuetify/v0`. This package verifies — with **real Vapor
renders**, not mocks — that v0's composables and components work under Vue's
vdom-less runtime.

## Why this is a separate package

Vapor ships in **Vue 3.6**, which is in release-candidate phase (Vapor is
feature-complete as of rc.1). The rest of the monorepo is pinned to Vue 3.5 via
the catalog, and we don't want a pre-release Vue in the default test run. So
this package:

- Declares its **own** `vue@3.6.0-rc.2` + `@vue/runtime-vapor@3.6.0-rc.2`
  devDependencies. pnpm installs them alongside the 3.5 copy; `packages/0`
  is untouched.
- Lives under `tests/*`, which the root `vitest.config.ts`
  (`projects: ['packages/*', 'apps/docs']`) does **not** match — so
  `pnpm test` / CI never run it.

Run it explicitly:

```bash
pnpm test:vapor        # from repo root
pnpm --filter @vuetify-private/vapor-tests test
```

## What it covers

| File | Proves |
|------|--------|
| `test/smoke.test.ts` | The pre-release toolchain compiles + mounts a `<script setup vapor>` SFC and reacts. If this fails, the harness is broken, not v0. |
| `test/instance.vapor.test.ts` | `utilities/instance.ts` works under a real Vapor render: `getCurrentInstance()` is genuinely `null`, yet the `currentInstance` shim still detects the instance and `useId()` resolves. `instance.test.ts` can only mock this. |
| `test/composables.vapor.test.ts` | `createSelection` (registry + reactive tickets + computed Set) runs in a Vapor setup and drives Vapor DOM updates. |
| `test/context.vapor.test.ts` | `createContext` carries a value from a Vapor ancestor to a Vapor descendant — the provide/inject substrate beneath every v0 compound component. |
| `test/interop.vapor.test.ts` | A classic (vdom) v0 component renders inside a Vapor root via `vaporInteropPlugin`, including slot content forwarded from the Vapor parent. |

## Why the vitest config is unusual

Two toolchain traps, both handled in `vitest.config.ts`:

1. **Vue's `node` export condition resolves to a Vapor-less build.** `vue`'s
   `.` export maps `node` → `index.mjs` → the full CJS build, which does **not**
   re-export the Vapor runtime — so `import { defineVaporComponent } from 'vue'`
   (emitted by the compiler) comes back `undefined`. We alias every Vue runtime
   package (`vue`, `@vue/runtime-*`, `@vue/reactivity`, `@vue/shared`) straight
   to its `*.esm-bundler.js` build, which re-exports the Vapor symbols and the
   `@internal` cross-package helpers (e.g. `initFeatureFlags`) that the CJS
   builds strip.
2. **Those esm-bundler builds reference compile-time globals.** `__DEV__` and
   the `__VUE_*__` feature flags are replaced via `define`, and the packages are
   `inline`d so Vite (not Node) transforms them.

## RC pin

`3.6.0-rc.2` is the newest 3.6 release candidate. RCs land faster than the
workspace's `minimumReleaseAge` (14 days) clears them, so `vue` and `@vue/*`
sit in `minimumReleaseAgeExclude` — safe because both are exact-pinned
everywhere (default catalog + this package), so no floating range can pull an
un-aged release. Bump the pin to `3.6.0` when stable ships and drop the
exclusions once it clears the age window; the Vapor API (`vapor` attribute,
`createVaporApp`, `vaporInteropPlugin`) has been stable across the beta and RC
lines.
