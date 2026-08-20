/**
 * The semantic color names the theme layer guarantees.
 *
 * `createThemePlugin` emits one custom property per name, and a consumer maps
 * those onto utility classes (`bg-primary`, `text-on-surface`) in their UnoCSS
 * or Tailwind config. Both sides have to agree on the same list, and today they
 * agree by hand — the docs site and the `create-vuetify0` templates each keep
 * their own copy, with nothing to catch a divergence. This is the one owner.
 *
 * Palettes are free to emit more than this — `material` adds `tertiary` and
 * `outline`, `radix` adds numbered scales — and an application is free to
 * define anything it likes. This is the guaranteed floor: the set every
 * built-in palette provides, so markup written against it renders in any
 * project that has the theme plugin installed.
 *
 * Deliberately not exported from `@vuetify/v0/theme` yet. Nothing outside this
 * repo consumes it — the CLI reads the emitted `registry/tokens.json` instead —
 * and making it public is a minor bump that belongs with the change that gives
 * the `create-vuetify0` templates a reason to import it.
 */
export const SEMANTIC_COLORS = [
  'background',
  'divider',
  'error',
  'info',
  'on-background',
  'on-error',
  'on-info',
  'on-primary',
  'on-secondary',
  'on-success',
  'on-surface',
  'on-surface-variant',
  'on-warning',
  'primary',
  'secondary',
  'success',
  'surface',
  'surface-tint',
  'surface-variant',
  'warning',
] as const
