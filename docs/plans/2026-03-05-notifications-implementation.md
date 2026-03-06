# createNotifications Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a headless notification management composable with lifecycle state mutations, event-driven adapter integration, and Vue plugin installation.

**Architecture:** `createNotifications` wraps `createQueue` with notification-specific state (read/seen/archived/snoozed timestamps), convenience mutations, and an adapter hook. `createPluginContext` generates the standard triple (`createNotificationsContext`, `createNotificationsPlugin`, `useNotifications`). Events use the registry's built-in `on`/`off`/`emit`.

**Tech Stack:** Vue 3, TypeScript, `#v0/composables` (createQueue, createPluginContext), `#v0/utilities` (useId, isUndefined)

---

### Task 1: Types and Interfaces

**Files:**
- Create: `packages/0/src/composables/createNotifications/index.ts`

**Step 1: Write types**

```ts
/**
 * @module createNotifications
 *
 * @remarks
 * Notification management composable built on createQueue.
 * Manages notification lifecycle with optional service adapters (Knock, Novu, custom).
 *
 * Supports:
 * - Push notifications with severity, actions, and timeout
 * - State mutations: read, seen, archived, snoozed
 * - Bulk operations: readAll, archiveAll, clear
 * - Adapter integration via event system
 * - Plugin installation via createPluginContext
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createQueue } from '#v0/composables/createQueue'

// Utilities
import { isUndefined, useId } from '#v0/utilities'
import { computed, onScopeDispose, shallowRef, triggerRef } from 'vue'

// Types
import type { QueueContext, QueueOptions, QueueTicket, QueueTicketInput } from '#v0/composables/createQueue'
import type { ID } from '#v0/types'

export type NotificationSeverity = 'info' | 'warning' | 'error' | 'success'

export interface NotificationAction {
  label: string
  action?: () => void
}

export interface NotificationInput extends QueueTicketInput {
  subject?: string
  body?: string
  severity?: NotificationSeverity
  data?: Record<string, unknown>
  primaryAction?: NotificationAction
  secondaryAction?: NotificationAction
}

export interface NotificationTicket extends QueueTicket<NotificationInput> {
  createdAt: Date
  readAt: Date | null
  seenAt: Date | null
  archivedAt: Date | null
  snoozedUntil: Date | null
  read: () => void
  unread: () => void
  seen: () => void
  archive: () => void
  unarchive: () => void
  snooze: (until: Date) => void
  unsnooze: () => void
}

export interface NotificationsAdapterContext {
  notify: (input: NotificationInput) => NotificationTicket
  on: (event: string, handler: (...args: unknown[]) => void) => void
  off: (event: string, handler: (...args: unknown[]) => void) => void
}

export type NotificationsAdapter = (context: NotificationsAdapterContext) => void | (() => void)

export interface NotificationsOptions extends QueueOptions {
  adapter?: NotificationsAdapter
}

export interface NotificationsContext extends Omit<
  QueueContext<NotificationInput, NotificationTicket>,
  'register'
> {
  // Push
  notify: (input: NotificationInput) => NotificationTicket

  // Single mutations
  read: (id: ID) => void
  unread: (id: ID) => void
  seen: (id: ID) => void
  archive: (id: ID) => void
  unarchive: (id: ID) => void
  snooze: (id: ID, until: Date) => void
  unsnooze: (id: ID) => void

  // Bulk mutations
  readAll: () => void
  archiveAll: () => void

  // Reactive state
  items: ReturnType<typeof shallowRef<NotificationTicket[]>>
  unreadCount: ReturnType<typeof computed<number>>
  unseenCount: ReturnType<typeof computed<number>>
  total: ReturnType<typeof computed<number>>
}
```

**Step 2: Verify file was created correctly**

Run: `pnpm typecheck --filter @vuetify/v0 2>&1 | head -5`
Expected: May show errors (implementation not yet written) but types should parse.

**Step 3: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.ts
git commit -m "feat(createNotifications): add types and interfaces"
```

---

### Task 2: Core Implementation — createNotifications

**Files:**
- Modify: `packages/0/src/composables/createNotifications/index.ts`

**Step 1: Implement createNotifications**

Append after the types in `index.ts`:

```ts
export function createNotifications (
  _options: NotificationsOptions = {}
): NotificationsContext {
  const { adapter, timeout = -1, ...options } = _options
  const queue = createQueue<NotificationInput, NotificationTicket>({
    ...options,
    timeout,
    events: true,
  })

  const items = shallowRef<NotificationTicket[]>([])

  function sync () {
    items.value = queue.values()
    triggerRef(items)
  }

  queue.on('register:ticket', sync)
  queue.on('unregister:ticket', sync)
  queue.on('update:ticket', sync)
  queue.on('clear:registry', sync)

  // Push
  function notify (input: NotificationInput): NotificationTicket {
    const id = input.id ?? useId()
    const now = new Date()

    const ticket = queue.register({
      ...input,
      id,
      createdAt: now,
      readAt: null,
      seenAt: null,
      archivedAt: null,
      snoozedUntil: null,
      read: () => read(id),
      unread: () => unread(id),
      seen: () => seen(id),
      archive: () => archive(id),
      unarchive: () => unarchive(id),
      snooze: (until: Date) => snooze(id, until),
      unsnooze: () => unsnooze(id),
    } as Partial<NotificationInput>)

    queue.emit('notification:received', ticket)

    return ticket
  }

  // Single mutations
  function mutate (id: ID, patch: Partial<NotificationTicket>, event: string) {
    const ticket = queue.get(id)
    if (!ticket) return

    queue.upsert(id, patch as Partial<NotificationTicket>)
    queue.emit(event, id)
    sync()
  }

  function read (id: ID) {
    mutate(id, { readAt: new Date() } as Partial<NotificationTicket>, 'notification:read')
  }

  function unread (id: ID) {
    mutate(id, { readAt: null } as Partial<NotificationTicket>, 'notification:unread')
  }

  function seen (id: ID) {
    mutate(id, { seenAt: new Date() } as Partial<NotificationTicket>, 'notification:seen')
  }

  function archive (id: ID) {
    mutate(id, { archivedAt: new Date() } as Partial<NotificationTicket>, 'notification:archived')
  }

  function unarchive (id: ID) {
    mutate(id, { archivedAt: null } as Partial<NotificationTicket>, 'notification:unarchived')
  }

  function snooze (id: ID, until: Date) {
    mutate(id, { snoozedUntil: until } as Partial<NotificationTicket>, 'notification:snoozed')
  }

  function unsnooze (id: ID) {
    mutate(id, { snoozedUntil: null } as Partial<NotificationTicket>, 'notification:unsnoozed')
  }

  // Bulk mutations
  function readAll () {
    const now = new Date()
    for (const ticket of queue.values()) {
      if (!ticket.readAt) {
        queue.upsert(ticket.id, { readAt: now } as Partial<NotificationTicket>)
      }
    }
    sync()
  }

  function archiveAll () {
    const now = new Date()
    for (const ticket of queue.values()) {
      if (!ticket.archivedAt) {
        queue.upsert(ticket.id, { archivedAt: now } as Partial<NotificationTicket>)
      }
    }
    sync()
  }

  // Reactive state
  const unreadCount = computed(() => items.value.filter(t => !t.readAt).length)
  const unseenCount = computed(() => items.value.filter(t => !t.seenAt).length)
  const total = computed(() => items.value.length)

  // Adapter
  let cleanup: (() => void) | undefined

  if (adapter) {
    const result = adapter({
      notify,
      on: queue.on.bind(queue),
      off: queue.off.bind(queue),
    })
    if (result) cleanup = result
  }

  // Override dispose to include adapter cleanup
  const baseDispose = queue.dispose
  function dispose () {
    cleanup?.()
    baseDispose()
  }

  onScopeDispose(dispose, true)

  return {
    ...queue,
    notify,
    read,
    unread,
    seen,
    archive,
    unarchive,
    snooze,
    unsnooze,
    readAll,
    archiveAll,
    items,
    unreadCount,
    unseenCount,
    total,
    dispose,
  } as unknown as NotificationsContext
}
```

**Step 2: Verify it compiles**

Run: `pnpm typecheck --filter @vuetify/v0 2>&1 | tail -10`
Expected: No errors related to createNotifications

**Step 3: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.ts
git commit -m "feat(createNotifications): implement core composable"
```

---

### Task 3: Plugin Triple — createNotificationsPlugin, useNotifications

**Files:**
- Modify: `packages/0/src/composables/createNotifications/index.ts`

**Step 1: Add plugin triple**

Append at the end of `index.ts`:

```ts
export interface NotificationsPluginOptions extends NotificationsOptions {
  namespace?: string
}

export const [
  createNotificationsContext,
  createNotificationsPlugin,
  useNotifications,
] = createPluginContext<NotificationsPluginOptions, NotificationsContext>(
  'v0:notifications',
  options => createNotifications(options),
)
```

**Step 2: Add barrel export**

In `packages/0/src/composables/index.ts`, add alphabetically:

```ts
export * from './createNotifications'
```

**Step 3: Verify**

Run: `pnpm typecheck --filter @vuetify/v0 2>&1 | tail -10`
Expected: Clean

**Step 4: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.ts packages/0/src/composables/index.ts
git commit -m "feat(createNotifications): add plugin triple and barrel export"
```

---

### Task 4: Tests — Core Lifecycle

**Files:**
- Create: `packages/0/src/composables/createNotifications/index.test.ts`

**Step 1: Write core lifecycle tests**

```ts
import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { createNotifications } from './index'

function withScope<T> (fn: () => T): T {
  const scope = effectScope()
  return scope.run(fn)!
}

describe('createNotifications', () => {
  it('should create an empty notifications context', () => {
    withScope(() => {
      const notifications = createNotifications()
      expect(notifications.items.value).toEqual([])
      expect(notifications.total.value).toBe(0)
      expect(notifications.unreadCount.value).toBe(0)
      expect(notifications.unseenCount.value).toBe(0)
    })
  })

  it('should notify and add to items', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({
        subject: 'Test',
        severity: 'info',
      })

      expect(ticket.subject).toBe('Test')
      expect(ticket.severity).toBe('info')
      expect(ticket.createdAt).toBeInstanceOf(Date)
      expect(ticket.readAt).toBeNull()
      expect(ticket.seenAt).toBeNull()
      expect(ticket.archivedAt).toBeNull()
      expect(ticket.snoozedUntil).toBeNull()
      expect(notifications.items.value).toHaveLength(1)
      expect(notifications.total.value).toBe(1)
    })
  })

  it('should default timeout to -1 (persistent)', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Persistent' })
      expect(ticket.timeout).toBe(-1)
    })
  })

  it('should use custom timeout', () => {
    withScope(() => {
      const notifications = createNotifications({ timeout: 5000 })
      const ticket = notifications.notify({ subject: 'Custom' })
      expect(ticket.timeout).toBe(5000)
    })
  })
})
```

**Step 2: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createNotifications/index.test.ts`
Expected: All pass

**Step 3: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.test.ts
git commit -m "feat(createNotifications): add core lifecycle tests"
```

---

### Task 5: Tests — State Mutations

**Files:**
- Modify: `packages/0/src/composables/createNotifications/index.test.ts`

**Step 1: Add mutation tests**

```ts
describe('state mutations', () => {
  it('should read and unread', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })

      notifications.read(ticket.id)
      expect(notifications.get(ticket.id)?.readAt).toBeInstanceOf(Date)
      expect(notifications.unreadCount.value).toBe(0)

      notifications.unread(ticket.id)
      expect(notifications.get(ticket.id)?.readAt).toBeNull()
      expect(notifications.unreadCount.value).toBe(1)
    })
  })

  it('should seen', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })
      expect(notifications.unseenCount.value).toBe(1)

      notifications.seen(ticket.id)
      expect(notifications.get(ticket.id)?.seenAt).toBeInstanceOf(Date)
      expect(notifications.unseenCount.value).toBe(0)
    })
  })

  it('should archive and unarchive', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })

      notifications.archive(ticket.id)
      expect(notifications.get(ticket.id)?.archivedAt).toBeInstanceOf(Date)

      notifications.unarchive(ticket.id)
      expect(notifications.get(ticket.id)?.archivedAt).toBeNull()
    })
  })

  it('should snooze and unsnooze', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })
      const until = new Date(Date.now() + 60_000)

      notifications.snooze(ticket.id, until)
      expect(notifications.get(ticket.id)?.snoozedUntil).toEqual(until)

      notifications.unsnooze(ticket.id)
      expect(notifications.get(ticket.id)?.snoozedUntil).toBeNull()
    })
  })

  it('should readAll', () => {
    withScope(() => {
      const notifications = createNotifications()
      notifications.notify({ subject: 'A' })
      notifications.notify({ subject: 'B' })
      notifications.notify({ subject: 'C' })
      expect(notifications.unreadCount.value).toBe(3)

      notifications.readAll()
      expect(notifications.unreadCount.value).toBe(0)
    })
  })

  it('should archiveAll', () => {
    withScope(() => {
      const notifications = createNotifications()
      notifications.notify({ subject: 'A' })
      notifications.notify({ subject: 'B' })

      notifications.archiveAll()
      for (const ticket of notifications.items.value) {
        expect(ticket.archivedAt).toBeInstanceOf(Date)
      }
    })
  })

  it('should dismiss via ticket convenience method', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })
      expect(notifications.total.value).toBe(1)

      ticket.dismiss()
      expect(notifications.total.value).toBe(0)
    })
  })

  it('should dismiss via ticket state methods', () => {
    withScope(() => {
      const notifications = createNotifications()
      const ticket = notifications.notify({ subject: 'Test' })

      ticket.read()
      expect(notifications.get(ticket.id)?.readAt).toBeInstanceOf(Date)

      ticket.seen()
      expect(notifications.get(ticket.id)?.seenAt).toBeInstanceOf(Date)

      ticket.archive()
      expect(notifications.get(ticket.id)?.archivedAt).toBeInstanceOf(Date)
    })
  })
})
```

**Step 2: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createNotifications/index.test.ts`
Expected: All pass

**Step 3: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.test.ts
git commit -m "feat(createNotifications): add state mutation tests"
```

---

### Task 6: Tests — Events and Adapter

**Files:**
- Modify: `packages/0/src/composables/createNotifications/index.test.ts`

**Step 1: Add event and adapter tests**

```ts
describe('events', () => {
  it('should emit notification:received on notify', () => {
    withScope(() => {
      const notifications = createNotifications()
      const handler = vi.fn()
      notifications.on('notification:received', handler)

      notifications.notify({ subject: 'Test' })
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  it('should emit notification:read on read', () => {
    withScope(() => {
      const notifications = createNotifications()
      const handler = vi.fn()
      notifications.on('notification:read', handler)

      const ticket = notifications.notify({ subject: 'Test' })
      notifications.read(ticket.id)
      expect(handler).toHaveBeenCalledWith(ticket.id)
    })
  })
})

describe('adapter', () => {
  it('should call adapter with context', () => {
    withScope(() => {
      const adapter = vi.fn()
      createNotifications({ adapter })
      expect(adapter).toHaveBeenCalledOnce()

      const ctx = adapter.mock.calls[0][0]
      expect(ctx).toHaveProperty('notify')
      expect(ctx).toHaveProperty('on')
      expect(ctx).toHaveProperty('off')
    })
  })

  it('should call adapter cleanup on dispose', () => {
    withScope(() => {
      const cleanup = vi.fn()
      const adapter = vi.fn(() => cleanup)
      const notifications = createNotifications({ adapter })

      notifications.dispose()
      expect(cleanup).toHaveBeenCalledOnce()
    })
  })

  it('should allow adapter to push notifications', () => {
    withScope(() => {
      const adapter: NotificationsAdapter = (ctx) => {
        ctx.notify({ subject: 'From adapter', severity: 'info' })
      }
      const notifications = createNotifications({ adapter })
      expect(notifications.items.value).toHaveLength(1)
      expect(notifications.items.value[0].subject).toBe('From adapter')
    })
  })

  it('should allow adapter to listen to events', () => {
    withScope(() => {
      const reads: ID[] = []
      const adapter: NotificationsAdapter = (ctx) => {
        ctx.on('notification:read', (id: ID) => reads.push(id))
      }
      const notifications = createNotifications({ adapter })
      const ticket = notifications.notify({ subject: 'Test' })

      notifications.read(ticket.id)
      expect(reads).toEqual([ticket.id])
    })
  })
})
```

(Add `import type { NotificationsAdapter } from './index'` and `import type { ID } from '#v0/types'` to the imports.)

**Step 2: Run tests**

Run: `pnpm vitest run packages/0/src/composables/createNotifications/index.test.ts`
Expected: All pass

**Step 3: Commit**

```bash
git add packages/0/src/composables/createNotifications/index.test.ts
git commit -m "feat(createNotifications): add event and adapter tests"
```

---

### Task 7: Typecheck and Lint

**Files:** All created files

**Step 1: Typecheck**

Run: `pnpm typecheck --filter @vuetify/v0`
Expected: Clean

**Step 2: Lint fix**

Run: `pnpm lint:fix`
Expected: Clean or auto-fixed

**Step 3: Run full test suite**

Run: `pnpm test:run`
Expected: All pass, no regressions

**Step 4: Commit any lint fixes**

```bash
git add -A
git commit -m "chore(createNotifications): lint fixes"
```

---

### Task 8: Documentation Page

**Files:**
- Create: `apps/docs/src/pages/composables/plugins/create-notifications.md`

**Step 1: Write documentation page**

Standard composable page structure with frontmatter, usage, architecture diagram, and examples. Follow the pattern from other composable docs (e.g., `create-queue.md`). Include:

- Frontmatter with title, meta, features
- Usage section with basic `notify()` example
- State mutations section
- Adapter section with Knock/Novu examples from design doc
- Plugin installation section
- `<DocsApi />`

**Step 2: Verify docs build**

Run: `cd apps/docs && pnpm build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/docs/
git commit -m "docs(createNotifications): add documentation page"
```
