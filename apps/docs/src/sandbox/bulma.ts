/**
 * Entry for the chrome-less Bulma example frame (`sandbox/bulma.html`).
 *
 * Mounts exactly one example from `src/examples/systems/bulma/**` — selected by
 * the `e` query param, e.g. `/sandbox/bulma.html?e=modal/basic` — into a
 * document that carries the user's Bulma CSS and nothing from the docs shell.
 */

// Context
import SandboxRoot from './SandboxRoot.vue'

// Utilities
import { createApp } from 'vue'

// Types
import type { Component } from 'vue'

const examples = import.meta.glob('../examples/systems/bulma/**/*.vue')

const query = new URLSearchParams(window.location.search)

const name = query.get('e') ?? ''
const load = examples[`../examples/systems/bulma/${name}.vue`] as (() => Promise<{ default: Component }>) | undefined

// The `theme` param is read by the blocking script in `sandbox/bulma.html`, not
// here — by the time this module runs the frame has already painted once. The
// docs page re-sends the current scheme on ready and on every change after that.

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
  }).mount('#sandbox')
}

start()
