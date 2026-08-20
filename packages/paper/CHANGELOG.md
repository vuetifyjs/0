# @vuetify/paper

## 1.0.0-rc.9

### Patch Changes

- Updated dependencies [[`95d2d34`](https://github.com/vuetifyjs/0/commit/95d2d34c08692b15b9c6d2d173b010d80be7e024), [`d611c03`](https://github.com/vuetifyjs/0/commit/d611c03a1c8f462e51cc2a96032a114da8e91328), [`584668d`](https://github.com/vuetifyjs/0/commit/584668d559add9271593b5089d16c01c25134214), [`396ea49`](https://github.com/vuetifyjs/0/commit/396ea49d9ddcc17091bfd9907babbb256301e118), [`a1df426`](https://github.com/vuetifyjs/0/commit/a1df4263153830feffacfa23fcab575d1feaf809), [`9ca3fb3`](https://github.com/vuetifyjs/0/commit/9ca3fb3d23b8b7153083edc2a1dbff48c8b74512), [`65952f2`](https://github.com/vuetifyjs/0/commit/65952f27190745da40ff62e82505cf04c56a6a40), [`3b5565d`](https://github.com/vuetifyjs/0/commit/3b5565d8450260e4ca27174e710c19082bf82ef1), [`4c2ede3`](https://github.com/vuetifyjs/0/commit/4c2ede35af553631e2af9383014288a476f2636a)]:
  - @vuetify/v0@1.0.0-rc.9

## 1.0.0-rc.8

### Patch Changes

- Updated dependencies [[`03b298f`](https://github.com/vuetifyjs/0/commit/03b298f61270dea573e64f618b48173de20cbd4d), [`9c04ead`](https://github.com/vuetifyjs/0/commit/9c04eadc12c5b2f037aa1202184fe70142646030), [`da2e0c1`](https://github.com/vuetifyjs/0/commit/da2e0c115fb3b1001634a392162c8e22e82a8bfa), [`23e7a0b`](https://github.com/vuetifyjs/0/commit/23e7a0b421d74397c1a70fbb59c99781c52ebb96), [`df823ca`](https://github.com/vuetifyjs/0/commit/df823cad723bb23dc67ce98036d795ce064173dc), [`52b0ea8`](https://github.com/vuetifyjs/0/commit/52b0ea8387242de5f43424d37f2d0c9d80727f74), [`e741325`](https://github.com/vuetifyjs/0/commit/e741325cf10874c682acd119529e4cdb44a9fb26), [`9127759`](https://github.com/vuetifyjs/0/commit/9127759efd6dc53b18e260d238277825fed017ea), [`cdc9fb5`](https://github.com/vuetifyjs/0/commit/cdc9fb556844f5545227ca88eb44c4401afc69c7), [`7f01ea0`](https://github.com/vuetifyjs/0/commit/7f01ea01b211bc0c0c3defa86c13c8ab5c6bffa8), [`e770c89`](https://github.com/vuetifyjs/0/commit/e770c89545cf4ec6666cc2b743f78938851fa7c6), [`05be673`](https://github.com/vuetifyjs/0/commit/05be673d6affb83143a8dcba04554fac49d43c64), [`e653ef5`](https://github.com/vuetifyjs/0/commit/e653ef59537ccb489765b505b320a1db18cf5133), [`562bd14`](https://github.com/vuetifyjs/0/commit/562bd1457c5c5b05c73fa8af69b4a61cef029451), [`ef7316b`](https://github.com/vuetifyjs/0/commit/ef7316bb08861501cf163aebac4c805b61c89da5), [`237c90a`](https://github.com/vuetifyjs/0/commit/237c90a6888b364e0c4bb650c8b79e69745c6a5b)]:
  - @vuetify/v0@1.0.0-rc.8

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
