---
"@vuetify/v0": patch
---

fix(build): ship type declarations for the `@vuetify/v0/browser` entry — `./browser` mapped to `./dist/browser/index.js` with no `.d.ts`, so `are-the-types-wrong` flagged it `UntypedResolution` and TypeScript consumers importing `@vuetify/v0/browser` got no types. The browser bundle now emits `dist/browser/index.d.ts` (it bundles the same `src/index.ts` as the main entry, so its types are identical), and the `repo:exports` attw check no longer needs to exclude the browser entrypoint.
