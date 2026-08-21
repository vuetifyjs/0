# @vuetify/play

## 0.1.0

### Minor Changes

- [#901](https://github.com/vuetifyjs/0/pull/901) [`a27db81`](https://github.com/vuetifyjs/0/commit/a27db81ee18d8b8ca886f70460d52978274574d3) Thanks [@johnleider](https://github.com/johnleider)! - feat(play): share the v0play hash protocol as `@vuetify/play`

  Docs, the playground, and (later) genesis / the builder encode and sanitize the same `{ files, theme, themes }` payload. `ThemeAdapter.SAFE_IDENT` and `UNSAFE_CSS` are public so color values cannot drift from the stylesheet generator; CSS comments are rejected in theme tokens.

### Patch Changes

- Updated dependencies [[`0e31f73`](https://github.com/vuetifyjs/0/commit/0e31f73e84fe2e7d3bcb86d24847b60b8e0d59c3), [`a27db81`](https://github.com/vuetifyjs/0/commit/a27db81ee18d8b8ca886f70460d52978274574d3)]:
  - @vuetify/v0@1.1.0
