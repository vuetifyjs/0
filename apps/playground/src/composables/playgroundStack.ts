// Framework
import { IN_BROWSER, isArray, isObject, isString } from '@vuetify/v0'

// Composables
import { ONE_API } from '@/composables/useOnePlaygrounds'

export type PlaygroundStack = 'v0' | 'vuetify'

const STACK_CACHE = new Map<string, PlaygroundStack>()

/** Stop reading after this many bytes — full content can be megabytes. */
const PEEK_LIMIT = 48_000

const PEEK_CONCURRENCY = 3

let peekActive = 0
const peekWait: Array<() => void> = []

export function rememberedStack (id: string) {
  return STACK_CACHE.get(id)
}

export function rememberStack (id: string, stack: PlaygroundStack) {
  STACK_CACHE.set(id, stack)
}

/**
 * Classify a One `content` blob as Vuetify0 or Vuetify 4.
 * Play tuples are always Vuetify 4. Do not sniff file source for `vuetify`
 * imports — that mis-detected play single-file playgrounds as v0 (#666).
 */
export function playgroundStack (content: string | undefined): PlaygroundStack | undefined {
  if (!content) return undefined

  try {
    const parsed: unknown = JSON.parse(content)
    if (isArray(parsed)) return 'vuetify'
    if (!isObject(parsed) || !('files' in parsed) || !isObject(parsed.files)) return undefined

    const settings = 'settings' in parsed && isObject(parsed.settings)
      ? parsed.settings
      : undefined
    if (settings && isString(settings.preset) && settings.preset === 'vuetify') {
      return 'vuetify'
    }

    return 'v0'
  } catch {
    return undefined
  }
}

/**
 * Decide from a truncated GET /one/playgrounds/:id body without downloading
 * the rest. Content is a JSON string nested in the response, so quotes are
 * escaped. Returns undefined when the prefix is not enough to tell.
 */
export function classifyResponsePrefix (buf: string): PlaygroundStack | undefined {
  if (
    buf.includes(String.raw`preset\":\"vuetify`)
    || buf.includes('preset":"vuetify')
  ) {
    return 'vuetify'
  }

  const marker = '"content"'
  const index = buf.indexOf(marker)
  if (index === -1) return undefined

  const after = buf.slice(index + marker.length).replace(/^[\s:]+/, '')
  if (after.startsWith('null')) return undefined
  if (!after.startsWith('"')) return undefined

  const inner = after.slice(1)
  if (inner.startsWith('[') || inner.startsWith(String.raw`\[`)) return 'vuetify'

  if ((
    inner.startsWith(String.raw`{\"settings\"`)
    || inner.startsWith('{"settings"')
  ) && (inner.includes(String.raw`\"files\"`) || inner.includes('"files"'))) return 'v0'

  return undefined
}

export function playgroundStackIcon (stack: PlaygroundStack | undefined) {
  if (stack === 'vuetify') return 'vuetify'
  if (stack === 'v0') return 'vuetify-0'
  return undefined
}

export function playgroundStackLabel (stack: PlaygroundStack | undefined) {
  if (stack === 'vuetify') return 'Vuetify 4'
  if (stack === 'v0') return 'Vuetify0'
  return undefined
}

async function withPeekSlot<T> (fn: () => Promise<T>): Promise<T> {
  if (peekActive >= PEEK_CONCURRENCY) {
    await new Promise<void>(resolve => peekWait.push(resolve))
  }
  peekActive++
  try {
    return await fn()
  } finally {
    peekActive--
    peekWait.shift()?.()
  }
}

/**
 * Classify a saved playground without downloading its full content blob.
 * Aborts the body once the prefix is enough, or at PEEK_LIMIT.
 */
export async function peekPlaygroundStack (id: string): Promise<PlaygroundStack | undefined> {
  const cached = rememberedStack(id)
  if (cached) return cached
  if (!IN_BROWSER) return undefined

  return withPeekSlot(async () => {
    const hit = rememberedStack(id)
    if (hit) return hit

    const res = await fetch(`${ONE_API}/one/playgrounds/${id}`, {
      credentials: 'include',
    })
    if (!res.ok || !res.body) return undefined

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buf = ''

    try {
      while (buf.length < PEEK_LIMIT) {
        const { done, value } = await reader.read()
        if (value) buf += decoder.decode(value, { stream: true })
        const stack = classifyResponsePrefix(buf)
        if (stack) {
          await reader.cancel()
          rememberStack(id, stack)
          return stack
        }
        if (done) {
          try {
            const data = JSON.parse(buf) as { content?: string, playground?: { content?: string } }
            const parsed = playgroundStack(data.playground?.content ?? data.content)
            if (parsed) {
              rememberStack(id, parsed)
              return parsed
            }
          } catch {
            // truncated or not JSON
          }
          break
        }
      }
      await reader.cancel()
      const stack = classifyResponsePrefix(buf)
      if (stack) rememberStack(id, stack)
      return stack
    } catch {
      try {
        await reader.cancel()
      } catch {
        // already closed
      }
      return undefined
    }
  })
}
