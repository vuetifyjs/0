# AGENTS.md — @vuetify/v0

Context for AI reviewers of this repository. `@vuetify/v0` is a Vue 3 library of
**headless** UI primitives and composables — unstyled, logic-focused building blocks
for design systems. Read this before reviewing a diff; it points at the rules that
govern each area rather than restating them.

## Review rubric

Judge a diff in `packages/0/src/**` against these invariants. Each is a real finding
when violated, not a stylistic preference.

- **Headless contract** — no styling, CSS, or utility classes in package source. The
  library ships logic only; visual concerns belong to consumers. Structural inline
  styles a primitive genuinely needs (e.g. positioning) are the only exception.
- **Events belong to components, not composables** — composables never attach or
  handle DOM events; only components (`.vue`) do. A `window.addEventListener` or
  `el.addEventListener` inside a composable body is a violation.
- **Type guards over raw comparisons** — use `#v0/utilities` guards: `isNull(x)` not
  `x === null`, `isUndefined(x)` not `x === undefined`, `isNullOrUndefined(x)` not
  `x == null`; likewise `isString`, `isNumber`, `isArray`, `isObject`, `isFunction`.
- **Reactivity conventions** — `shallowRef` for primitives, `ref` for objects/arrays,
  `toRef` for derived values (the default), `computed` only to cache expensive work.
- **Path alias** — import package internals via `#v0/` (`#v0/utilities`, `#v0/types`,
  `#v0/composables`, `#v0/constants/globals`), never relative paths across the package.
- **SSR safety** — use `IN_BROWSER` and the `SUPPORTS_*` constants from
  `#v0/constants/globals` instead of hand-written `typeof window !== 'undefined'` checks.
- **Types** — zero `any`; prefer `unknown` for genuine unknowns. Reuse `#v0/types`
  (`ID`, `Extensible`, `MaybeArray`, `DeepPartial`, `Activation`) before inventing new ones.
- **Naming** — single-word names where possible; `index` not `idx`; `on<Action>` not
  `handle<Action>` (`onClick`, `onSubmit`); function declarations over `const` arrow
  functions; no comma-separated declarations (`let a = 1, b = 2` is wrong).
- **Vue SFCs** — `<script setup lang="ts">` (setup before lang); with generics
  `<script lang="ts" setup generic="T">`. Props via destructuring with defaults, never
  `withDefaults`. Template refs via `useTemplateRef`.
- **Reuse before building** — a primitive that already exists (selection, validation,
  registries, virtual scroll, popovers, focus, breakpoints, theming) must be extended or
  composed, not reimplemented. Flag reinvention.

## Decision table — reach for these first

Check this table **before writing custom logic**. Match by problem, not by keyword.

| Problem | Use | Category |
|---|---|---|
| Single-choice state (tabs, theme picker) | `createSingle` | selection |
| Multi-choice state (filters, tag pickers) | `createSelection` | selection |
| Select-all with tri-state | `createGroup` | selection |
| Tree / nested selection (treeview, menus) | `createNested` | selection |
| Wizard / carousel step tracking | `createStep` | selection |
| Id-based value store (shared across sub-components) | `createModel` | selection |
| Form with async validation + dirty tracking | `createForm` + `createValidation` | forms |
| Slider / range / knob state | `createSlider` | forms |
| Autocomplete / combobox | `createCombobox` | forms |
| Spin-button numeric input | `createNumberField` / `createNumeric` | forms |
| One-time-password / verification-code value | `createOtp` | forms |
| Paginated or virtualized list | `createPagination`, `createVirtual` | data |
| Sortable / filterable table | `createDataTable`, `createFilter` | data |
| Breadcrumb trail derived from route | `createBreadcrumbs` | utilities |
| Overflow / responsive menu (hides overflowing items) | `createOverflow` | utilities |
| Type-safe provide/inject | `createContext` | foundation |
| Reactive registry of ids → values | `createRegistry` | registration |
| Auto-dismissing queue (snackbars, toasts) | `createQueue` | registration |
| Scheduled events over time (timeline, animation) | `createTimeline` | registration |
| Design-token graph (theme, spacing scales) | `createTokens` | registration |
| Floating UI positioning (popover, tooltip, menu) | `usePopover` | system |
| Enter/leave animation orchestration | `usePresence` | system |
| Roving tabindex (list, menubar) | `useRovingFocus` | system |
| Virtual focus (combobox listbox) | `useVirtualFocus` | system |
| Click outside / keyboard shortcut / event listener | `useClickOutside`, `useHotkey`, `useEventListener` | system |
| ResizeObserver / IntersectionObserver / MutationObserver | `useResizeObserver`, etc. | system |
| rAF loop or setTimeout with pause/resume | `useRaf`, `useTimer` | system |
| Responsive breakpoints | `useBreakpoints`, `useMediaQuery` | plugins |
| Localized strings + date/number format | `useLocale`, `useDate` | plugins |
| Theme (light/dark/custom palette) | `useTheme` | plugins |
| RTL direction awareness | `useRtl` | plugins |
| z-index stacking for overlays | `useStack` | plugins |
| Notifications / snackbar queue plugin | `useNotifications` | plugins |
| Feature flags / permission checks | `useFeatures`, `usePermissions` | plugins |
| Persisted state (localStorage / sessionStorage) | `useStorage` | plugins |
| Structured logging with adapters | `useLogger` | plugins |
| SSR-safe mount detection | `useHydration` | plugins |

## PHILOSOPHY section map

`packages/0/PHILOSOPHY.md` is the architectural source of truth. Before judging an
architectural or API-shape question, read the relevant section (repo read access is
available at review time):

- **§1 Identity** — headless, WAI-ARIA-compliant primitives; what v0 is and is not.
- **§2 Axioms** — the non-negotiable principles the design rests on.
- **§3 API shape** — return conventions (the trinity pattern), option shapes, naming.
- **§4 Reactivity model** — ref/shallowRef/toRef/computed rules; `reactive:true` scope.
- **§5 Headless contract** — the styling/behavior boundary in detail.
- **§6 Registries & context** — `createRegistry`/`createContext`, tickets, `register`/`onboard`.
- **§7 Events & lifecycle** — where DOM events and lifecycle hooks are allowed to live.
- **§8 Types** — type-level conventions and the shared type vocabulary.
- **§9 Errors & invariants** — `V0Error`, dev-guard warnings, invariant enforcement.
- **§10 Anti-patterns appendix** — catalogued mistakes; check a suspicious diff here.
- **Appendix A** — section quick-reference index.

## Rules files (`.claude/rules/`)

Path-scoped standards. Read the ones matching the touched paths before reviewing:

- **`implementation.md`** — patterns for all `packages/0/src/**` source.
- **`composables.md`** — architecture for `packages/0/src/composables/**`.
- **`components.md`** — architecture for `packages/0/src/components/**`.
- **`testing.md`** — standards for `*.test.ts` and `*.browser.test.ts`.
- **`benchmarks.md`** — standards for `*.bench.ts`.
- **`docs.md`** — architecture for `apps/docs/**` pages and examples.
- **`new-feature-checklist.md`** — required files/tables when adding a component or composable.

## Layering

`@vuetify/v0` (headless logic, incl. styling primitives) → design systems → Vuetify 4.
Keep concerns at their layer: styling questions are design-system questions, not v0 questions.
`apps/playground` is a v0 consumer.
