# createNotifications

Headless notification management composable for v0. Manages notification lifecycle with optional service adapters (Knock, Novu, custom).

## Prior Art

| | Knock | Novu | v0 |
|--|-------|------|----|
| Collection | Feed | Inbox | notifications |
| Item | FeedItem | Notification | NotificationTicket |
| States | seen, read, archived | seen, read, archived, snoozed | seen, read, archived, snoozed |
| Mutations | `markAsRead()` | `read()` | `read()` |
| Bulk | `markAllAsRead()` | `readAll()` | `readAll()` |
| Real-time | WebSocket | WebSocket | Registry events |
| Actions | primary/secondary buttons | primaryAction/secondaryAction | primaryAction/secondaryAction |
| Adapter | N/A (is the service) | N/A (is the service) | Function that wires events |

v0 adopts Novu's naming style: bare verbs, `Notification` terminology, compound `All` suffix for bulk ops.

## Architecture

Built on existing primitives:

- **createQueue** — FIFO queue with auto-timeout, pause/resume, dismiss
- **createRegistry** — events system (`on`, `off`, `emit`) for adapter integration
- **createPlugin** — app-level installation via `createNotificationsPlugin`

No new infrastructure required.

## API Surface

### createNotifications

```ts
const notifications = createNotifications({
  timeout: -1,              // default per-notification timeout, -1 = persistent
  adapter: knockAdapter,    // optional
})
```

### Push

```ts
notifications.notify({
  subject: 'Deployed',
  body: 'v2.1.0 is live',
  severity: 'success',
  timeout: 5000,
})

notifications.notify({
  subject: 'Build failed',
  severity: 'error',
  primaryAction: { label: 'View logs', action: () => router.push('/logs') },
  secondaryAction: { label: 'Dismiss' },
  timeout: -1,
})
```

### State Mutations

```ts
// Single
notifications.read(id)
notifications.unread(id)
notifications.seen(id)
notifications.archive(id)
notifications.unarchive(id)
notifications.snooze(id, until)
notifications.unsnooze(id)
notifications.dismiss(id)       // remove from queue

// Bulk
notifications.readAll()
notifications.archiveAll()
notifications.clear()
```

### Reactive State

```ts
notifications.items         // ShallowRef<NotificationTicket[]>
notifications.unreadCount   // ComputedRef<number>
notifications.unseenCount   // ComputedRef<number>
notifications.total         // ComputedRef<number>
```

### Plugin Form

```ts
const NotificationsPlugin = createNotificationsPlugin({
  timeout: -1,
  adapter: knockAdapter,
})
app.use(NotificationsPlugin)

// In any component
const notifications = useNotifications()
notifications.notify({ subject: 'Hello', severity: 'info' })
```

## NotificationTicket

Extends `QueueTicket` with notification-specific state.

```ts
interface NotificationInput {
  id?: ID
  subject?: string
  body?: string
  severity?: 'info' | 'warning' | 'error' | 'success'
  data?: Record<string, unknown>
  primaryAction?: NotificationAction
  secondaryAction?: NotificationAction
  timeout?: number
}

interface NotificationAction {
  label: string
  action?: () => void
}

interface NotificationTicket extends NotificationInput {
  id: ID
  createdAt: Date
  readAt: Date | null
  seenAt: Date | null
  archivedAt: Date | null
  snoozedUntil: Date | null
  // Convenience methods
  read(): void
  unread(): void
  seen(): void
  archive(): void
  unarchive(): void
  snooze(until: Date): void
  unsnooze(): void
  dismiss(): void
}
```

Timestamps over booleans — enables "read 5 minutes ago" UIs and adapter sync.

## Events

Uses `createRegistry`'s built-in event system. All events namespaced under `notification:`.

| Event | Payload | When |
|-------|---------|------|
| `notification:received` | `NotificationTicket` | After `notify()` |
| `notification:read` | `id` | After `read()` |
| `notification:unread` | `id` | After `unread()` |
| `notification:seen` | `id` | After `seen()` |
| `notification:archived` | `id` | After `archive()` |
| `notification:unarchived` | `id` | After `unarchive()` |
| `notification:snoozed` | `id, until` | After `snooze()` |
| `notification:unsnoozed` | `id` | After `unsnooze()` |
| `notification:dismissed` | `id` | After `dismiss()` |

## Adapter Contract

```ts
type NotificationsAdapter = (context: NotificationsContext) => void | (() => void)
```

A function that receives the notifications context, wires up event listeners, and optionally returns a cleanup function. No interface to implement — just subscribe to the events you care about.

### NotificationsContext

Exposes the registry event system and `notify()` for inbound notifications:

```ts
interface NotificationsContext {
  notify(input: NotificationInput): NotificationTicket
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
}
```

### Example: Knock Adapter

```ts
function knockAdapter(ctx: NotificationsContext) {
  const feed = knock.feeds.initialize(feedId)

  // Inbound: Knock -> v0
  feed.on('items.received.realtime', ({ items }) => {
    for (const item of items) {
      ctx.notify({
        id: item.id,
        subject: item.blocks[0]?.rendered,
        data: item.data,
        severity: 'info',
      })
    }
  })

  // Outbound: v0 -> Knock
  ctx.on('notification:read', id => feed.markAsRead(id))
  ctx.on('notification:archived', id => feed.markAsArchived(id))

  return () => feed.teardown()
}
```

### Example: Novu Adapter

```ts
function novuAdapter(ctx: NotificationsContext) {
  const novu = new Novu({ subscriberId, applicationIdentifier })

  // Inbound
  novu.on('notifications.notification_received', notification => {
    ctx.notify({
      id: notification.id,
      subject: notification.subject,
      body: notification.body,
      severity: notification.severity ?? 'info',
      data: notification.data,
    })
  })

  // Outbound
  ctx.on('notification:read', id => novu.notifications.read(id))
  ctx.on('notification:archived', id => novu.notifications.archive(id))
  ctx.on('notification:snoozed', (id, until) => novu.notifications.snooze(id, until))

  return () => novu.destroy()
}
```

### Example: No Adapter (Local Only)

```ts
const notifications = createNotifications()
notifications.notify({ subject: 'Saved', severity: 'success', timeout: 3000 })
```

Works out of the box. No adapter required for local-only use.

## What This Doesn't Do

- **No components** — composable only. Components (`NotificationRoot`, `NotificationItem`, `NotificationList`, `NotificationBadge`) are a future layer.
- **No preferences** — per-workflow opt-in/out is a service concern, not a headless primitive.
- **No content blocks** — no markdown/button-set rendering. Use `data` for custom payloads.
- **No pagination** — can extend later via registry's `seek`/`lookup`.
- **No grouping/threading** — adapter can pre-group before calling `notify()`.
