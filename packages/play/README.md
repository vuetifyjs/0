<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.vuetifyjs.com/docs/images/one/logos/vplay-logo-dark.png">
    <img alt="Vuetify Play" src="https://cdn.vuetifyjs.com/docs/images/one/logos/vplay-logo-light.png" height="100">
  </picture>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/@vuetify/play"><img src="https://img.shields.io/npm/v/%40vuetify%2Fplay.svg" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@vuetify/play"><img src="https://img.shields.io/npm/dm/%40vuetify%2Fplay.svg" alt="Downloads"></a>
  <br>
  <a href="https://github.com/vuetifyjs/0/blob/master/LICENSE.md"><img src="https://img.shields.io/npm/l/%40vuetify%2Fplay.svg" alt="License"></a>
  <a href="https://discord.gg/vuetify"><img src="https://img.shields.io/discord/1513968811047522396?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord"></a>
</p>

# @vuetify/play

Hash protocol for [v0play](https://v0play.vuetifyjs.com). Encode files and themes into a URL hash; decode and sanitize them on the other side.

```ts
import { encodePlaygroundHash, toPlaygroundThemes } from '@vuetify/play'

const hash = await encodePlaygroundHash({
  files: { 'src/App.vue': '<template>Hello</template>' },
  ...toPlaygroundThemes('brand-light', {
    'brand-light': { dark: false, colors: { primary: '#7453ec', background: '#ffffff' } },
    'brand-dark': { dark: true, colors: { primary: '#c4b5fd', background: '#121212' } },
  }),
})

window.open(`https://v0play.vuetifyjs.com/#${hash}`)
```

Theme ids are `{name}-light` / `{name}-dark` pairs. Color keys and values are filtered through v0's `ThemeAdapter.SAFE_IDENT` / `UNSAFE_CSS` plus `__proto__` / `constructor` / `prototype` skips.
