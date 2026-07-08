---
title: Glossary - Core v0 Terminology
meta:
  - name: description
    content: "Definitions of the vocabulary that recurs throughout v0: ticket, registry, trinity, context, namespace, model, selection, plugin, and adapter, with why each exists."
  - name: keywords
    content: "vuetify0, glossary, terminology, ticket, registry, trinity, context, namespace, model, selection, plugin, adapter, headless"
features:
  order: 0.6
  level: 1
related:
  - /guide/fundamentals/core
  - /guide/fundamentals/building-frameworks
  - /composables/registration/create-registry
  - /composables/foundation/create-context
---

# Glossary

Short definitions of the vocabulary that recurs throughout v0's docs and source — ticket, registry, trinity, context, and the rest. Each entry says what the term means, why it exists, and where to read more.

<DocsPageFeatures :frontmatter />

> [!TIP]
> The terms build on each other. If you want the full picture of how they connect, read [Core](/guide/fundamentals/core) — this page is the quick-lookup reference.

## Quick reference

| Term | One-line meaning | Created with |
|------|------------------|--------------|
| [Headless](#headless) | Behavior, state, and accessibility but no styling | — |
| [Compound component](#compound-component) | Stateful Root plus named sub-components sharing a context | — |
| [Trinity](#trinity) | Readonly three-element tuple returned by context and plugin factories | `createTrinity` |
| [Context](#context) | Type-safe provide/inject that throws when the provider is missing | `createContext` |
| [Namespace](#namespace) | Colon-scoped string key for a context, prefixed `v0:` | — |
| [Plugin](#plugin) | App-level singleton installed with `app.use(...)` | `createPlugin` |
| [Adapter](#adapter) | Swappable backend behind a composable's interface | — |
| [Registry](#registry) | Indexed store of registered items, keyed by id | `createRegistry` |
| [Ticket](#ticket) | Handle a sub-component holds on its slot in the registry | `register()` |
| [Register / onboard / unregister](#register-onboard-and-unregister) | The registry lifecycle verbs for adding and removing items | `createRegistry` |
| [Enroll](#enroll) | Auto-selection on registration | `createModel` |
| [Model](#model) | The value layer — a registry plus a reactive Set of selected ids | `createModel` |
| [Selection](#selection) | Selection rules layered on a model | `createSelection` |

## Core architecture

### Headless

A component or composable that ships behavior, state, and accessibility but **no styling** — you write every line of CSS yourself.

Why it exists: v0 sits at the bottom of the stack (v0 → Paper → design systems → Vuetify). A single utility class in source would bind every downstream design system to it. The acid test is "strip every stylesheet and the component still functions and announces its state to a screen reader."

See [Styling](/guide/fundamentals/styling) and [Components](/guide/fundamentals/components).

### Compound component

A component split into a stateful Root plus named sub-components — `Tabs.Root`, `Tabs.List`, `Tabs.Item` — that coordinate through a shared context rather than through props.

Why it exists: the Root owns the state once; children read it from the context, so siblings never prop-drill state between each other. Each piece stays independently styleable while the behavior stays centralized.

See [Components](/guide/fundamentals/components).

### Trinity

The signature return shape of v0's context and plugin factories: a readonly three-element tuple. Context factories return `[useX, provideX, defaultX]`; plugin factories return `[createXContext, createXPlugin, useX]`.

Why it exists: three elements cover every consumption mode — inject in a child (`useX`), provide from a parent (`provideX`), and use standalone or in a test without mounting Vue (`defaultX`). One predictable shape across the whole library keeps data flow debuggable.

See [Core](/guide/fundamentals/core) and [createTrinity](/composables/foundation/create-trinity).

### Context

A type-safe wrapper around Vue's provide/inject, created with `createContext(key)`. It returns a `[useX, provideX]` pair and **throws** when a consumer injects a context no ancestor provided.

Why it exists: raw `inject()` silently returns `undefined` when the provider is missing, turning a setup mistake into a downstream null-reference bug. `createContext` fails loudly at the injection site and gives full type inference. v0 never calls raw provide/inject outside its two foundation factories.

See [createContext](/composables/foundation/create-context) and [Core](/guide/fundamentals/core).

### Namespace

The string key that scopes a context, such as `v0:tabs`. Production keys are prefixed `v0:` and must contain a colon.

Why it exists: the colon namespaces the key so independent contexts never collide, and a missing colon triggers a `[v0:context]` warning. Dynamic-key mode appends a `suffix` (`key:suffix`) so one factory can service many disjoint subtrees — nested panels, or tabs within tabs.

See [Core](/guide/fundamentals/core).

## Plugins and adapters

### Plugin

An app-level singleton installed with `app.use(...)`. Built with `createPlugin` or `createPluginContext`, a plugin wires an install hook, optional adapters, and optional persist/restore lifecycle hooks.

Why it exists: some state is genuinely global — theme, locale, breakpoints, feature flags. A plugin provides it once at the app root so any component can inject it, instead of threading it through every tree. Plugins are order-independent and degrade gracefully when a dependency is missing.

See [createPlugin](/composables/foundation/create-plugin) and [Plugins](/guide/fundamentals/plugins).

### Adapter

A swappable backend behind a composable. The composable defines an interface; an adapter implements it against a concrete library — console, pino, or consola for the logger; localStorage or sessionStorage for storage; a date library for dates.

Why it exists: v0 is not a thin wrapper around any one library. Adapters let a consumer keep v0's API while choosing — or writing — the implementation underneath, and they are the boundary where untrusted input is sanitized before it reaches the DOM.

See [useLogger](/composables/plugins/use-logger) and [Plugins](/guide/fundamentals/plugins).

## Registries and tickets

### Registry

The indexed store that holds registered items as tickets, created with `createRegistry`. It is the foundation every selection, form, and token composable extends.

Why it exists: parent-child coordination — which tab exists, in what order, with what value — needs one reactive source of truth keyed by id with stable ordering. Building it once means selection, validation, and data composables all share the same `register` / `get` / `move` surface.

See [createRegistry](/composables/registration/create-registry) and [Core](/guide/fundamentals/core).

### Ticket

The plain object you get back when you register an item with a registry. Every ticket carries `{ id, index, value, valueIsIndex, unregister }`, and richer registries add reactive properties and bound methods — `isSelected` (a ref), `select()`, `toggle()`.

Why it exists: the ticket is the handle a sub-component holds onto its own slot in the parent's registry. Reactive fields update automatically as state changes; the bound methods let a child act on itself without knowing the registry's internals. Ticket types extend their parent and never override the base shape.

See [Building Frameworks](/guide/fundamentals/building-frameworks) and [Core](/guide/fundamentals/core).

### Register, onboard, and unregister

The registry lifecycle verbs. `register(ticket)` adds one item and returns its ticket; `onboard(tickets)` bulk-registers many; `unregister(id)` removes one and `offboard(ids)` removes many, returning the removed data.

Why it exists: collection composables own their items through this surface instead of accepting an `items` array option — the registry stays the single source of truth. Sub-components `register` during setup so sibling order is correct before paint, and `unregister` in `onBeforeUnmount` while the context is still reachable.

See [createRegistry](/composables/registration/create-registry).

### Enroll

Distinct from register, enrollment is **auto-selection on registration**. `createModel` enrolls by default (`enroll: true`), so a newly registered ticket is selected immediately; `createSelection` turns it off and applies its own multiple-aware logic.

Why it exists: adding an item to the store and marking it active are different actions that are easy to conflate. Naming the auto-select behavior separately keeps "in the registry" and "currently selected" as independent states.

See [createModel](/composables/selection/create-model).

## Models and selection

### Model

The value layer, created with `createModel`. It extends a registry with a reactive Set of selected ids plus the `multiple` and `enroll` options, and is the shared base for both selection and slider state.

Why it exists: "what value(s) are held" is a concern separate from "what selection rules apply." Factoring the value store into createModel lets createSelection (rules) and createSlider (per-thumb math) reuse the same value plumbing.

See [createModel](/composables/selection/create-model) and [Core](/guide/fundamentals/core).

### Selection

The selection-logic layer on top of a model, created with `createSelection`: it adds mandatory enforcement, disabled guards, and multi-select. Its specializations are `createSingle` (one at a time), `createGroup` (tri-state batches), `createStep` (next/prev navigation), and `createNested` (trees).

Why it exists: most interactive widgets — tabs, radios, checkboxes, wizards, treeviews — are selection problems. Layering the rules above the value store lets you pick the specialization that matches the widget and inherit the rest.

See [createSelection](/composables/selection/create-selection) and [Core](/guide/fundamentals/core).
