# @vuetify/play

## 0.1.1

### Patch Changes

- [#970](https://github.com/vuetifyjs/0/pull/970) [`275733c`](https://github.com/vuetifyjs/0/commit/275733cfbf3c9fbcf999d45a9d38a3a6dc1f3b1b) Thanks [@johnleider](https://github.com/johnleider)! - fix(play): make `npm install @vuetify/play` resolve its dependencies

  `0.1.0` shipped `@vuetify/v0` and `fflate` as workspace/catalog protocol strings, which npm cannot fetch. This republish writes semver ranges for both.

- Updated dependencies [[`ac90199`](https://github.com/vuetifyjs/0/commit/ac90199f51f30b0b2cc95c46016598278ac18c26), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`897cdcf`](https://github.com/vuetifyjs/0/commit/897cdcf0f5d6683f282261c378d84e1550df191c), [`2e0025c`](https://github.com/vuetifyjs/0/commit/2e0025cde4d5bcda140834628883fa8a8dff42ba), [`6ec1732`](https://github.com/vuetifyjs/0/commit/6ec173270d312591f966e32ede760531a1d18e24), [`c9575fd`](https://github.com/vuetifyjs/0/commit/c9575fd4c5be46333b010e022f6f00de240a3459), [`9f8eb78`](https://github.com/vuetifyjs/0/commit/9f8eb78d500e2a6f064a32422586cc5483b61c0d), [`1b6bb65`](https://github.com/vuetifyjs/0/commit/1b6bb65d01c61bb9e025e1ada9d50b634047b0b7), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`8155332`](https://github.com/vuetifyjs/0/commit/81553324651e93150ad9f61236d465fade96bd5b), [`2bfaf60`](https://github.com/vuetifyjs/0/commit/2bfaf6049a3c9c7504ed12c898f38af67df4d850)]:
  - @vuetify/v0@1.2.1

## 0.1.0

### Minor Changes

- [#901](https://github.com/vuetifyjs/0/pull/901) [`a27db81`](https://github.com/vuetifyjs/0/commit/a27db81ee18d8b8ca886f70460d52978274574d3) Thanks [@johnleider](https://github.com/johnleider)! - feat(play): share the v0play hash protocol as `@vuetify/play`

  Docs, the playground, and (later) genesis / the builder encode and sanitize the same `{ files, theme, themes }` payload. `ThemeAdapter.SAFE_IDENT` and `UNSAFE_CSS` are public so color values cannot drift from the stylesheet generator; CSS comments are rejected in theme tokens.

### Patch Changes

- Updated dependencies [[`0e31f73`](https://github.com/vuetifyjs/0/commit/0e31f73e84fe2e7d3bcb86d24847b60b8e0d59c3), [`a27db81`](https://github.com/vuetifyjs/0/commit/a27db81ee18d8b8ca886f70460d52978274574d3), [`884b6e7`](https://github.com/vuetifyjs/0/commit/884b6e780193161fb21baa0fbfef49cfec4b21b4)]:
  - @vuetify/v0@1.1.0
