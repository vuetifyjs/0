# @vuetify/paper

## 1.0.0-rc.7

### Patch Changes

- [#489](https://github.com/vuetifyjs/0/pull/489) [`5c6d087`](https://github.com/vuetifyjs/0/commit/5c6d0871ddc148c52fe6ba4cbd569b433f7b77fc) Thanks [@johnleider](https://github.com/johnleider)! - fix(security): apply prototype-pollution and CSS-injection guards flagged in the security review

  - `useFeatures` adapters (LaunchDarkly / Flagsmith / PostHog) now skip `UNSAFE_KEYS` (`__proto__` / `constructor` / `prototype`) flag names when building the flags object, matching the guard already used by `mergeDeep`, `usePermissions`, and `createTokens`
  - `useLocale` `restore()` validates the persisted value with `isString` / `isNumber` guards before applying it instead of blind-casting `saved as ID`, completing the persist/restore sweep (`useTheme` and `useRtl` now use the same guards)
  - `ThemeAdapter`'s `UNSAFE_CSS` denylist is hardened against declaration injection: it now also rejects `;`, `\` (CSS escape evasion), and the URL-loading functions `src()` / `image()` / `image-set()` / `cross-fade()`
  - `@vuetify/paper` `useTheme` sanitizes color keys and values before writing them into the injected `<style>` element, mirroring the hardened v0 `ThemeAdapter` `SAFE_IDENT` / `UNSAFE_CSS` guards
  - `@vuetify/paper` `createTheme` now merges `options.themes` into the defaults — previously they were passed as `structuredClone`'s options bag and silently dropped, so a custom `current` theme threw at first render
  - `V0Error` filters `UNSAFE_KEYS` when copying caller-supplied error details onto the instance

- Updated dependencies [[`2ed9618`](https://github.com/vuetifyjs/0/commit/2ed9618ed365ef9e1a6c6b3bce6c4c6962f689e0), [`49e4f8b`](https://github.com/vuetifyjs/0/commit/49e4f8b7235f3c2a5213ccce63850b8b78014f66), [`5c6d087`](https://github.com/vuetifyjs/0/commit/5c6d0871ddc148c52fe6ba4cbd569b433f7b77fc), [`ffc4e5a`](https://github.com/vuetifyjs/0/commit/ffc4e5aaec7df81b1b62f022fe78cb4dfc5ef01b), [`76ca193`](https://github.com/vuetifyjs/0/commit/76ca1933d9c147a1f3ca53e4e9a9f579b49169cc)]:
  - @vuetify/v0@1.0.0-rc.7

## 1.0.0-rc.6

### Patch Changes

- Updated dependencies [[`38b27ed`](https://github.com/vuetifyjs/0/commit/38b27edba93ecf4b2f9f9fb4d323bce0f4504d05)]:
  - @vuetify/v0@1.0.0-rc.6

## 1.0.0-beta.5

### Patch Changes

- Updated dependencies [[`fe12826`](https://github.com/vuetifyjs/0/commit/fe12826195d1d887681c9bab67506de2ddd7b391)]:
  - @vuetify/v0@1.0.0-beta.5

## 1.0.0-beta.4

### Patch Changes

- Updated dependencies [[`2f4275c`](https://github.com/vuetifyjs/0/commit/2f4275cb3dd3162aa89bb0183159380039b5a35d), [`5db6a0d`](https://github.com/vuetifyjs/0/commit/5db6a0de80821b48603b876ba420a99c1bcf7ad1), [`dc0fc00`](https://github.com/vuetifyjs/0/commit/dc0fc00d5a61dcdfe108ffbb52682407971ef1b5), [`d075615`](https://github.com/vuetifyjs/0/commit/d0756155c3c5a8d480cf32a4d56ec162b1751bc3), [`3ee1d85`](https://github.com/vuetifyjs/0/commit/3ee1d851b384166217368b6f428c398f18e7515d), [`0cd2de5`](https://github.com/vuetifyjs/0/commit/0cd2de57d4e113784ba28a0cb98896386af8755b), [`6e8f86c`](https://github.com/vuetifyjs/0/commit/6e8f86ceb1fcc59b82b9b1f0e0b3e236438269df), [`ceaeba8`](https://github.com/vuetifyjs/0/commit/ceaeba80fd89e1e7e190e82bdc94fea23d9e875f), [`bf61d28`](https://github.com/vuetifyjs/0/commit/bf61d285eb184ebb8ecf49a73a201e1dc1e5f468), [`999c41f`](https://github.com/vuetifyjs/0/commit/999c41fbd960cd394b82974b0ea2618a8aa819d8), [`0c355e6`](https://github.com/vuetifyjs/0/commit/0c355e657b37c9254e8159486b69c01b4fdb2c18), [`19aac62`](https://github.com/vuetifyjs/0/commit/19aac62a16c6e236152e176ef6611a07d3ca359b), [`7bd450c`](https://github.com/vuetifyjs/0/commit/7bd450c13c6d904bffe16ed320420e8fe78e9dab), [`ab6da17`](https://github.com/vuetifyjs/0/commit/ab6da170680a383f26b9292975ef3aa6e2494c4f), [`9063b2c`](https://github.com/vuetifyjs/0/commit/9063b2c21e1f375b83e5926bd8a911094b3f2771), [`789c2e9`](https://github.com/vuetifyjs/0/commit/789c2e94ec6998dc00b815f3aeb856ea40b1ffbb)]:
  - @vuetify/v0@1.0.0-beta.4
