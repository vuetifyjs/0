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
