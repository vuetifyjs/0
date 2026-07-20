# Building on Paper — Design Systems & Kits

The contract for every package built on the Paper layer. Per-package specifics live in
that package's `SPEC.md` (see [Per-package SPEC.md](#per-package-specmd)); this document
defines what is common, what is required, and what is forbidden — so patterns are decided
once, not rediscovered per component.

The stack:

```
@vuetify/v0      headless logic — compound components, composables, theme engine
@vuetify/paper   styling primitives — useColor, useTheme, useContrast, adapter bases
@paper/*         packages built on Paper (both classes below)
vuetify          orchestration + defaults (Material ships here)
```

## Two classes

The `@paper/*` scope hosts two deliberately different kinds of package. Identify the
class first — a kit missing a token pipeline is correct, not incomplete; a design
system missing one is broken.

| | **Design system** | **Kit** |
|---|---|---|
| Intent | Encompass everything — a complete visual framework | Purpose-scoped component set |
| Exemplars | Material, Emerald, Onyx | Genesis (docs), Helix (docs platform) |
| Token namespace | Owns one (`--emerald-*`) | **None** — consumes `--v0-*` |
| Theme plugin / adapter | Required (`theme.ts`, `adapter.ts`, `plugin.ts`) | **Forbidden** |
| Stylesheet artifact | `dist/theme.css` (prebaked default theme) | None — inherits the page's theme |
| Component coverage | Full, spec-driven | Only what the purpose needs |
| Visual language | Its own | Blends with whatever theme is active |

"Custom design system via bring-your-own Figma" is a **delivery mode** of the design
system class, not a third class: same contract, same pipeline, tokens sourced from the
customer's file. This is why the token pipeline must be reproducible end to end.

## Rulings

### 1. Tokens and the zero-config on-ramp (design systems)

Tokens are TypeScript objects (`theme.ts`), published as CSS custom properties at
runtime by a stylesheet adapter extending v0's theme system. Two consumption paths, both
required:

- **Zero-config**: the build prebakes the default theme to `dist/theme.css`. A newcomer
  installs, imports one CSS file, and components render correctly — no plugin.
- **Full**: `app.use(create<Name>Plugin())` for theming, dark mode, runtime switching,
  CSP nonces.

Component styles reference tokens with literal fallbacks — `var(--emerald-primary,
#26C26D)` — so components degrade to the default look rather than breaking when neither
path is wired. Design values live in tokens; literals appear **only** as `var()`
fallbacks or in `theme.ts`.

Kits skip all of this: consume `--v0-*` variables with literal fallbacks, exactly as
`@paper/genesis` documents in its SPEC.md.

### 2. Composition

Components compose **v0 compound primitives directly** — `Button.Root`, `Dialog.Root`,
`Tabs.Root`, and friends own behavior, accessibility, and state. Paper contributes
through its **composables** (`useColor`, `useTheme`, `useContrast`, …) and **adapter
base classes**, not as a component base: `V0Paper` is not the foundation for design
system or kit components. Never compose native HTML form controls.

### 3. Styling

- **Never `<style scoped>`.** Scoped rules silently fail on multi-root compound
  children (the `data-v` attribute never lands on the primitive's root — this bit
  Genesis in [#359](https://github.com/vuetifyjs/0/issues/359)). One rule, zero
  judgment calls.
- Isolation comes from the class prefix: every class is namespaced by package
  (`emerald-button`, `genesis-docs-example`).
- State styling hooks are data attributes (`data-variant`, `data-size`,
  `data-disabled`), not JS-computed class lists.
- No utility classes in package source.

### 4. Package skeleton (PROPOSED)

The config layer is mechanical and must be **generated, not authored** — scaffolded new
packages start from the canonical shape rather than copying a sibling:

- `package.json`: two-tier exports (`development` condition → `src/index.ts`,
  `publishConfig` dist-only), `workspace:^` internal ranges, `vue >=3.5.0` peer
  (components use reactive props destructure), `catalog:` dev deps.
- `tsconfig.json`: extends `@vue/tsconfig/tsconfig.dom.json`; `#<name>`/`#paper`/`#v0`
  path aliases; `lib` includes `esnext`; no `baseUrl`.
- `tsdown.config.mts`: `unplugin-vue/rolldown`, `dts: { vue: true }`, the deferred
  `__DEV__: 'process.env.NODE_ENV !== \'production\''` expression (never baked at
  build time), `exports: { devExports: 'development' }`.

### 5. Component maturity bar (PROPOSED)

A design system component ships only when:

- every variant and size in its spec exists (no "1 of 4 variants");
- interactive states are styled: hover, `:focus-visible`, disabled, loading where
  applicable;
- dark-mode tokens resolve wherever the design system defines a dark theme;
- its tokens are **wired** — a token defined in `theme.ts` but unused by any component,
  or a component hardcoding a value a token exists for, fails review.

Kits gate only on their purpose's spec.

## Per-package SPEC.md

Every `@paper/*` package carries a `SPEC.md` declaring:

1. its **class** (design system or kit) and purpose;
2. its **token source** (e.g. the canonical Figma file key) — design systems only;
3. its component inventory and any intentional deviations from this contract, with
   reasons.

`packages/genesis/SPEC.md` is the exemplar for kits.
