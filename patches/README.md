# Dependency patches

Local patches applied to third-party packages via [pnpm's patch feature](https://pnpm.io/cli/patch). Each file here is registered under `patchedDependencies` in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) and applied automatically on `pnpm install`.

Every patch is documented below with **what** it changes and **why** — patches are invisible technical debt otherwise, and a future maintainer bumping one of these packages needs to know whether the patch is still required.

> **These patch built `dist/` files, not source.** They are pinned to an exact version and will fail to apply the moment the dependency is bumped. On any upgrade of a patched package: re-run `pnpm patch`, re-verify each change below still applies (or is now fixed upstream and can be dropped), and update the version in `pnpm-workspace.yaml`.

## `@vue/repl@4.7.1`

Powers the docs Playground. Three changes, all to embed the REPL cleanly in our docs shell:

1. **Stop the editor stealing focus** (`dist/monaco-editor.js`) — removes the `editorInstance.focus()` call fired after restoring editor view state, so mounting/restoring the Playground no longer yanks focus into the code editor.
2. **Silence a spurious inject warning** (`dist/vue-repl.js`) — `inject(injectKeyProps)` → `inject(injectKeyProps, void 0)`. The code immediately below already handles the `undefined` case; supplying an explicit default stops Vue warning "injection not found" when the REPL is used standalone.
3. **Add a "hide output panel" capability** (`dist/vue-repl.js`) — wraps the `Output` component render in `props.store.showOutput !== false ? … : createCommentVNode()`, letting the store conditionally hide the preview/output pane. Not supported by upstream 4.7.1; drives the Playground's panel toggle.

Introduced in `886b7cde` (2026-02-22), _docs(playground): add nav entry, back button, theme toggle, and panel toggle_. The `showOutput` change backs the "panel toggle" in that commit.

**On upgrade:** check whether upstream has added a `showOutput` (or equivalent) store option and a way to suppress editor auto-focus — if so, drop the patch and use the native API.

## `vite-ssg@28.3.0`

Static-site generation for the docs. One change (`dist/index.mjs`):

- **Modernize the router guard signature** — rewrites the SSG initial-state `router.beforeEach((to, from, next) => { … next() })` to the callback-free `router.beforeEach((to) => { … })` form. Vue Router deprecated the `next()` callback style; the legacy signature warns (and risks breaking) under the `vue-router` version this repo pins. Compatibility fix only — behavior is unchanged.

Introduced in `ec58c1a2` (2026-03-25), _docs: add Theme/Locale component pages, examples, and vite-ssg patch_ — whose body states the rationale directly ("Patch vite-ssg to remove deprecated router guard next() callback").

**On upgrade:** verify whether the target `vite-ssg` release already uses the callback-free guard — if it does, this patch is redundant and should be removed.
