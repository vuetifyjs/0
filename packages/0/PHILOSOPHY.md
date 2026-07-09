# @vuetify/v0 — Philosophy

The cross-cutting design philosophy that governs `packages/0/src/`. Non-negotiable axioms, return-shape conventions, reactivity rules, and operational definitions of "headless" live here. Tactical per-scope playbooks live in `.claude/rules/*.md` and cite back to the section numbers below.

This file codifies *why*. Rules files codify *how* for one scope. If a rule appears in both layers, the statement belongs here and the rule file cites the section.

---

## 1. Identity

v0 is a **headless meta-framework for building UI libraries** — a set of Vue 3 composables and components that ship behavior, state, and accessibility plumbing with zero visual opinion. It is not a component library in the usual sense: you do not install v0 to paint a button. You install v0 to *build* the button that your design system paints.

### What v0 is

- A layer of Vue 3 composables (~73) and compound components (~40) that encode interaction patterns, selection state, registries, accessibility contracts, keyboard navigation, focus management, SSR safety, and adapter-backed plugin state.
- The bottom of a four-layer stack: **v0 → Paper → Design Systems → Vuetify**. v0 handles logic *and the headless token substrate* — theme state (`useTheme`), design tokens (`createTokens`), palettes-as-data (`src/palettes/`), and color/contrast math (`apca`); Paper consumes that substrate and handles styling *application* (`useColor`, `useContrast`); design systems (Emerald, Helix, etc.) compose Paper into complete frameworks; Vuetify 4 is one such consumer. [intent:295, intent:296, intent:297, intent:298]
- Zero runtime dependencies on UI styling. No Tailwind, no UnoCSS, no Vuetify classes inside `packages/0/src/`. [intent:82, intent:278]
- WAI-ARIA correct by default. Every interactive component ships `role`, `aria-*`, keyboard handlers, and `aria-disabled` semantics. [intent:174, intent:178]
- Headless in the operational sense: consumers can replicate every visible behavior by writing CSS against the data attributes v0 exposes. [intent:281]

### What v0 is not

- Not a component library. No skin, no CSS, no *applied* styling. (v0 ships headless theme *state* and token *data*, but never paints — see below.) Icons belong to Paper, not v0. [intent:299]
- Not a framework wrapper. Composables are not thin wrappers around `vue-i18n`, `date-fns`, or `pino` — those ship as adapters. [intent:107, intent:145]
- Not a styling *application* layer. v0 owns the headless substrate — theme state, design tokens, palettes-as-data, and color/contrast math (`useTheme`, `createTokens`, `src/palettes/`, `apca`) — but never turns a token into a rendered pixel. Applying tokens to visible color is Paper's job. [intent:297]

### Audience

v0 is aimed at **every level** — beginner, intermediate, and advanced — and the tooling reflects that:

- **Beginners** consume components through the pre-wired default modes (the `Checkbox` just works; the `Dialog` just opens). Docs pages carry `features.level: 1` or `2` so a newcomer can filter the site to pages they can read without Vue internals knowledge.
- **Intermediate** consumers reach past the default to `v-slot`, compound sub-components, and the `attrs` object. Most docs pages live at `features.level: 2`.
- **Advanced** consumers build frameworks on top of v0 — instantiating `createRegistry` directly, extending `createSelection`, authoring adapters. Level-3 pages expose the internals they need. Meta-framework authors and design-system teams are the *deepest* audience, but not the only audience. [intent:209, intent:210, intent:212, user-feedback:2026-04-20]

The "not aimed at ease-of-first-use" framing is wrong. v0 aims to be the headless UI library where a beginner can drop in `Checkbox.Root`, an intermediate user can compose `Checkbox.Root` + `Checkbox.Input` + `Checkbox.Label`, and an advanced user can write a new `ToggleGroupAdapter` — all against the same package.

### Vapor compatibility

v0 targets compatibility with **Vue Vapor mode** — Vue's compiler-optimized runtime that ships without the virtual DOM. Consequences for v0 source:

- Prefer `shallowRef`/`toRef` over deep reactivity — Vapor leans harder on fine-grained reactivity. [intent:125, intent:128]
- Avoid runtime component metaprogramming that depends on the vdom (`h()` tricks, `render()` hand-rolls, dynamic component trees built from vnodes).
- Keep template syntax conventional — `<component :is>`, slots, and `defineSlots<T>` all compile under Vapor; bespoke JSX constructions may not.
- Every composable that works today on classic Vue must keep working on Vapor. If a new feature requires a vdom-only API, flag it in its design doc and discuss before merging.

This is a forward compatibility target, not a ship-today constraint — but every new abstraction should pass the mental test "does this depend on the virtual DOM?" before landing. [user-feedback:2026-04-20]

### Mission

> "v0 aims to be the most comprehensive headless UI library, surpassing Radix, Base UI, Ark UI, Reka UI, and React Aria." [intent:301]

Scope is set accordingly: ~83 planned components. Breadth plus WAI-ARIA rigor plus Vue-idiomatic ergonomics is the differentiator. Any axiom that weakens any of those three is suspect.

---

## 2. Axioms

Non-negotiable. Each axiom carries a statement, a rationale, and a concrete anti-example or canonical-example from `packages/0/src/`. Violations are correctness bugs, not style nits.

### 2.1 Headless contract is absolute

**Statement.** No utility classes, no CSS framework references, no typography, no spacing in `packages/0/src/`. Color *values* appear only as headless token data (`src/palettes/`, consumed via `createTokens`) — never applied to a rendered element. Styling is the consumer's responsibility. [intent:82, intent:278, intent:203]

**Why.** v0 sits at the bottom of the stack. A single `class="px-4"` anywhere in source binds every downstream design system to UnoCSS defaults and breaks the promise that design systems can paint v0 with their own tokens. "Headless" that ships even one utility class is not headless.

**Operational definition.** Consumers must be able to replicate every visible behavior by writing CSS against the data attributes v0 emits. Acid test: "If I stripped every stylesheet from the consuming app, would v0's components still function and announce their state correctly to a screen reader?" [intent:281]

**Canonical example.** `packages/0/src/components/Splitter/SplitterRoot.vue:373-376` — inline `:style="[..., { display: 'flex', flexDirection: '...' }]"`. Structural layout, no visual opinion.

**Allowed.** Structural inline `:style` bindings when layout cannot work otherwise (flex directions, CSS custom properties for depth, visually-hidden positioning for hidden inputs, z-index from `useStack`). [intent:279]

**Encouraged.** Data attributes for every state (`data-state`, `data-layer`, `data-disabled`, `data-orientation`). These are the consumer's styling hooks. [intent:280]

**Anti-example.** Grep `class="(flex|px-|py-|bg-|text-|w-|h-|m-|gap-|grid)"` across `packages/0/src/**/*.vue` currently returns zero hits. Keep it that way. The single JSDoc example in `packages/0/src/components/Radio/RadioRoot.vue:176` is prose, not rendered.

---

### 2.2 Zero `any`

**Statement.** No `: any`, no `as any`, no `<any>` in `packages/0/src/`. `unknown` when the type genuinely cannot be inferred. [intent:78, intent:79]

**Why.** `any` silently disables type-checking downstream. A single `as any` in a composable propagates into every consumer that spreads it. `unknown` forces the consumer to narrow, which is the correct contract.

**Current state.** Zero `as any` casts in source. The one place reaching into a foreign private shape — `packages/0/src/components/Locale/Locale.vue:69`, accessing `vue-i18n`'s `_rootT`/`_rootN` — declares those fields on a local `ScopedLocale` interface and uses a typed intersection cast (`parent as typeof parent & ScopedLocale`), so the shape is documented rather than erased. No `: any`, `as any`, or `<any>` in `packages/0/src/` — with one sanctioned exception: the slot-return type in `defineSlots<{ default: (props: SlotProps) => any }>()`, which Volar requires for correct slot inference (see §8.8). That `=> any` types the slot's *return*, never a value or argument, so it disables no downstream checking.

**Anti-example (do not do this).**
```ts
// Wrong — hides the actual shape
function register (input: any): any { ... }
```

**Correct.**
```ts
// Force narrowing at the call site
function register (input: unknown): unknown {
  if (!isObject(input)) return
  // narrowed here
}
```

---

### 2.3 Utility guards over raw comparisons

**Statement.** Use `#v0/utilities` type guards. Never raw `=== undefined`, `=== null`, `== null`. [intent:31, intent:32, intent:33, intent:34, intent:35]

**Why.** Guards are grep-able, tree-shakeable, and their names document intent. `x === null` reads as a value comparison; `isNull(x)` reads as a type assertion. Raw comparisons also leak into TypeScript's narrowing in subtle ways the guards handle correctly.

**Exceptions.** `packages/0/src/utilities/helpers.ts` defines the guards themselves and must use primitive comparisons at its root. This is the only file that gets to.

**Anti-example.** `every(t => t.readAt !== null)` — a raw `!== null` comparison; the guard form is `every(t => !isNull(t.readAt))`. Both source-code and JSDoc `@example` comparisons across `packages/0/src/` are clean as of this writing.

**Canonical example.** `packages/0/src/composables/createDataTable/index.ts` — guard calls only (`isNullOrUndefined`), zero raw comparisons. For a denser exemplar (~10 guard calls across `isNullOrUndefined`/`isString`/`isNumber`/`isObject`/`isArray`) see `createDataTable/adapters/adapter.ts` or `composables/createNested/index.ts`.

---

### 2.4 Path alias, never relative cross-feature

**Statement.** Cross-feature imports use `#v0/` exclusively. Only sibling imports (`./X`) are allowed, and only inside a feature directory (adapters importing their parent, compound components importing their Root). [intent:73, intent:113]

**Why.** Relative chains break under refactor, hide dependency shape from graph tools, and make test isolation fragile. `#v0/` is a contract: "this symbol is public under this path."

**Current state.** Zero `../..` imports anywhere in `packages/0/src/`. Nine `../X` imports exist; every one is adapter-to-parent-feature and expected.

**Canonical example.**
```ts
// Right
import { IN_BROWSER } from '#v0/constants/globals'
import { createRegistry } from '#v0/composables'
import { isObject } from '#v0/utilities'

// Wrong (from inside composables/useFoo/)
import { createRegistry } from '../createRegistry'
```

---

### 2.5 Composables never reach into the consumer's element tree

**Statement.** Composables expose state and methods; components bind those to DOM events. The dividing line is *how a composable obtains its target*, not which file the event word appears in. A composable must never create an element, query the DOM for one, or implicitly pick a rendered node — those are `.vue` concerns. `blur`, `input`, `change`, `wheel` on component-owned inputs appear only in `.vue` files. [intent:262, intent:263, intent:264]

**Why.** Event binding is a problem only when it couples a composable to a tree it does not own. A composable that `querySelector`s its target, or binds to an element it rendered, picks the tree for you; one that exposes `onKeydown(event)`, or binds via `useEventListener` to a target the consumer *injects*, does not. The first couples; the second composes.

**Allowed.** Two boundaries own listeners legitimately:

- The browser-primitive composables whose entire purpose is to wrap a listener or matched-media observer: `useEventListener`, `useHotkey`, `useClickOutside`, `useMediaQuery`.
- System composables that compose those primitives against an **explicitly injected** `MaybeRefOrGetter<EventTarget>` target, or a global (`document` / `window`) for session-scoped behavior. `useRovingFocus` and `useVirtualFocus` bind `keydown` to an injected container ref; `useDragDrop` adapters bind `pointer*` to `document`; `useStorage` listens for `storage` on `window`. The consumer supplies (or globally scopes) the target, so no tree is stolen — consistent with §5.2's `MaybeRefOrGetter<EventTarget>` input contract.

**Anti-example (do not introduce).** A `createSlider` that calls `document.querySelector('.thumb')` (or renders and binds its own element) to attach `pointermove`. The correct shape exposes `onPointerdown`, `onPointermove`, `onPointerup` and the `SliderThumb.vue` component wires them — or, if it must own the listener, takes the thumb element as an injected `MaybeRefOrGetter<EventTarget>` rather than finding it.

---

### 2.6 Never override — spread and extend

**Statement.** Composable extension happens by `{ ...parent, newProperty }`. Never redefine a property the parent already exposed. [intent:101, intent:142, intent:147]

**Why.** Spread guarantees the child remains substitutable for the parent in types. The registry-based composables all compose this way; consumers who hold a reference to the parent type can upgrade to the child type without refactoring call sites. Spread copies accessors by value — a parent's `get size ()` arrives as a data property frozen at spread time — so any accessor the child surface needs must be re-declared after the spread (`get size () { return model.size }`).

**Canonical example.** `packages/0/src/composables/createSelection/index.ts:299-312` — spreads `createModel`, adds `multiple`, `toggle`, `apply`, `mandate`.

```ts
return {
  ...model,
  multiple,
  register,
  onboard,
  unselect,
  toggle,
  apply,
  mandate,
  // ...
}
```

---

### 2.7 Tree-shakeable utilities, marked

**Statement.** All utilities carry `#__NO_SIDE_EFFECTS__`. No top-level side effects in `packages/0/src/utilities/**`. [intent:95]

**Why.** Consumers import from a flat barrel. Without the marker, bundlers retain every utility the barrel touches. Meta-frameworks with 73 composables and 40 components cannot afford a lazy barrel.

**Canonical example.** `packages/0/src/utilities/helpers.ts:32,49,69,87,113,138,156,174,194,219` — every exported guard carries the comment directly above the function declaration.

```ts
// packages/0/src/utilities/helpers.ts:32-35
/* #__NO_SIDE_EFFECTS__ */
export function isFunction (item: unknown): item is Function {
  return typeof item === 'function'
}
```

**Complementary marker — `/* @__PURE__ */` on module-level allocations.** `#__NO_SIDE_EFFECTS__` covers exported functions. The complementary marker `/* @__PURE__ */` covers *module-level call expressions* whose return value is bound to a constant — `new Set([...])`, `new Map([...])`, factory calls. Without it, bundlers cannot prove the allocation is side-effect-free and retain the binding even when nothing imports it. See `packages/0/src/utilities/helpers.ts:312` (`UNSAFE_KEYS = /* @__PURE__ */ new Set([...])`) and the `INSTANCE_KEY` literal in `utilities/instance.ts` for the placement convention. New module-level `new`/factory allocations (`new Set`, `new Map`, factory calls) inside `packages/0/src/utilities/**` carry `/* @__PURE__ */`; exported functions carry `/* #__NO_SIDE_EFFECTS__ */`. Plain object/array literal initializers (e.g. `const BLACK: RGB = { r: 0, g: 0, b: 0 }` in `apca.ts`) are pure by default and need no marker. Elsewhere in `packages/0/src/`, the marker is a hygiene recommendation rather than a hard rule, but the same logic applies to any allocation a bundler would otherwise pin.

**Anti-example (do not do this).**
```ts
// Wrong — top-level side effect + missing marker. Bundlers must retain this file
// whenever any other symbol in the barrel is imported.
const cache = new Map<string, number>()
cache.set('default', 0)          // top-level side effect

export function isFoo (x: unknown): boolean {
  return cache.has(String(x))
}
```

```ts
// Wrong — pure, but no marker. Bundlers cannot prove the call is side-effect-free
// without the annotation, and retain it from the barrel defensively.
export function isBar (x: unknown): boolean {
  return typeof x === 'object' && x !== null
}
```

---

### 2.8 ID generation is centralized

**Statement.** Always use `useId()` from `#v0/utilities`. Never auto-increment, never `Math.random()`, never `Date.now()`. [intent:151]

**Why.** `useId()` is SSR-safe and delegates to Vue's native `useId` inside components, with a counter fallback outside. Ad-hoc ID generation breaks hydration and duplicates across registries.

**Anti-example (do not do this).**
```ts
// Wrong — module-scoped counter. Two independent server renders share state,
// so ID `foo-1` lands on different components on different requests. Hydration
// mismatch on every client boot.
let nextId = 0
function register () {
  return { id: `foo-${++nextId}` }
}

// Wrong — Math.random(). Collides under load, non-deterministic, SSR-unstable.
function register () {
  return { id: `foo-${Math.random().toString(36).slice(2)}` }
}

// Wrong — Date.now(). Same millisecond = same ID.
function register () {
  return { id: `foo-${Date.now()}` }
}
```

**Correct.** See §10.18 for the canonical `useId()` replacement.

---

### 2.9 Errors throw; data integrity warns; runtime returns

**Statement.** Three-way split. Missing required context throws. Data integrity violations warn through `useLogger()`. Runtime logic (disabled, not found, early-exit) silently returns. [intent:135, intent:136, intent:137, intent:138]

**Why.** A throw is a bug; a warn is a sign the consumer wired something unexpected; a silent return is a valid runtime branch. Conflating them either spams the console with recoverable conditions or silently hides programmer errors.

**Anti-example (do not do this).**
```ts
// Wrong — silent swallow of a real bug
function useFoo () {
  const ctx = inject(key)
  return ctx ?? { /* fake shape */ }
}
```

**Correct.**
```ts
// Right — throw on missing required context
function useFoo () {
  const ctx = inject(key)
  if (isUndefined(ctx)) {
    throw new V0Error('useFoo must be called within FooProvider', {
      code: 'V0_CONTEXT_MISSING',
      key,
    })
  }
  return ctx
}
```

Bare `Error` is forbidden in `packages/0/src` source by the `vuetify/no-bare-error-throw` ESLint config (a `no-restricted-syntax` rule over `packages/0/src/**/*.ts`). Throw a `V0Error` (`packages/0/src/utilities/errors.ts`) with a code from `V0ErrorDetails` (`packages/0/src/types/index.ts`) instead — see `createContext` for the canonical form.

---

### 2.10 SSR-safe by default

**Statement.** Any code touching `window`, `document`, `matchMedia`, observers, or storage must gate on `IN_BROWSER` from `#v0/constants/globals`. [intent:71, intent:110, intent:111, intent:112]

**Why.** v0 runs under SSR. An unguarded `window.x` crashes the server build. The gate is one line and composes through adapters.

**Canonical example.** `packages/0/src/composables/useStorage/index.ts:115` — `IN_BROWSER ? window.localStorage : new MemoryStorageAdapter()`.

---

## 3. API shape

### 3.1 Return conventions

Three allowable return shapes, in order of prevalence:

**3.1.1 Plain object.** The dominant shape. Used by ~61 of 73 composable directories. Returned from every selection, registry, model, data, and browser composable that is not a trinity builder itself.

```ts
// packages/0/src/composables/createSelection/index.ts:299
return {
  ...model,
  multiple,
  register,
  onboard,
  // ...
}
```

**3.1.2 Trinity tuple.** `[useX, provideX, defaultX] as const` (registries) or `[createXContext, createXPlugin, useX] as const` (plugins). Returned from exactly two foundation factories: `createTrinity` and `createPluginContext`. (`createPlugin` itself returns a Vue plugin *object*, not the tuple; `createPluginContext` is the tuple-returning factory.) `createContext` returns the `[useX, provideX]` pair that `createTrinity` consumes and extends into the trinity. Every other "trinity-using" composable *consumes* these internally and returns a plain object. [intent:80, intent:119, intent:120]

```ts
// packages/0/src/composables/createTrinity/index.ts:100-104
return [
  keyOrUseContext,
  (_context: Z = context, app?: App): Z => provideContext(_context, app),
  context,
] as const
```

**3.1.3 Single value / function.** Pass-through transformers and event composables:
- `useEventListener` → cleanup `stop: () => void`
- `toArray`, `toElement`, `toReactive` → value or proxy
- `useRaf` → augmented function via `Object.assign`

Choose 3.1.3 only when there is literally one useful return. Any time you reach for a tuple other than a trinity, switch to a plain object with named keys.

### 3.2 Argument ordering

- **Positional required input first**, then `options` object. `createFoo(required, options?)`.
- **Options object is destructured inside the factory** using literal defaults, never `withDefaults`. [intent:9]
- **Rest variable is named `options`** when destructuring — not `modelOptions`, not `registryOptions`. [intent:287]

```ts
// Right
function createSelection <Z, E> (_options: SelectionOptions = {}): SelectionContext<Z, E> {
  const { multiple, mandatory, ...options } = _options
  const model = createModel(options)
  // ...
}
```

### 3.3 Naming

- **`on<Action>`** for handlers. `onClick`, `onSubmit`, `onSave`. Never `handle<Action>`. [intent:6] Zero violations in source.
- **`index`** for numeric positions. Never `idx`. [intent:5] Zero violations in source.
- **Single-word preference.** Prefer `side` over `previewRight`, `left` over `leftOpen`, `onSide` over `onTogglePreviewPosition`. Multi-word is allowed when single-word is genuinely ambiguous. [intent:7] This applies to composable internals, component locals, and exposed methods alike.
- **`is<State>`** for boolean slot props. `isDisabled`, `isSelected`, `isOpen`. [intent:167]
- **`create`** prefix for stateful factories. **`use`** prefix for DI consumers, browser wrappers, lifecycle hooks. **`to`** prefix for pure stateless transformers. [intent:116, intent:117, intent:118]
- **`FooTicketInput` → `FooTicket`** pair for registry input/output types. [intent:97]
- **Function declarations**, not `const foo = () => ...`. [intent:4]
- **Underscore-prefixed prop mirror — the short name follows the value, not the prop.** When a component holds both a raw prop and a derived local for the same concept, the short name belongs to whichever one the template binds and the logic treats as the prop's effective value; the other takes `_`. A value bound to the template never carries `_` without an explicit reason — the same-name shorthand (`:name`) depends on it, and the underscore is needless cognitive overhead on the variable you read most. Never `nameProp`, never `propName`. [user-feedback:2026-04-20]

  **Resolve-then-bind** — the component resolves a prop against a fallback and binds the result, so the *resolved value* owns the short name and the raw `defineProps` binding takes `_` (Vue 3.5 reactive destructure stays reactive through the rename):

```ts
// Right — resolved value is the source of truth; the raw prop is one input
const { name: _name, form: _form } = defineProps<HiddenInputProps>()
const name = toRef(() => _name ?? root.name)
const form = toRef(() => _form ?? root.form)
// template binds <input :name :form> — same-name shorthand intact
```

  **Reactive wrapper** — the prop itself is the value the template binds, and the local only exists to hand a reactive ref to a composable, so the *prop* keeps the short name and the wrapper takes `_`:

```ts
// Right — `size` is bound directly; `_size` is the ref passed onward
const { size = 'medium' } = defineProps<{ size?: 'small' | 'medium' | 'large' }>()
const _size = toRef(() => size)

// Wrong — leaks "this is a prop" into every call site
const sizeProp = toRef(() => size)
const propSize = toRef(() => size)
```

A prop used directly (no twin local) just keeps its short name — `SliderRoot`'s `readonly`, `SplitterPanel`'s `maxSize`. The `_` is only for disambiguating a genuine raw-prop / resolved-value pair.

### 3.4 No `withDefaults`

`withDefaults(defineProps<T>(), { ... })` is banned. [intent:9] Use destructuring with inline defaults on `defineProps<T>()` directly. There is no case in `packages/0/src/` where `withDefaults` is correct.

```ts
// Right
const {
  color = 'primary',
  size = 'medium',
} = defineProps<{ color?: string, size?: string }>()

// Wrong
const props = withDefaults(defineProps<{ color?: string, size?: string }>(), {
  color: 'primary',
  size: 'medium',
})
```

Why: destructuring defaults compose cleanly with Vapor mode and keep the prop surface declaration in one place. `withDefaults` splits the type surface from the runtime default, forces an extra macro call per component, and was superseded by reactive prop destructuring in Vue 3.5. Also see §10.6.

### 3.5 Slot conventions

All interactive components emit one slot, default, bound via `<slot v-bind="slotProps" />`. `slotProps` is a `toRef` with two shapes of content:

- **Boolean state fields** named `is<State>`: `isDisabled`, `isSelected`, `isOpen`, `isMixed`, etc.
- **An `attrs` object** containing ARIA attributes, data attributes, and event handlers, pre-merged via `mergeProps`. [intent:168, intent:169, intent:170]

Slot props are always computed through `toRef`, never inline and never through `computed` unless the shape is legitimately expensive. [intent:169]

Consumers in **non-renderless** components must not spread `attrs` onto a child — the handlers are already bound to the outer `<Atom>`. Spreading doubles the event. The rule is enforced in examples and lives in the docs rules file. [intent:189, intent:206, intent:207]

### 3.6 Boolean data attributes

Data attributes are always `true | undefined` (or the equivalent `'' | undefined`), never `true | false`. Undefined removes the attribute from DOM. [intent:172]

`aria-disabled` is the exception: always `boolean`, so assistive tech reads a concrete value. [intent:175]

### 3.7 Comments: why, not what

No superfluous comments. A comment should explain *why* something is done, not repeat *what* the code already says. Comments that restate the next line add noise, go stale fast, and distract from the signal. [user-feedback:2026-04-20]

```ts
// Wrong — restates the code
// increment the counter
count.value++

// Wrong — paraphrases the guard
// if registry is empty, return
if (!registry.size) return

// Right — explains a non-obvious choice
// shallowReadonly keeps ref identity stable for watch() consumers.
// readonly() would clone on every update and break equality checks.
return shallowReadonly(state)

// Right — documents a browser quirk that's not inferrable from the code
// Safari fires `keydown` before `input` for composition events;
// defer the check until after nextTick() so composition text is committed.
await nextTick()
```

The exception is JSDoc blocks on exported APIs (see §3 Return conventions, §2.7 tree-shakeable markers). Those describe contract, not code.

---

## 4. Reactivity model

### 4.1 Primitive selection

The choice is **data shape × mutation scope**:

| Primitive | Data shape | Mutation scope | Use for |
|-----------|------------|----------------|---------|
| `shallowRef(value)` | Primitive or opaque reference | Replace only (`.value = new`) | Booleans, numbers, strings, Dates, custom classes, module instances. [intent:10, intent:125] |
| `ref(value)` | Object/array with nested fields | Deep mutation tracked | Nested config trees, arrays that are `push/splice`'d in place. [intent:11, intent:129] |
| `shallowReactive(obj)` | Object/set with top-level fields | Top-level mutation tracked, nested ignored | `shallowReactive(new Set())` for mutable ID collections inside registries. [intent:102, intent:126] |
| `reactive(obj)` | Deeply-nested object | Deep mutation tracked | **Rare.** Only when consumers must mutate nested fields and we cannot hand them a ref. Prefer `ref()` on the owner, `toRef(() => root.field)` for read-only access by subtrees. |
| `toRef(() => expr)` | Derivation | Read-through (no cache) | Default for derivations — property access, booleans, ternaries, cheap composition. [intent:12, intent:37, intent:128] |
| `computed(() => expr)` | Derivation | Cached until deps change | Only when the work is expensive: filtering, mapping, aggregation. [intent:38, intent:127] |
| `readonly(obj)` / `shallowReadonly(ref)` | Any | Freezes writes | Plugin singletons and boundary-exposed state. [intent:130, intent:131] |

The default is `toRef`. Reach for `computed` only when you would otherwise pay the same cost on every read. This keeps the mental model simple: "`toRef` is a getter, `computed` is a getter that remembers."

**Pick rule for object-shaped state.**

- If the object is **owned by the composable** and consumers mutate nested fields: `ref({...})`.
- If the object is **owned by the composable** and consumers only read nested fields: `ref({...})` wrapped in `readonly()` at the boundary.
- If the object is **a flat collection** (Set, Map, or record of simple keys) that the composable mutates top-level only: `shallowReactive(new Set())`. This is the registry shape. [intent:102]
- If you find yourself reaching for `reactive({...})`, stop. v0 uses `ref()` + destructured reads, not `reactive()`, for owned state. The two deliberate exceptions in source are `useProxyRegistry` — whose returned proxy object is itself built with `reactive(...)`, and which additionally `reactive()`-wraps ticket values when the caller opts into `{ deep: true }` — and `toReactive`, a pure transformer whose entire contract is "unwrap a `Ref<T>` into a `reactive`-style proxy." Both are deliberate carve-outs, not the pattern.

### 4.2 Readonly at boundaries

**Rule.** Registry collections stay mutable. Anything exposed to consumers through a plugin singleton gets a readonly wrapper. [intent:131]

**Canonical form.** `shallowReadonly(state)` or `readonly(state)` for scalar state (interchangeable on a primitive `shallowRef`), `readonly(registry)` for deep collections.

**The `Readonly<Ref<T>>` return-type pattern.** When a composable exposes a ref to consumers and does NOT want them to write to it, the returned interface types the field as `Readonly<Ref<T>>`. The type is load-bearing — consumers read it as a promise ("you cannot write this") and IDEs flag `.value = ...` as a type error. Wrapping with `shallowReadonly()` at runtime reinforces the same contract. [intent:252]

```ts
// Right — boundary contract clear from both value and type
export interface BreakpointsContext {
  width: Readonly<ShallowRef<number>>
  height: Readonly<ShallowRef<number>>
  isMobile: Readonly<ShallowRef<boolean>>
}

function useBreakpoints (): BreakpointsContext {
  const width = shallowRef(window.innerWidth)
  const height = shallowRef(window.innerHeight)
  const isMobile = shallowRef(width.value < 768)
  // width/height/isMobile are kept in sync inside a resize handler
  return {
    width: readonly(width),
    height: readonly(height),
    isMobile: readonly(isMobile),
  }
}
```

Always use `.value` when reading these in templates. Never rely on Vue's auto-unwrap when the ref is inside a destructured context — the wrapper doesn't preserve ref identity through spread. [intent:252]

**Intentional mutable returns.** Some composables return *mutable* refs by design because the consumer is expected to write to them. The return interface types them as `ShallowRef<T>` (or `Ref<T>`) so the write contract is visible at the type level:

- `packages/0/src/composables/useTimer/index.ts:68,70,72` — `remaining`, `isActive`, `isPaused` typed as `ShallowRef<...>` in `TimerContext`. Consumers pause and resume by writing.
- `packages/0/src/composables/usePopover/index.ts:58` — `isOpen: Ref<boolean>` for v-model bidirectional binding.
- `packages/0/src/composables/createInput/index.ts:90,94,98` — `value`, `isFocused`, `isTouched` mutable so bound components can write; `isDirty` / `isPristine` are `Readonly<Ref<boolean>>` (do not write).

**Audit (resolved).** `useRovingFocus` and `createFocusTraversal` each expose a single consumer-visible ref (`focusedId` / `activeId`), both declared `ShallowRef<ID | undefined>` in their return interface (`RovingFocusReturn` / `TraversalReturn`). These are intentionally mutable — consumers set focus by writing the ref — so the `ShallowRef<T>` type is the correct contract; no `shallowReadonly` boundary wrapper is required. (Design note: writing the ref directly bypasses the internal `applyFocus()` DOM-focus side-effect; switch to `Readonly<Ref>` + a `focus()` method if direct writes should be disallowed.)

**Resolution rule.** Any mutable return at a boundary must be intentional and declared in the return interface. If the type says `ShallowRef<boolean>`, the contract is "you can write this." If the type says `Readonly<Ref<boolean>>`, the contract is "do not write this." The type is load-bearing — a `shallowReadonly` wrapper on the value without updating the type is useless; a `ShallowRef<T>` type on a value nobody should mutate is a leak. [intent:252]

### 4.3 `MaybeRefOrGetter<T>` at composable inputs

**Rule.** When a composable accepts a value that may come from either a plain static value, a `Ref<T>`, or a getter `() => T`, type it as `MaybeRefOrGetter<T>` and read it via `toValue()`. This single pattern covers both eager and reactive callers without branching inside the composable. [intent:132, intent:134]

```ts
// Right
export interface UseFooOptions {
  disabled?: MaybeRefOrGetter<boolean>
  source?: MaybeRefOrGetter<string[]>
}

function useFoo (options: UseFooOptions = {}) {
  const disabled = toRef(() => toValue(options.disabled) ?? false)
  const source = toRef(() => toValue(options.source) ?? [])
  // `disabled` and `source` work identically whether the consumer passed
  // a raw value, a ref, or a getter.
}
```

**Apply to.** Any reactive option the caller will want to drive from reactive state upstream — `disabled`, `readonly`, filter keys, search queries, ticket config inputs.

**Do not apply to.** Configuration that is fixed at construction time — `namespace`, `events`, `adapter`. Those stay plain `T`. [intent:133]

**Caller side — forwarding a destructured prop.** When a component forwards a destructured prop into a `MaybeRefOrGetter<T>` parameter, wrap it as a getter — `gap: () => gap` — never pass the value directly. With Vue 3.5+ reactive props destructure, `gap` *is* reactive when read inside a getter, but reading it inline at object-literal construction captures the value once and `toValue()` will return that snapshot forever after.

```ts
// Wrong — gap captured at setup time, prop changes never propagate
createOverflow({ gap })

// Right — toValue() inside the composable re-reads the getter on every recompute
createOverflow({ gap: () => gap })
```

`packages/0/src/components/Overflow/OverflowRoot.vue` is the canonical worked example — `container`, `gap`, and `reverse` forwarded as getters; `reserved` is forwarded as a `shallowRef` (`indicatorWidth`), whose stable ref identity needs no getter wrapper.

**Sibling shape — `number | ShallowRef<T>` inputs.** When a composable accepts a value that is already a `ShallowRef<T>` (typically a `defineModel` return), forward the ref directly rather than wrapping it — wrapping an already-a-ref value in `toRef(() => ref)` yields a ref-of-ref. `packages/0/src/components/Pagination/PaginationRoot.vue` forwards the `defineModel` ref `page` via object shorthand (`createPagination({ page })`); `createPagination`'s `page` option is typed `number | ShallowRef<number>` and normalized internally with `isRef(_page) ? _page : shallowRef(_page)` behind a clamping `WritableComputedRef`.

### 4.4 Registry reactivity

`reactive: true` on a registry wraps the internal collection as `shallowReactive` and each registered ticket as a `shallowReactive` proxy. When this option is set, `values()` / `keys()` / `entries()` additionally register a single version dependency — a signal bumped on every structural mutation — so Vue's dep tracking holds across computed re-runs while iteration results stay cached between mutations. A subscribing effect holds one dependency regardless of collection size, and reactive reads cost the same as non-reactive ones. Template iteration, `registry.size` reads, and `get(id)` reads all propagate to consumers. Field patches via `upsert` propagate through the ticket proxies and `update:ticket` — they don't re-notify version subscribers (membership and order are unchanged), though the read cache still refreshes so `useProxyRegistry`-style snapshot consumers observe a fresh array identity. [intent:253]

**The version signal is a scoped exception, not a precedent.** The rule stands: no hand-rolled version counters or dirty flags where Vue's native tracking gives real granularity — `get(id)`, `has()`, `size`, and ticket field reads stay natively tracked. Iteration qualifies because it clears two bars, and any future version-signal proposal must clear both: (1) native tracking was never fine-grained for the read shape — collection iteration is a single `ITERATE`-style dependency in Vue itself, so proxies added per-element cost without adding precision; (2) the bump rides an invalidation choke point the code already maintains (`invalidate()`), so reactivity and cache validity are one invariant, not parallel bookkeeping.

`useProxyRegistry(registry)` (on a registry created with `events: true`) exposes `proxy.values` / `proxy.keys` / `proxy.entries` / `proxy.size` as properties on a reactive object, updated from `register:ticket` / `unregister:ticket` / `update:ticket` / `clear:registry` / `reindex:registry` events. It does not wrap the tickets themselves, and supports `{ deep: true }` for nested tracking. [intent:254]

Both are valid and complementary. Pick based on the consumer's actual need:

| Want | Use |
|---|---|
| Reactive iteration **plus** per-ticket field mutations via `upsert` | `reactive: true` on the registry |
| Reactive iteration without wrapping each ticket in a proxy | `useProxyRegistry(registry)` |
| `{ deep: true }` tracking on registered tickets | `useProxyRegistry(registry, { deep: true })` |
| Explicit event-driven snapshot semantics, no registry-level reactivity | `useProxyRegistry` |
| Unbounded collection iterated only by internal derived computeds | Non-reactive registry + `useProxyRegistry` |

**Unbounded collections.** When the collection is unbounded and iteration is confined to a handful of internal computeds, `reactive: true` pays for a `shallowReactive` proxy per ticket that nothing reads. Don't hand-roll an event-driven version counter either — `useProxyRegistry` *is* that pattern, with `onScopeDispose` cleanup included. Keep the registry non-reactive (`events: true`) and read `proxy.values` / `proxy.size` in the derived computeds instead of raw `registry.values()`. Under this shape `upsert` is the sanctioned mutation path (it emits `update:ticket`, which bumps the proxy); in-place ticket field writes do not propagate. Canonical: `createDataTable`'s row registry — consumers iterate rows through `items` / `allItems`, never raw `table.values()` in a template or computed. The column registry stays `reactive: true` because columns are bounded and consumer-iterated.

Plugins bake one or the other in internally — see `.claude/rules/composables.md` "Plugins and Reactive Defaults" for the convention. Primitives expose the choice to callers.

### 4.5 Scope cleanup contract

- DOM observers and event listeners use `onScopeDispose(cleanup)`. [intent:139]
- Composables that may run outside a Vue setup scope (tests, manual scopes) pass `failSilently`: `onScopeDispose(cleanup, true)` — the `true` suppresses the no-active-scope warning, not a perf/deferred toggle. [intent:140]
- Pure data structures and computed state need no cleanup — Vue's effect scope handles them. [intent:141]
- Conditional cleanup: use `useToggleScope(source, fn)` when side effects should only run while a reactive boolean is true. When the boolean flips false, the entire scope is torn down (watchers stop, event listeners detach, `onScopeDispose` fires) without manual bookkeeping. Canonical: `packages/0/src/composables/useToggleScope/index.ts`.

### 4.6 Vue integration guards

- Needs global/injected context → `instanceExists()` check with fallback. [intent:148]
- Pure utilities → no check, works anywhere. [intent:149]
- Vue framework integration → `hasInjectionContext()` check. [intent:150]

### 4.7 Readonly in templates

v0 composables return `Readonly<Ref<T>>` for boundary-exposed state. Always `.value` when reading in templates. Never rely on auto-unwrap because the wrapper doesn't preserve ref identity through spread. [intent:252] Cross-referenced from §4.2.

---

## 5. Headless contract

### 5.1 Operational definition

> A composable or component is "headless" iff a consumer can replicate every visible behavior by writing CSS against the data attributes it exposes. [intent:281]

This is an acid test, not a vibe. If the only way to get state X to render differently is to modify v0 source, v0 is not headless with respect to X — fix it by exposing a `data-*` attribute.

### 5.2 Composables

- **No DOM creation.** Composables do not `document.createElement`. They accept targets via `MaybeRefOrGetter<EventTarget>`. [intent:99]
- **No visual state.** A composable never cares what color something is. `createRating` tracks a number; `RatingRoot.vue` tracks hover state internally — the composable is value-only. [intent:319, intent:320]
- **No event binding into an owned tree.** Composables expose handlers; components wire them. The exception is system composables that bind via `useEventListener` to an **injected** `MaybeRefOrGetter<EventTarget>` or a global — see §2.5. [intent:262, intent:263]

### 5.3 Components

- **No utility classes.** Zero `class="px-4"`, zero `class="bg-primary"`. [intent:278]
- **Structural-only `:style`.** `display: flex`, `flex-grow`, `visibility`, z-index from `useStack`, CSS custom properties for depth, visually-hidden positioning. If your `:style` sets `color` or `padding`, it is not structural. [intent:279]
- **Data attributes as styling hooks.** `data-state="open"`, `data-disabled`, `data-orientation="vertical"`. Consumers style against these. [intent:280]
- **DOM-rendering Roots use `<Atom :as :renderless>`.** The universal wrapper that lets consumers swap the tag and strip it. Provider / slot-only Roots — `Group`, `Locale`, `Portal`, `Presence`, `Selection`, `Single`, `Step`, `Tabs`, `Treeview` — render only `<slot v-bind="slotProps" />` (or teleport their children) with no `Atom` wrapper, because their DOM is emitted by sub-components or the wrapper would be meaningless. [intent:186, intent:336]

### 5.4 Hidden inputs

Interactive inputs with a `name` prop render a `<ComponentHiddenInput>` for native-form integration. This is the boundary; it is not styling. Two tiers exist, by widget shape: [intent:179, intent:187]

- **Focusable-mirror inputs** (`Checkbox`, `Radio`, `Switch`) — render a real `<input>` marked `inert` with `tabindex="-1"`, JSON-serialized for complex values, hidden via visually-hidden CSS. The mirror carries state the browser must see (checked, value) without stealing focus from the styled control.
- **Value-only inputs** (`Rating`, `Slider`, `Progress`) — render a plain `<input type="hidden">`. There is nothing to focus or announce on the hidden node itself — the visible control owns interaction — so the `inert` / visually-hidden treatment is unnecessary; a native hidden input carries the value to form submission.

### 5.5 Locale-first strings

Every user-facing string (`aria-label`, error messages, day-of-week names, month names) goes through `useLocale()`. The canonical pattern is `locale.ti(key) ?? '<English default>'` — `ti()` ("translate if exists") returns `undefined` for a missing key, where `t()` echoes the raw key back, and the `??` supplies an English fallback for the no-adapter case. Never hardcode a string with no `useLocale` path. Tests assert localizability — either via `toBeDefined()` or by asserting the English default plus a translated-locale value (e.g. Pagination `'Next page'` / `'Nächste Seite'`) — never by pinning a single hardcoded English string as the only expectation. [intent:176, intent:177]

---

## 6. Registries & context

### 6.1 Primitive selection

| Primitive | When |
|-----------|------|
| `createContext` | Subtree DI with a strict key namespace. Returns a `[useX, provideX]` pair or a dynamic-key pair when a `suffix` is passed. [intent:119] |
| `createRegistry` | Indexed ticket store with value-is-index semantics. Foundation for all registered-child patterns. [intent:96] |
| `createTrinity` | Return-tuple builder. Consumes `createContext`; invoked by `createPlugin`. Rarely called directly outside foundation code. [intent:80] |
| `createPlugin` / `createPluginContext` | App-level singleton with install hook, adapter wiring, optional persist/restore. [intent:120, intent:144] |

### 6.2 Ticket hierarchy

```
RegistryTicketInput
  ├── ModelTicketInput
  │     └── SelectionTicketInput
  │           ├── SingleTicketInput
  │           │     └── StepTicketInput
  │           └── GroupTicketInput
  │                 └── NestedTicketInput
  ├── QueueTicketInput
  └── FormTicketInput
```

The tree above is the **input** hierarchy — the `*TicketInput` shapes a caller passes to `register`. The base `RegistryTicketInput` is just `{ id?: ID, value?: V }` (both optional); each extension spreads its parent and adds its own optional fields. The registry then resolves every input into a **`RegistryTicket`** — the output shape read via `get()` / `values()` — which carries the full base interface `{ id: ID, index: number, value: unknown, valueIsIndex: boolean, unregister: () => void }`. [intent:96] Extensions spread the parent; they never override it. [intent:101]

### 6.3 Element refs via registry

Element refs shared between sub-components must propagate through registry registration. Never `watchEffect` push. [intent:270]

**Why.** Registry registration runs on mount and deregisters on unmount automatically. A `watchEffect` push requires manual cleanup, races with unmount order, and couples children to the Root's internal collection shape.

**Carve-out — singleton 1:1 sub-components.** When the Root owns exactly one well-known sub-component (Popover's Activator, Slider's Track, Combobox's Control), the Root may expose a single boundary-typed `Readonly<Ref<Element | null>>` on its context and the sub-component writes to it directly on mount. The trade-off the registry pattern is solving (deregistration races for an unbounded set of children) does not apply when N is provably 1. The same Root must clear the field in `onBeforeUnmount` of the sub-component so the contract is symmetric.

**Alternative — DOM query.** A Root that only needs the element for a one-shot read (measurement, focus on open) can query for it via a well-known data attribute the sub-component sets (illustratively, something like `[data-v0-popover-activator]` — note v0 does not currently ship a `data-v0-*` attribute convention) instead of holding a ref. The DOM query is acceptable for fire-and-forget reads; reactive observation (ResizeObserver, IntersectionObserver) still needs the ref so the observer can rebind across re-mounts.

### 6.4 Optional injection

Composables needing global/injected context use `instanceExists()` or an equivalent soft check; falling back to a default instance, an empty context, or graceful degradation as appropriate to the composable. [intent:109, intent:148]

### 6.5 Never raw `inject` / `provide`

**Rule.** Components and composables never call Vue's raw `inject` / `provide` directly. Subtree DI always flows through `createContext(key)`, which returns a `[useX, provideX]` pair with namespace validation, optional-injection support, and a `[v0:context]` warning when the key lacks a `:`. [intent:119, intent:226, intent:227]

**Current state.** `packages/0/src/` uses raw `inject`/`provide` in exactly two non-test locations: `composables/createContext/index.ts:30` (the factory that implements the wrapper itself) and `composables/createPlugin/index.ts:35` (the plugin context factory, which wraps `inject` for app-level singletons). Both are foundational — they define the contract every caller consumes. No component or user-facing composable imports `inject`/`provide` from Vue.

**Canonical example (component side).**
```ts
// Right — Root uses createContext, sub-component consumes the matching useX
// packages/0/src/components/Tabs/TabsRoot.vue
export const [useTabsRoot, provideTabsRoot] = createContext<TabsContext>()
// namespace ('v0:tabs') is supplied at provide time: provideTabsRoot(namespace, context);
// TabsItem.vue calls useTabsRoot(namespace) — no inject() in the component.
```

**Anti-example (do not introduce).**
```ts
// Wrong — reaches past createContext, loses the namespace warning and optional-injection contract.
import { inject, provide } from 'vue'

const KEY: InjectionKey<TabsContext> = Symbol('tabs')
provide(KEY, context)
const tabs = inject(KEY)  // no namespace check, no instanceExists fallback
```

The test files in `packages/0/src/composables/*/index.test.ts` import `inject` / `provide` from `vue` for mocking — that is the one sanctioned use outside foundation code.

### 6.6 `useProxyModel` — bidirectional v-model bridging

**What.** Syncs a Vue `Ref<T>` (the consumer's v-model) with a model context (`createModel`, `createSelection`, `createSlider`). Both directions stay in lock-step: writes to `model.value` flow into `context.apply(...)`; changes to `context.selectedValues` flow back to `model.value`. [intent:182]

**When to use.**
- Your component exposes `v-model` and owns a `ModelContext` (or subclass) internally.
- You want the consumer to treat the component as a normal v-model-bound input while internally the component's selection state is managed by the registry.

**Contract.** Canonical implementation: `packages/0/src/composables/useProxyModel/index.ts`. The underlying context must carry `events: true` so `register:ticket` events drive re-sync when late-registering children land in the registry after initial mount. [intent:309]

```ts
// In a Root component
const model = defineModel<T | T[]>()
const context = createSelection({ events: true })
useProxyModel(context, model, { multiple })
```

### 6.7 `useProxyRegistry` — reactive view onto a registry

**What.** Returns a reactive `{ keys, values, entries, size }` object that updates on every `register:ticket` / `unregister:ticket` / `update:ticket` / `clear:registry` / `reindex:registry` event. [intent:254]

**When to use.**
- Templates need to iterate registry contents with `v-for`.
- A parent component needs a reactive snapshot of its children without subscribing to each ticket individually.

**When not to use.**
- You only need one derived value. `toRef(() => registry.size)` is cheaper.
- You need deep reactivity through nested ticket properties. Pass `{ deep: true }` (opts into full `reactive()`), but prefer `toRef` over each nested property instead.

**`reactive: true` vs `useProxyRegistry`.** Both deliver reactive iteration. Choose `reactive: true` on the registry when you also need `upsert`-driven per-ticket field mutations to propagate. Choose `useProxyRegistry` when you want event-driven snapshot semantics, `{ deep: true }` tracking, or reactive iteration without wrapping tickets. See §4.4. [intent:253]

Canonical: `packages/0/src/composables/useProxyRegistry/index.ts`.

### 6.8 Register / unregister lifecycle contract

Every sub-component that self-registers with a parent registry follows the same two-step lifecycle:

1. **Setup phase.** Call `parent.register({ ... })` *during setup*, not inside `onMounted`. Registry tickets are computed from props synchronously so that sibling order (via `index`) is correct before the DOM paints.
2. **`onBeforeUnmount` phase.** Call `parent.unregister(ticket.id)`. Use `onBeforeUnmount`, not `onUnmounted` — the provided context is still reachable at this phase but is gone by `onUnmounted`. [intent:161]

```ts
// packages/0/src/components/Tabs/TabsItem.vue (abridged)
const tabs = useTabsRoot(namespace)
const ticket = tabs.register({ id, value, disabled, el })

onBeforeUnmount(() => {
  tabs.unregister(ticket.id)
})
```

### 6.9 `mergeProps` at compound boundaries

**Rule.** When a sub-component forwards `attrs` both from `useAttrs()` (consumer-passed) and from the slot's pre-built `attrs` object (v0-owned), merge them with Vue's `mergeProps`, not spread. `mergeProps` concatenates class/style, merges event handlers (both fire), and preserves attribute precedence. A plain spread picks one or the other. [intent:168]

```vue
<!-- packages/0/src/components/Progress/ProgressRoot.vue -->
<script lang="ts">
  import { mergeProps, useAttrs } from 'vue'
  const attrs = useAttrs()
  // ...
</script>

<template>
  <Atom :as :renderless v-bind="mergeProps(attrs, slotProps.attrs)" />
</template>
```

Used in `Progress*`, `Splitter*`, and any compound whose sub-components need to coexist with consumer-supplied attributes. The outer `Atom` is where these are ultimately bound — sub-components do not forward `attrs` onto their own children, which is why the "never spread `attrs` on a non-renderless child" rule (§3.5) holds.

### 6.10 Collection composables: no `items` option

**Rule.** A composable that owns a collection of values exposes `register` / `onboard` / `unregister`. It does not accept the collection as an option in its factory. Row identity, column identity, order, and per-entry state live in the registry — never on a parallel array threaded in through options. When a composable owns *multiple* collections (e.g. `createDataTable` owns both rows and columns), each gets its own registry surface. [intent:351]

**Why.** A single source of truth: the registry owns the rows. An `items` option splits ownership between the consumer's array and the composable's internal state, which forces every pipeline stage to re-derive identity. Registry-based composables also dodge `MaybeRefOrGetter<T[]>` plumbing — mutations propagate by construction (reactive proxies or registry events, see §4.4), so the composable does not have to `toValue()` an external ref on every recompute. Composition stays uniform: components and composables built on top get the same `register` / `onboard` surface they already use for `createSortable` and the selection chain. Tickets emitted by `unregister` / `offboard` can be moved between registries without re-deriving identity. [intent:352]

**Before (wrong).**

```ts
const table = createDataTable({
  items: users,
  columns: [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email' },
  ],
  itemValue: 'id',
})
```

**After (right).**

```ts
const table = createDataTable<User>()

// Columns live under table.columns
table.columns.onboard([
  { id: 'name', title: 'Name', sortable: true },
  { id: 'email', title: 'Email' },
])

// Rows live at the top level
table.onboard(users.map(value => ({ id: value.id, value })))

// Or one at a time
const ticket = table.register({ id: user.id, value: user })
table.columns.register({ id: 'actions', title: '' })

// Remove
ticket.unregister()
table.unregister(user.id)
table.columns.unregister('actions')
table.clear()
table.columns.clear()
```

Callers who want domain-stable identity pass `id` explicitly — same pattern as `createSortable`. Omit `id` and the registry auto-generates one via `useId()`. Consumers with a reactive items source watch it themselves and call `clear()` + `onboard()` (or maintain `register` / `unregister` incrementally); the composable does not auto-sync from an external ref.

**Composables that follow this rule.** `createRegistry`, `createModel`, `createSelection`, `createSingle`, `createGroup`, `createStep`, `createNested`, `createSortable`, `createKanban`, `createQueue`, `createTimeline`, `createTokens`, `createDataGrid`. `createDataTable` predated the convention and has been brought in line — `items`, `itemValue`, and `columns` are all gone; consumers `onboard` rows on the returned context and columns on `table.columns`. [intent:353]

---

## 7. Events & lifecycle

### 7.1 Event binding lives in components

Restated as a lifecycle rule: the component owns the element, so the component owns the listener. A composable receives events via callback arguments, never via direct `addEventListener`. [intent:262, intent:263, intent:264]

### 7.2 Lazy is the default

Components that defer the mount of **complex DOM** default to lazy. Expose only `eager?: boolean` as the opt-in. Never expose both `lazy` and `eager`. [intent:257, intent:258]

**Scope.** "Complex DOM" means a sub-tree the user pays for only when an interaction opens it — Dialog content, Popover content, expanded Tabs panels, deferred Combobox lists. The point is keeping mount cost off the initial paint.

**Current adopters.** `Combobox` and `Select` content implement the `useLazy` + `eager?` pattern today. `Dialog`, `Popover`, and `Tabs` panels are named here as the *target* for this convention but are always-mounted at present. Treat lazy + `eager?` as the standard for new deferred-content work; retrofitting the existing always-mounted components is a possible future enhancement, not a current guarantee.

**Carve-outs.** Components whose entire identity is "manage the mount lifecycle" expose their own dedicated knobs and do not follow the `eager?` shorthand:

- `Image` — `<Image.Img>` mounts on load-state transitions; the `Image.Placeholder` / `Image.Fallback` slots are the visible mount surface. There is no `eager` prop because the load lifecycle is the component.
- `Presence` — owns the `UNMOUNTED → MOUNTED → PRESENT → LEAVING → UNMOUNTED` state machine directly. The component drives presence through a `v-model` (`defineModel<boolean>`) plus separate `lazy` / `immediate` props; the underlying `usePresence` composable takes the resolved model as its `present` option alongside `lazy`, because both are observable states, not opt-ins to a single shorthand.

### 7.3 Cleanup on unmount

Components use `onBeforeUnmount` for registry deregistration — not `onUnmounted`. [intent:161]

**Why.** By the time `onUnmounted` fires, the component tree is already detached. `onBeforeUnmount` still has access to the provided context, which is needed to deregister cleanly.

### 7.4 Presence state machine

Mount-and-animate components follow the presence state machine. Default (eager): `UNMOUNTED → MOUNTED → PRESENT → LEAVING → UNMOUNTED`. With `lazy: true` the node is retained in the DOM after leave, so the terminal state is `MOUNTED`, not `UNMOUNTED` (`usePresence/index.ts:114` — `state = lazy ? 'mounted' : 'unmounted'`); a re-open resumes from `MOUNTED → PRESENT` and skips the initial mount. `Presence` / `usePresence` with `lazy: true` is the intended replacement for the older `useLazy` pattern; migration is in progress — `Combobox` and `Select` content still use `useLazy`. [intent:313, intent:314]

### 7.5 Conditional scopes with `useToggleScope`

When side effects — observers, listeners, watchers — should only exist while a reactive boolean is true, wrap them in `useToggleScope(source, fn)`. When `source` flips false, the effect scope is stopped: every `watch`, every `useEventListener`, every `onScopeDispose` inside the callback runs its cleanup automatically. When it flips back true, a fresh scope starts and re-runs the callback. Cross-linked to §4.5. Canonical: `packages/0/src/composables/useToggleScope/index.ts`.

Use this whenever "this feature should only be wired when the consumer opts in" holds, instead of manually managing `watch` stoppers and conditional `addEventListener` / `removeEventListener` calls.

---

## 8. Types

### 8.1 Zero `any`

See §2.2.

### 8.2 `unknown` over `any`

When a type is genuinely indeterminate (e.g., ticket `value`), it is `unknown`. Narrowing happens at the point of use through `isObject`, `isString`, etc. [intent:79]

### 8.3 `Readonly<Ref<T>>` return contract

Composable return interfaces type consumer-visible refs as `Readonly<Ref<T>>` when the caller must not mutate them. Cross-linked from §4.2. The wrapper is TypeScript-level *and* runtime-level: `shallowReadonly(ref)` on the value, `Readonly<Ref<T>>` in the return interface. [intent:252]

```ts
// Right
export interface BreakpointsContext {
  width: Readonly<ShallowRef<number>>
}

function useBreakpoints (): BreakpointsContext {
  const width = shallowRef(window.innerWidth)
  return { width: readonly(width) }
}
```

### 8.4 `MaybeRefOrGetter<T>` at composable inputs

Options that accept either a plain value, a ref, or a getter are typed `MaybeRefOrGetter<T>` and read via `toValue()`. Cross-linked from §4.3. [intent:132, intent:134]

```ts
export interface UseFooOptions {
  disabled?: MaybeRefOrGetter<boolean>
}
```

### 8.5 `Extensible<T>`

Use `Extensible<T>` for enums that must retain autocomplete while accepting arbitrary string extensions. The trick is `T | (string & {})` — see `packages/0/src/types/index.ts:116`. Without `& {}`, TypeScript collapses `'a' | 'b' | string` down to `string` and drops the autocomplete.

**Canonical example.** `packages/0/src/composables/useNotifications/index.ts:43`:

```ts
export type NotificationSeverity = Extensible<'info' | 'warning' | 'error' | 'success'>
```

Also used by `createRegistry` for event-name keys on its `on` / `off` / `emit` signatures (see `packages/0/src/composables/createRegistry/index.ts`).

**Anti-example (do not do this).**
```ts
// Wrong — plain string. Callers get no autocomplete for the curated set;
// typos like 'erorr' are accepted without complaint.
export type NotificationSeverity = string

// Wrong — bare union with string. TypeScript collapses this to `string`,
// erasing the 'info' | 'warning' | ... literals from IDE suggestions.
export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success' | string
```

**Correct.**
```ts
// Right — autocomplete on the curated set, custom values still accepted.
export type NotificationSeverity = Extensible<'info' | 'warning' | 'error' | 'success'>
```

### 8.6 Readonly tuples

Trinity returns are `as const`. This preserves tuple positionality through destructuring. [intent:80]

```ts
// Right
return [useX, provideX, context] as const

// Wrong — loses tuple positionality in the type
return [useX, provideX, context]
```

### 8.7 Generic bounds

Registry-based composables carry `Z extends FooTicketInput` (input shape) and `E extends FooTicket<Z>` (output shape); consumers parameterize once at the call site and the composable threads `Z` and `E` through every return-type contract. Factories in the selection chain (`createModel`, `createSelection`, `createSingle`, `createGroup`, `createStep`) add a third generic `R extends FooContext<Z, E>` so subclasses can override the return type; leaf factories (`createSortable`, `createKanban`, `createTimeline`, `createTokens`) stop at two generics with no `R` override. Their shapes vary: `createSortable` carries the input/output-ticket pair (`E extends FooTicket<Z>`); `createTimeline` / `createTokens` pair a ticket `Z` with a context `E` (`FooContext<Z>`); `createKanban` instead parameterizes two input shapes (`ItemZ` / `ColZ`) for its two-level board.

```ts
// packages/0/src/composables/createSortable/index.ts
export function createSortable<
  Z extends SortableTicketInput = SortableTicketInput,
  E extends SortableTicket<Z> = SortableTicket<Z>,
> (_options: SortableOptions = {}): SortableContext<Z, E>
```

### 8.8 Slot type guardrails

Components explicitly type slots via `defineSlots<{ default: (props: SlotProps) => any }>()`. Never `export *` from `.vue` files — it breaks Volar slot inference. [intent:184, intent:337, intent:338]

---

## 9. Errors & invariants

### 9.1 Throw vs warn vs return

See §2.9. Three-way split: throw for bugs, warn for data integrity, silent return for runtime logic. [intent:135, intent:136, intent:137]

### 9.2 Logger, not console

`useLogger()` via the plugin system. Never `console.warn` directly. [intent:138] The logger is an adapter; test mocks capture it with `vi.spyOn`. [intent:229]

**Layer-0 bootstrap exception.** Raw `console.*` is permitted only when:

1. The site IS the logger bootstrap (`createFallbackLogger` in `useLogger/index.ts`), OR
2. The site is in a foundation utility that `useLogger` transitively depends on, where calling `useLogger()` would introduce a circular import.

Each exempt site must carry an inline comment explicitly citing this clause. No other rationale qualifies. Code that can import `useLogger` without cycles must use it — convenience is not an exception.

Current exempt sites:
- `packages/0/src/composables/useLogger/index.ts` — `createFallbackLogger` (logger bootstrap)
- `packages/0/src/composables/createContext/index.ts` — namespace-validation warn (Layer 0, circular if it imported `useLogger`)
- `packages/0/src/utilities/helpers.ts` — `useId()` SSR-dev warn (foundation dependency of useLogger)

**`__DEV__` gating.** Exempt *diagnostic warnings* must be gated on `__DEV__` so they vanish from production bundles — this covers two of the three sites (`createContext`'s namespace warn and `helpers.ts`'s `useId` SSR warn, each carrying the gate inline). The third site, `createFallbackLogger` in `useLogger/index.ts`, is the logger adapter itself, not a diagnostic warning: its `console.*` calls are the production logging output and are gated by log *level* (`enabled` / `level`), never `__DEV__`. The non-exempt path (composables that route through `useLogger`) gates inside the logger adapter, so callers do not repeat the check.

### 9.3 Namespace keys contain `:`

Every key passed to `createContext(key)` or `createXContext({ namespace })` must contain a colon. Use the `v0:` prefix for keys — production and test alike (`v0:tabs`, `v0:test`, `v0:test-key`); source keeps a single `v0:` namespace rather than introducing a separate `test:` one. Missing colons trigger a `[v0:context]` warning. [intent:226, intent:227]

**Static-key vs dynamic-key modes.** `createContext` operates in two modes:

- **Static-key mode** — the call site passes a single string (`createContext('v0:popover')`). The namespace is fixed at module load; the `[useX, provideX]` pair injects against that one key. Used by the few Roots whose namespace never needs to vary per subtree — in component source today, only `Popover` (`'v0:popover'`) and `Splitter` (`'v0:splitter'`).
- **Dynamic-key mode** — the call site passes an options object or omits the positional key (`createContext({ suffix: 'item' })` or `createContext()`), which makes the returned `useX` / `provideX` accept a runtime namespace argument supplied at provide time; `suffix` is an optional string appended to that runtime key (`key:suffix`). This is the default for compound Roots — `Tabs`, `Dialog`, `Combobox`, `Select`, and the rest omit the positional key and pass the namespace to `provideXRoot(namespace, context)` (see §6.5). It is also what lets a single composable service multiple disjoint subtrees within the same app (e.g., nested `Selection` providers). The `[v0:context]` colon warning is static-key-mode only (gated on `isString(keyOrOptions)`); the dynamic branch performs no colon check on the runtime key.

### 9.4 SSR gating

See §2.10 and §4.6. `IN_BROWSER` is the one gate.

### 9.5 Input sanitization at adapter boundaries

Any adapter that injects strings into the DOM (theme style tags, notification bodies, tour content) must sanitize. Example: `useTheme` must reject `url(`, `expression(`, `@import` in theme color values before writing to `innerHTML`. [intent:349, intent:350]

---

## 10. Anti-patterns appendix

Concrete "never do this" with real before/after from `packages/0/src/`.

### 10.1 Raw equality checks

**Before (wrong — historical illustration; createOverflow/index.ts:224 now uses the fixed `!isUndefined` form).**
```ts
if (itemWidth !== undefined && uniformWidth <= 0) return Infinity
```

**After (right).**
```ts
import { isUndefined } from '#v0/utilities'
if (!isUndefined(itemWidth) && uniformWidth <= 0) return Infinity
```

Reason: §2.3.

---

### 10.2 Unwrapped mutable state at a boundary

**Before (wrong — illustrative; the live `useResizeObserver` delegates to `createObserver`, and the sibling `useElementSize` already wraps `isActive` in `shallowReadonly`).**
```ts
return {
  width: shallowReadonly(width),
  height: shallowReadonly(height),
  isActive,                              // mutable — inconsistent
  isPaused: shallowReadonly(isPaused),
  pause,
  resume,
  stop,
}
```

**After (right).**
```ts
return {
  width: shallowReadonly(width),
  height: shallowReadonly(height),
  isActive: shallowReadonly(isActive),
  isPaused: shallowReadonly(isPaused),
  pause,
  resume,
  stop,
}
```

Reason: §4.2. Either all boundary state is readonly, or the interface explicitly declares mutability with `ShallowRef<T>`.

---

### 10.3 DOM access without SSR gate

**Before (wrong).**
```ts
// packages/0/src/composables/useHotkey/index.ts:164
function isInputFocused (): boolean {
  if (toValue(inputs)) return false
  const activeElement = document.activeElement as HTMLElement | null
  // ...
}
```

**After (right).**
```ts
import { IN_BROWSER } from '#v0/constants/globals'

function isInputFocused (): boolean {
  if (!IN_BROWSER) return false
  if (toValue(inputs)) return false
  const activeElement = document.activeElement as HTMLElement | null
  // ...
}
```

Reason: §2.10. Even if the handler is only attached in the browser, the per-composable rule is explicit gating.

---

### 10.4 Utility class leak in component source

**Before (wrong — hypothetical, does not exist in source today).**
```vue
<template>
  <Atom :as :renderless class="px-4 py-2 rounded bg-primary">
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

**After (right).**
```vue
<template>
  <Atom :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

Styling is the consumer's job. Expose `data-state`, `data-disabled`, etc. Reason: §2.1.

---

### 10.5 Non-trinity tuple return

**Before (wrong).**
```ts
function createThing () {
  const a = ref(0)
  const b = ref(0)
  return [a, b] as const   // What is a? What is b?
}
```

**After (right).**
```ts
function createThing () {
  const a = shallowRef(0)
  const b = shallowRef(0)
  return { a, b }
}
```

Reason: §3.1. Tuples are reserved for the foundation builders — `createTrinity` and `createPlugin` return the trinity, `createContext` returns the `[useX, provideX]` pair. Everything else returns a plain object with named keys.

---

### 10.6 `withDefaults` on props

**Before (wrong).**
```ts
const props = withDefaults(defineProps<{
  color?: string
  size?: string
}>(), {
  color: 'primary',
  size: 'medium',
})
```

**After (right).**
```ts
const { color = 'primary', size = 'medium' } = defineProps<{
  color?: string
  size?: string
}>()
```

Reason: §3.2, §3.4, [intent:9, intent:165]. Defaults go in destructuring, never in an interface, and never through `withDefaults`.

---

### 10.7 Spread `attrs` on a non-renderless child

**Before (wrong — in a docs example).**
```vue
<template>
  <ComponentRoot v-slot="{ attrs }">
    <button v-bind="attrs">Click</button>
  </ComponentRoot>
</template>
```

`attrs.onClick` is already bound on the outer `<Atom>`. Binding it again on `<button>` makes every click fire twice — the child fires, the click bubbles, the Atom fires again.

**After (right — renderless mode).**
```vue
<template>
  <ComponentRoot renderless v-slot="{ attrs }">
    <button v-bind="attrs">Click</button>
  </ComponentRoot>
</template>
```

**After (right — default mode, let Atom host the events).**
```vue
<template>
  <ComponentRoot>
    Click
  </ComponentRoot>
</template>
```

Reason: §3.5, [intent:189, intent:206, intent:207].

---

### 10.8 Composable binding DOM events

**Before (wrong — hypothetical).**
```ts
function createSlider (options) {
  const el = toElement(options.el)
  document.addEventListener('pointermove', onPointermove)  // Wrong: raw listener for a component-owned widget, no injected target, no scope cleanup (cf. the §2.5 carve-out for session-scoped system composables)
  // ...
}
```

**After (right).**
```ts
// Composable exposes handlers
function createSlider (options) {
  function onPointermove (event: PointerEvent) { /* ... */ }
  return { onPointermove }
}

// Component binds them
const slider = createSlider(options)
useEventListener(window, 'pointermove', slider.onPointermove)
```

Reason: §2.5, §7.1, [intent:262, intent:263].

---

### 10.9 Chained `use*()` call without naming

**Before (wrong).**
```ts
useTheme().current.value
```

**After (right).**
```ts
const theme = useTheme()
const current = theme.current.value
```

Pure transformers (`toRef`, `toElement`, `toValue`) are fine to call inline because they return values, not stateful instances. Reason: [intent:282, intent:283].

---

### 10.10 Boolean data attribute as `true | false`

**Before (wrong).**
```ts
attrs: {
  'data-disabled': isDisabled.value,   // true | false
}
```

**After (right).**
```ts
attrs: {
  'data-disabled': isDisabled.value || undefined,   // true | undefined
}
```

Reason: §3.6, [intent:172]. `false` writes `data-disabled="false"` to the DOM, which CSS `[data-disabled]` matches. `undefined` removes the attribute.

---

### 10.11 `v-show` where `v-if` belongs

**Before (wrong).**
```vue
<Content v-show="isOpen" />
```

**After (right).**
```vue
<Content v-if="isOpen" />
```

**Exceptions — where `v-show` is correct.** A child component that registers a ticket with its Root must stay mounted even while invisible; `v-if` would unmount it, fire `onBeforeUnmount`, unregister the ticket, drop its measurement, and on re-include cause a measurement / capacity / visibility cascade that thrashes neighbours. Use `v-show` when state must survive the visibility flip:

- **Registry-driven visibility.** `Breadcrumbs/BreadcrumbsItem.vue`, `BreadcrumbsDivider.vue`, `BreadcrumbsEllipsis.vue`, `Overflow/OverflowItem.vue`, `Avatar/AvatarRoot.vue` — items registered with the Root (or an enclosing group) for measurement, selection, or overflow counting must stay mounted so their ticket survives the flip; `AvatarRoot` hides via `v-show="!isHidden"` when the group's visible count excludes it, yet keeps its ticket so the count stays correct.
- **Load-state preservation.** `Avatar/AvatarImage.vue` — image load state would reset on remount.
- **Virtualization.** `Combobox/ComboboxItem.vue` — load-bearing for the filtered list.

Everywhere else, `v-if` for structural conditionals. Reason: [intent:188].

Never hand-roll `:style="{ display: isHidden ? 'none' : null }"` — `v-show` already does this, captures the original `style.display` on mount, and is the canonical form readers expect.

---

### 10.12 Element ref propagation via `watchEffect`

**Before (wrong).**
```ts
// Child component
const el = useTemplateRef('root')
watchEffect(() => {
  parentContext.elements.push(el.value)   // racy, needs manual cleanup
})
```

**After (right).**
```ts
// Child registers with parent's registry
const ticket = parentContext.register({ el: useTemplateRef('root') })
onBeforeUnmount(() => parentContext.unregister(ticket.id))
```

Reason: §6.3, [intent:270].

---

### 10.13 Hardcoded English strings

**Before (wrong).**
```ts
attrs: {
  'aria-label': 'Close dialog',
}
```

**After (right).**
```ts
const locale = useLocale()
attrs: {
  'aria-label': locale.ti('Dialog.close') ?? 'Close',
}
```

Reason: §5.5, [intent:176].

---

### 10.14 Sort indicators baked into v0 source

v0 never renders a sort indicator itself. Direction lives in state, not in markup. The component emits `data-direction="asc"` (or whatever the state is) and exposes the boolean through the slot's `attrs` and `is<State>` props. The consumer then chooses how to render the indicator — a slot, an SVG, an icon component, a CSS pseudo-element against the data attribute. v0 ships no assumption about what the arrow looks like.

**Wrong (v0 source renders an indicator directly).**
```vue
<!-- packages/0/src/components/DataTable/DataTableColumnHeader.vue — hypothetical, do not write -->
<template>
  <Atom :as :renderless>
    <button>
      {{ label }}
      <span>{{ sorted === 'asc' ? '↑' : '↓' }}</span>
    </button>
  </Atom>
</template>
```

Two failures in one snippet: the span is rendered inside v0 source (which is the headless violation — §2.1), and the span's content is an emoji/unicode character (which bakes in an iconography decision — [intent:269]).

**Right (consumer owns the indicator).**
```vue
<!-- packages/0/src/components/DataTable/DataTableColumnHeader.vue -->
<template>
  <Atom :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

```vue
<!-- consumer's app — renders whatever it likes -->
<DataTable.ColumnHeader v-slot="{ attrs, direction }">
  <button v-bind="attrs">
    {{ label }}
    <MyIcon v-if="direction === 'asc'" name="arrow-up" />
    <MyIcon v-else-if="direction === 'desc'" name="arrow-down" />
  </button>
</DataTable.ColumnHeader>
```

Reason: §2.1, §5.1 (headless acid test — consumer must be able to style/render against data attributes alone), [intent:269]. v0 emits state, consumers emit glyphs.

---

### 10.15 `console.warn` directly

**Before (wrong).**
```ts
console.warn('createRegistry: duplicate ID')
```

**After (right).**
```ts
const logger = useLogger()
logger.warn('createRegistry: duplicate ID')
```

Reason: §9.2, [intent:138].

---

### 10.16 `export *` from a `.vue` file

**Before (wrong).**
```ts
// index.ts
export * from './ComponentRoot.vue'
```

**After (right).**
```ts
// index.ts
export type { ComponentRootProps, ComponentRootSlotProps } from './ComponentRoot.vue'
export { default as ComponentRoot } from './ComponentRoot.vue'
export { useComponentRoot, provideComponentRoot } from './ComponentRoot.vue'
```

Reason: [intent:184]. `export *` breaks Volar slot type inference.

---

### 10.17 `onUnmounted` for deregistration

**Before (wrong).**
```ts
onUnmounted(() => parentContext.unregister(ticket.id))
```

**After (right).**
```ts
onBeforeUnmount(() => parentContext.unregister(ticket.id))
```

Reason: §7.3, [intent:161].

---

### 10.18 Auto-increment or `Math.random()` IDs

**Before (wrong).**
```ts
let nextId = 0
function register () {
  return { id: `foo-${++nextId}` }
}
```

**After (right).**
```ts
import { useId } from '#v0/utilities'
function register () {
  return { id: useId() }
}
```

Reason: §2.8, [intent:151]. Auto-increment breaks SSR hydration.

---

### 10.19 `createOverflow` consumer that skips `measure()` in uniform mode

**Before (wrong).**
```ts
// Consumer in uniform mode (itemWidth set) never calls overflow.measure()
// because items are uniform — but isOverflowing reads from the measurement map.
const overflow = createOverflow({ container, itemWidth })

// Child:
useToggleScope(() => responsive, () => {
  // Only measures itself for itemWidth back-channel; no overflow.measure() call.
  watch(el, () => writeSelfWidthBackToParent())
})

// Result: overflow.isOverflowing.value is permanently false even when truncated.
```

**After (right).**
```ts
const overflow = createOverflow({ container, itemWidth })

// Child registers presence with overflow on mount / unregisters on unmount.
// The width arg is recorded but ignored by uniform-mode capacity math —
// only the entry count drives isOverflowing.
watch(
  () => [el.value, ticket.index] as const,
  ([e, i]) => overflow.measure(i, e ?? undefined),
  { immediate: true },
)

onBeforeUnmount(() => overflow.measure(ticket.index, undefined))
```

Reason: §6.8 lifecycle contract — the registration is what makes derived state truthful. `createOverflow` cannot infer item count from a container in renderless / Atom-wrapped trees, so consumers must signal it via `measure()` even when there's no per-item width to record. Skipping the calls works for `capacity` (driven by `itemWidth`) but silently breaks `isOverflowing`.

The bug family: any composable that exposes two derived values where one is driven by a config option and the other by a registration stream — consumers who only need the first signal will silently break the second for downstream readers.

---

## Appendix A — Section quick reference

| Section | Theme | Count of cited intents |
|---------|-------|------------------------|
| 1 Identity | what v0 is, is not, audience, Vapor | 8 |
| 2 Axioms | non-negotiable foundations | 17 |
| 3 API shape | returns, args, names, slots, comments | 22 |
| 4 Reactivity | primitives, readonly, options, scope | 22 |
| 5 Headless | operational definition | 10 |
| 6 Registries | context, tickets, useProxyModel, useProxyRegistry, mergeProps, collection composables | 17 |
| 7 Events & lifecycle | binding, mounting, cleanup, toggle scope | 7 |
| 8 Types | any, readonly-ref, MRG, generics, slot guards | 8 |
| 9 Errors | throw/warn/return, logger, SSR | 9 |
| 10 Anti-patterns | 19 concrete before/after pairs | — |
