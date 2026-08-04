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
import { createApp, defineAsyncComponent } from 'vue'

// Types
import type { Component } from 'vue'

const examples = import.meta.glob('../examples/systems/bulma/**/*.vue')

const query = new URLSearchParams(window.location.search)

const name = query.get('e') ?? ''
const load = examples[`../examples/systems/bulma/${name}.vue`] as (() => Promise<Component>) | undefined

// Applied before mount so the frame never paints in the wrong scheme; the docs
// page re-sends the current one on ready and on every theme change after that.
if (query.get('theme') === 'dark') {
  document.documentElement.dataset.theme = 'dark'
}

createApp(SandboxRoot, {
  is: load && defineAsyncComponent(load),
  name,
}).mount('#sandbox')
