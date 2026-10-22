---
'@paper/quantum': minor
---

feat(quantum): add the Quantum design system (Material Design 1) with theme tokens, adapter, plugin, icons and ripple

`@paper/quantum` is the Material Design 1 (2014 to 2017) design system on Vuetify0: the pinned, archived guidelines rendered on v0's headless compounds. This first release ships the foundation the `Qu*` components build on.

- `createQuantumPlugin({ theme, icons, reducedMotion })` installs the `quantum-light` and `quantum-dark` themes through `QuantumStyleSheetAdapter`, the icon registry and reduced-motion detection. Each key takes that plugin's own options, or `false` when your app installs it itself.
- `@paper/quantum/theme.css` is the prebaked default theme: the 256-value MD1 palette, the type scale, elevation, motion and layout tokens as `--quantum-*` custom properties, every color also as an `r g b` `-channels` triplet, and `--v0-*` aliases so Vuetify0 kits inherit the theme. `@paper/quantum/style.css` carries the component styles and the `quantum-type-*` and `quantum-elevation-*` utility classes.
- `quantumColors` and `quantumDarkColors` are the two theme maps; `quantumHueTheme(primary, accent)` derives the role set for another hue pair from the palette; `quantumDesignSystem` and `quantumBreakpoints` expose the token dictionary and the responsive-ui widths.
- `QuIcon` draws 80 Material Icons glyphs under 107 role names, mirrors directional roles under `dir="rtl"`, and resolves overrides and aliases registered through `createQuantumIconsPlugin`. The artwork is Apache License 2.0; the notice ships as `LICENSE-ICONS`.
- `QuRipple` and `useRipple` provide the ink reaction every interactive component hosts, with reduced motion respected.
