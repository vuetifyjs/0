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
