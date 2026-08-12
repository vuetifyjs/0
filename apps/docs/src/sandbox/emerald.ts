/**
 * Entry for the chrome-less Emerald example frame (`sandbox/emerald.html`).
 *
 * Mounts exactly one example from `src/examples/systems/emerald/**` — selected
 * by the `e` query param, e.g. `/sandbox/emerald.html?e=dialog/basic` — into a
 * document that carries Emerald's own CSS and nothing from the docs shell.
 */

// Framework
import {
  createEmeraldIconsPlugin,
  emeraldColors,
  emeraldDarkColors,
  EmeraldStyleSheetAdapter,
} from '@paper/emerald'

// Context
import SandboxRoot from './SandboxRoot.vue'

// Utilities
import { createApp } from 'vue'

// Types
import type { Component } from 'vue'

const examples = import.meta.glob('../examples/systems/emerald/**/*.vue')

const query = new URLSearchParams(window.location.search)

const name = query.get('e') ?? ''
const exampleKey = `../examples/systems/emerald/${name}.vue`
// Allowlist: only invoke loaders whose keys come from import.meta.glob.
// Reject unknown ?e= values before the dynamic call (CodeQL js/unsafe-dynamic-method-call).
const load = Object.hasOwn(examples, exampleKey)
  ? examples[exampleKey] as () => Promise<{ default: Component }>
  : undefined

// The `theme` param is read by the blocking script in `sandbox/emerald.html`,
// not here — by the time this module runs the frame has already painted once.
// The docs page re-sends the current scheme on ready and on every change after.

// Emerald publishes its tokens two ways: `@paper/emerald/theme.css` for the
// zero-config consumer, and this adapter for hosts that generate them. The
// stylesheet is the better documentation story but it is a `dist/` artifact,
// and the docs resolve `@paper/emerald` to its *source* — so importing it would
// bind the docs build to a prior package build. Generating the same CSS from
// the same `colors.ts` costs one call and has no such ordering.
//
// Deliberately not `createEmeraldPlugin()` / `createThemePlugin`: that path
// installs a theme whose adapter writes `data-theme` on `<html>` and keeps
// writing it. This frame's theme is owned by the docs page across a message
// channel, so a second writer would fight it — and lose the reader's toggle.
// The generated CSS carries both themes at once and the attribute picks one,
// which is exactly the CSS-only switching the frame needs.
const adapter = new EmeraldStyleSheetAdapter()

adapter.upsert(adapter.generate({
  'emerald': emeraldColors,
  'emerald-dark': emeraldDarkColors,
}))

// Resolved before mount, not deferred behind `defineAsyncComponent`: mounting
// first would put the app on screen as an empty box for as long as the example
// chunk takes to arrive, and the observers would measure that box and report a
// height the docs page then holds its layout open at. There is nothing worth
// showing in that window anyway — the frame has no spinner.
async function start () {
  const module = await load?.()

  createApp(SandboxRoot, {
    is: module?.default,
    name,
    // Emerald's themes are registered as `emerald` / `emerald-dark`; the docs
    // page speaks in schemes. See the prop's own docs in SandboxRoot.
    themes: { light: 'emerald', dark: 'emerald-dark' },
  })
    // Only the icons. Theme install is deliberately skipped — see above.
    .use(createEmeraldIconsPlugin())
    .mount('#sandbox')
}

start()
