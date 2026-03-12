# Snackbar Component Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a headless Snackbar compound component (Portal, Root, Content, Action, Close) for rendering toast/snackbar notifications.

**Architecture:** Pure presentation — no queue, no timeout, no positioning. Portal teleports to body and registers with useStack for z-index. Root sets ARIA role based on severity. Consumer brings their own state (createQueue, useNotifications, etc.).

**Tech Stack:** Vue 3 SFCs, Atom polymorphic base, createContext, useStack, Vitest + happy-dom

**Spec:** `docs/superpowers/specs/2026-03-12-snackbar-component-design.md`

---

## Chunk 1: Component Implementation

### Task 1: SnackbarPortal.vue

**Files:**
- Create: `packages/0/src/components/Snackbar/SnackbarPortal.vue`

**Reference:** `Dialog/DialogRoot.vue` for context creation, `Dialog/DialogContent.vue` for useStack, `Scrim/Scrim.vue` for Teleport

- [ ] **Step 1: Create SnackbarPortal.vue**

```vue
/**
 * @module SnackbarPortal
 *
 * @remarks
 * Container component for snackbar notifications. Teleports to body
 * and registers with useStack for z-index coordination with Dialog/Scrim.
 *
 * Does not set aria-live — each SnackbarRoot handles its own live region
 * semantics via role to avoid nesting conflicts.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ComputedRef } from 'vue'

  export interface SnackbarContext {
    zIndex: ComputedRef<number>
  }

  export interface SnackbarPortalProps extends AtomProps {
    /** Teleport target. `false` renders inline. @default 'body' */
    teleport?: string | false
  }

  export interface SnackbarPortalSlotProps {
    /** Calculated z-index from useStack */
    zIndex: number
  }

  export const [useSnackbarContext, provideSnackbarContext] = createContext<SnackbarContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useStack } from '#v0/composables/useStack'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SnackbarPortal' })

  defineSlots<{
    default: (props: SnackbarPortalSlotProps) => any
  }>()

  const {
    as = 'div',
    teleport = 'body',
  } = defineProps<SnackbarPortalProps>()

  const stack = useStack()
  const ticket = stack.register()
  ticket.select()

  provideSnackbarContext('v0:snackbar', {
    zIndex: ticket.zIndex,
  })

  const styles = toRef(() => ({ zIndex: ticket.zIndex.value }))

  const slotProps = toRef((): SnackbarPortalSlotProps => ({
    zIndex: ticket.zIndex.value,
  }))
</script>

<template>
  <Teleport v-if="teleport" :to="teleport">
    <Atom :as :style="styles">
      <slot v-bind="slotProps" />
    </Atom>
  </Teleport>

  <Atom v-else :as :style="styles">
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

- [ ] **Step 2: Verify no typecheck errors**

Run: `pnpm typecheck`

---

### Task 2: SnackbarRoot.vue

**Files:**
- Create: `packages/0/src/components/Snackbar/SnackbarRoot.vue`

**Reference:** `Dialog/DialogRoot.vue` for slot props pattern

- [ ] **Step 1: Create SnackbarRoot.vue**

```vue
/**
 * @module SnackbarRoot
 *
 * @remarks
 * A single snackbar instance. Sets ARIA role based on severity:
 * - `info`/`success` → `role="status"` (implicit aria-live="polite")
 * - `error`/`warning` → `role="alert"` (implicit aria-live="assertive")
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { NotificationSeverity } from '#v0/composables/useNotifications'

  export interface SnackbarRootProps extends AtomProps {
    /** Drives ARIA role selection. @default 'info' */
    severity?: NotificationSeverity
  }

  export interface SnackbarRootSlotProps {
    /** Current severity */
    severity: NotificationSeverity
    /** ARIA attributes for the snackbar */
    attrs: {
      role: 'status' | 'alert'
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SnackbarRoot' })

  defineSlots<{
    default: (props: SnackbarRootSlotProps) => any
  }>()

  const {
    as = 'div',
    severity = 'info',
  } = defineProps<SnackbarRootProps>()

  const role = toRef((): 'status' | 'alert' =>
    severity === 'error' || severity === 'warning' ? 'alert' : 'status'
  )

  const slotProps = toRef((): SnackbarRootSlotProps => ({
    severity,
    attrs: { role: role.value },
  }))
</script>

<template>
  <Atom :as :role="role">
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

- [ ] **Step 2: Verify no typecheck errors**

Run: `pnpm typecheck`

---

### Task 3: SnackbarContent.vue, SnackbarAction.vue, SnackbarClose.vue

**Files:**
- Create: `packages/0/src/components/Snackbar/SnackbarContent.vue`
- Create: `packages/0/src/components/Snackbar/SnackbarAction.vue`
- Create: `packages/0/src/components/Snackbar/SnackbarClose.vue`

**Reference:** `Dialog/DialogDescription.vue` for simple sub-component, `Dialog/DialogClose.vue` for close pattern

- [ ] **Step 1: Create SnackbarContent.vue**

```vue
/**
 * @module SnackbarContent
 *
 * @remarks
 * Semantic wrapper for the notification message text.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SnackbarContentProps = AtomProps
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  defineOptions({ name: 'SnackbarContent' })

  const { as = 'div' } = defineProps<SnackbarContentProps>()
</script>

<template>
  <Atom :as>
    <slot />
  </Atom>
</template>
```

- [ ] **Step 2: Create SnackbarAction.vue**

```vue
/**
 * @module SnackbarAction
 *
 * @remarks
 * Optional action button for snackbar notifications (undo, retry, view, etc.).
 * No built-in click handler — consumer wires @click.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export type SnackbarActionProps = AtomProps
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  defineOptions({ name: 'SnackbarAction' })

  const { as = 'button' } = defineProps<SnackbarActionProps>()
</script>

<template>
  <Atom :as :type="as === 'button' ? 'button' : undefined">
    <slot />
  </Atom>
</template>
```

- [ ] **Step 3: Create SnackbarClose.vue**

```vue
/**
 * @module SnackbarClose
 *
 * @remarks
 * Dismiss button for snackbar notifications.
 * No built-in click handler — unlike Dialog.Close which auto-calls context.close(),
 * Snackbar.Close cannot auto-dismiss because the dismiss target varies per Root instance.
 * Consumer must wire the handler.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SnackbarCloseProps extends AtomProps {
    /** Accessible label for the close button. @default 'Close' */
    label?: string
  }

  export interface SnackbarCloseSlotProps {
    attrs: {
      'type': 'button' | undefined
      'aria-label': string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'SnackbarClose' })

  defineSlots<{
    default: (props: SnackbarCloseSlotProps) => any
  }>()

  const {
    as = 'button',
    label = 'Close',
  } = defineProps<SnackbarCloseProps>()

  const slotProps = toRef((): SnackbarCloseSlotProps => ({
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': label,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
```

- [ ] **Step 4: Verify no typecheck errors**

Run: `pnpm typecheck`

---

### Task 4: Barrel export (index.ts)

**Files:**
- Create: `packages/0/src/components/Snackbar/index.ts`

**Reference:** `Dialog/index.ts` for barrel pattern with JSDoc

- [ ] **Step 1: Create barrel export**

```ts
export { default as SnackbarPortal } from './SnackbarPortal.vue'
export { provideSnackbarContext, useSnackbarContext } from './SnackbarPortal.vue'
export { default as SnackbarRoot } from './SnackbarRoot.vue'
export { default as SnackbarContent } from './SnackbarContent.vue'
export { default as SnackbarAction } from './SnackbarAction.vue'
export { default as SnackbarClose } from './SnackbarClose.vue'
export type { SnackbarContext, SnackbarPortalProps, SnackbarPortalSlotProps } from './SnackbarPortal.vue'
export type { SnackbarRootProps, SnackbarRootSlotProps } from './SnackbarRoot.vue'
export type { SnackbarContentProps } from './SnackbarContent.vue'
export type { SnackbarActionProps } from './SnackbarAction.vue'
export type { SnackbarCloseProps, SnackbarCloseSlotProps } from './SnackbarClose.vue'

// Components
import Action from './SnackbarAction.vue'
import Close from './SnackbarClose.vue'
import Content from './SnackbarContent.vue'
import Portal from './SnackbarPortal.vue'
import Root from './SnackbarRoot.vue'

/**
 * Snackbar component with sub-components for building toast notifications.
 *
 * @see https://0.vuetifyjs.com/components/snackbar
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Snackbar } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Snackbar.Portal>
 *     <Snackbar.Root v-for="item in items" :key="item.id" :severity="item.severity">
 *       <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
 *       <Snackbar.Close @click="item.dismiss()" />
 *     </Snackbar.Root>
 *   </Snackbar.Portal>
 * </template>
 * ```
 */
export const Snackbar = {
  /**
   * Container that teleports to body and manages z-index via useStack.
   *
   * @see https://0.vuetifyjs.com/components/snackbar
   *
   * @example
   * ```vue
   * <Snackbar.Portal>
   *   <!-- Snackbar.Root items -->
   * </Snackbar.Portal>
   * ```
   */
  Portal,
  /**
   * A single snackbar instance. Sets ARIA role based on severity.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarroot
   *
   * @example
   * ```vue
   * <Snackbar.Root severity="error">
   *   <Snackbar.Content>Something went wrong</Snackbar.Content>
   * </Snackbar.Root>
   * ```
   */
  Root,
  /**
   * Semantic wrapper for the notification message text.
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarcontent
   *
   * @example
   * ```vue
   * <Snackbar.Content>Changes saved</Snackbar.Content>
   * ```
   */
  Content,
  /**
   * Optional action button (undo, retry, view, etc.).
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbaraction
   *
   * @example
   * ```vue
   * <Snackbar.Action @click="undo()">Undo</Snackbar.Action>
   * ```
   */
  Action,
  /**
   * Dismiss button with aria-label="Close".
   *
   * @see https://0.vuetifyjs.com/components/snackbar#snackbarclose
   *
   * @example
   * ```vue
   * <Snackbar.Close @click="item.dismiss()" />
   * ```
   */
  Close,
}
```

- [ ] **Step 2: Register in components barrel**

Add to `packages/0/src/components/index.ts`:

```ts
export * from './Snackbar'
```

- [ ] **Step 3: Verify typecheck and lint**

Run: `pnpm typecheck && pnpm lint:fix`

- [ ] **Step 4: Commit**

```bash
git add packages/0/src/components/Snackbar/
git add packages/0/src/components/index.ts
git commit -m "feat(Snackbar): add headless snackbar compound component"
```

---

## Chunk 2: Tests

### Task 5: Component tests

**Files:**
- Create: `packages/0/src/components/Snackbar/index.test.ts`

**Reference:** `Dialog/index.test.ts` for component test patterns

- [ ] **Step 1: Write tests**

Test the following behaviors:
1. Portal renders with default teleport to body
2. Portal renders inline when `teleport={false}`
3. Portal registers with useStack (has z-index style)
4. Root renders `role="status"` for info/success severity
5. Root renders `role="alert"` for error/warning severity
6. Root defaults severity to `'info'`
7. Close renders `aria-label="Close"` by default
8. Close renders custom label
9. Action renders as button with `type="button"`
10. Content renders slot content
11. Multiple Roots render inside Portal

Use `mount` from `@vue/test-utils`, wrap in `createApp` with `createStackPlugin` for useStack context. Follow the existing Dialog test patterns.

- [ ] **Step 2: Run tests**

Run: `pnpm test:run -- packages/0/src/components/Snackbar`
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add packages/0/src/components/Snackbar/index.test.ts
git commit -m "feat(Snackbar): add component tests"
```

---

## Chunk 3: Documentation

### Task 6: Documentation page

**Files:**
- Create: `apps/docs/src/pages/components/semantic/snackbar.md`

**Reference:** `apps/docs/src/pages/components/disclosure/dialog.md` for component doc structure

- [ ] **Step 1: Create doc page**

Follow the component page structure from `.claude/rules/docs.md`:
1. Frontmatter (title, meta, features with `category: Component`, `label: 'C: Snackbar'`, `github: /components/Snackbar/`)
2. H1 + `<DocsPageFeatures :frontmatter />`
3. Usage — basic code example
4. Anatomy — ````vue playground collapse``` showing component tree
5. Architecture — no diagram needed (simple)
6. Examples — `::: example` block with live demo
7. Accessibility — ARIA table
8. `<DocsApi />`

- [ ] **Step 2: Create example files**

Create in `apps/docs/src/examples/components/snackbar/`:
- `basic.vue` — Snackbar with createQueue, shows multi-stack with dismiss
- Wire up 2-3 demo notifications with different severities

- [ ] **Step 3: Commit**

```bash
git add -f apps/docs/
git commit -m "docs(Snackbar): add documentation page and example"
```

---

## Chunk 4: Final Verification

### Task 7: Validate everything

- [ ] **Step 1: Run full validation**

Run: `pnpm validate` (lint + typecheck + test)

- [ ] **Step 2: Run repo checks**

Run: `pnpm repo:check` (knip + sherif)

- [ ] **Step 3: Push**

```bash
git push origin feat/notifications-plugin
```
