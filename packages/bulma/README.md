<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-dark.png">
    <img alt="Vuetify0" src="https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-light.png" height="150" style="display: block; margin-left: auto; margin-right: auto;">
  </picture>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@paper/bulma"><img src="https://img.shields.io/npm/v/%40paper%2Fbulma.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@paper/bulma"><img src="https://img.shields.io/npm/dm/%40paper%2Fbulma.svg" alt="Downloads"></a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/%40paper%2Fbulma.svg" alt="License"></a>
  <a href="https://discord.gg/vuetify"><img src="https://img.shields.io/discord/1513968811047522396?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord"></a>
</p>

# @paper/bulma

Vue behavior for [Bulma](https://bulma.io/documentation/)'s markup. Bulma ships the CSS and stops; this package is the JavaScript — real Bulma classes, driven by [Vuetify0](https://0.vuetifyjs.com).

Nothing about your stylesheet changes. There is no plugin, no `theme.css`, and no CSS in the package.

Docs: [0.vuetifyjs.com/systems/bulma](https://0.vuetifyjs.com/systems/bulma)

## Install

```bash
pnpm add @paper/bulma bulma
```

Bulma itself is an **optional** peer — load it from npm, Sass, or a CDN. The package never imports it.

```ts
import { createApp } from 'vue'
import App from './App.vue'

import 'bulma/css/bulma.min.css'

createApp(App).mount('#app')
```

No plugin to install. Import a component and use it.

Bulma **1.0+** only. The 0.9.x line predates CSS variables and is unsupported.
