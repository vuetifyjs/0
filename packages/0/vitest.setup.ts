import { afterEach, vi } from 'vitest'

// Utilities
// Auto-unmount Vue Test Utils wrappers after every test so resize observers,
// effect scopes, and useTimer instances created via `mount(...)` are cleaned
// up between tests. Without this, hundreds of inline mounts accumulate per
// test file and can keep workers alive on CI under vmThreads + v8 coverage.
//
// Wrapped in try/catch because vitest's bench pool re-imports this module
// across bench files in the same process, and @vue/test-utils throws if
// `enableAutoUnmount` is called more than once. Benches don't use `mount(...)`
// so the side effect is harmless either way.
import { enableAutoUnmount } from '@vue/test-utils'

try {
  enableAutoUnmount(afterEach)
} catch {
  // already enabled in a sibling bench/test file's import
}

// Restore real timers after every test. A handful of tests opt into
// `vi.useFakeTimers()` inline (try/finally) but a few historical paths only
// pair their fake-timer setup once per file. Calling `useRealTimers` here is
// idempotent and prevents fake-timer state from bleeding across files when
// vmThreads reuses worker contexts.
afterEach(() => {
  vi.useRealTimers()
})
