/**
 * Entry for the chrome-less Bootstrap example frame (`sandbox/bootstrap.html`).
 *
 * Mounts exactly one example from `src/examples/systems/bootstrap/**` — selected
 * by the `e` query param, e.g. `/sandbox/bootstrap.html?e=dialog/basic` — into a
 * document that carries the user's Bootstrap CSS and nothing from the docs shell.
 */

// Context
import SandboxRoot from './SandboxRoot.vue'

// Utilities
import { createApp } from 'vue'

// Types
import type { Component } from 'vue'

const examples = import.meta.glob('../examples/systems/bootstrap/**/*.vue')

const query = new URLSearchParams(window.location.search)

const name = query.get('e') ?? ''
const exampleKey = `../examples/systems/bootstrap/${name}.vue`
// Allowlist: only invoke loaders whose keys come from import.meta.glob.
const load = Object.hasOwn(examples, exampleKey)
  ? examples[exampleKey] as () => Promise<{ default: Component }>
  : undefined

// The `theme` param is read by the blocking script in `sandbox/bootstrap.html`.
// The docs page re-sends the current scheme on ready and on every change after
// that; SandboxRoot writes it to `data-bs-theme`.

async function start () {
  const module = await load?.()

  createApp(SandboxRoot, {
    is: module?.default,
    name,
    themeAttribute: 'data-bs-theme',
  }).mount('#sandbox')
}

start()
