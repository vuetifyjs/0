import { afterEach, vi } from 'vitest'

// Utilities
// Auto-unmount Vue Test Utils wrappers after every test so resize observers,
// effect scopes, and useTimer instances created via `mount(...)` are cleaned
// up between tests. Without this, hundreds of inline mounts accumulate per
// test file and can keep workers alive on CI under vmThreads + v8 coverage.
import { enableAutoUnmount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

// Restore real timers after every test. A handful of tests opt into
// `vi.useFakeTimers()` inline (try/finally) but a few historical paths only
// pair their fake-timer setup once per file. Calling `useRealTimers` here is
// idempotent and prevents fake-timer state from bleeding across files when
// vmThreads reuses worker contexts.
afterEach(() => {
  vi.useRealTimers()
})
