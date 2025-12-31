/**
 * @module useAsk
 *
 * @remarks
 * Chat state management for the AI Q&A feature.
 * Handles message history, streaming responses, and UI state.
 * Fetches page context on-demand when a question is asked.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

// Utilities
import { readonly, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { Ref, ShallowRef } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface UseAskReturn {
  /** Chat message history */
  messages: Readonly<ShallowRef<readonly Message[]>>
  /** Whether the sheet is open */
  isOpen: Readonly<Ref<boolean>>
  /** Whether a response is being generated */
  isLoading: Readonly<Ref<boolean>>
  /** Current error message */
  error: Readonly<Ref<string | null>>
  /** Submit a question */
  ask: (question: string) => Promise<void>
  /** Clear chat history */
  clear: () => void
  /** Open the chat sheet */
  open: () => void
  /** Close the chat sheet */
  close: () => void
  /** Toggle the chat sheet */
  toggle: () => void
  /** Stop the current streaming response */
  stop: () => void
}

interface PageContext {
  path: string
  title: string
  content: string
  loaded: boolean
}

const API_URL = `${import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'}/docs/ask`

let messageId = 0
function createId () {
  return `msg-${++messageId}-${Date.now()}`
}

/** Convert kebab-case slug to API name (PascalCase or camelCase) */
function slugToApiName (slug: string): { pascal: string, camel: string } {
  const pascal = slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  const camel = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return { pascal, camel }
}

interface ApiMember {
  name: string
  type: string
  required?: boolean
  default?: string
  description?: string
}

interface ApiData {
  kind: 'component' | 'composable'
  name: string
  props?: ApiMember[]
  events?: ApiMember[]
  slots?: ApiMember[]
  options?: ApiMember[]
  properties?: ApiMember[]
  methods?: ApiMember[]
}

interface ApiJsonData {
  components: Record<string, ApiData>
  composables: Record<string, ApiData>
}

function formatApiSection (title: string, items: ApiMember[], includeRequired = false): string[] {
  if (!items?.length) return []

  const lines = [`## ${title}\n`]
  for (const item of items) {
    const required = includeRequired && item.required ? ' (required)' : ''
    const defaultVal = item.default ? ` = ${item.default}` : ''
    lines.push(`- **${item.name}**: \`${item.type}\`${required}${defaultVal}`)
    if (item.description) lines.push(`  ${item.description}`)
  }
  lines.push('')
  return lines
}

/** Format API data as readable content for context */
function formatApiContent (api: ApiData): string {
  const header = [`# ${api.name} API\n`]

  let sections: string[] = []
  if (api.kind === 'component') {
    sections = [
      ...formatApiSection('Props', api.props ?? [], true),
      ...formatApiSection('Events', api.events ?? []),
      ...formatApiSection('Slots', api.slots ?? []),
    ]
  } else if (api.kind === 'composable') {
    sections = [
      ...formatApiSection('Options', api.options ?? [], true),
      ...formatApiSection('Properties', api.properties ?? []),
      ...formatApiSection('Methods', api.methods ?? []),
    ]
  }

  return [...header, ...sections].join('\n')
}

/** Fetch API context for /api/* routes */
async function fetchApiContext (path: string): Promise<PageContext> {
  try {
    const slug = path.replace(/^\/api\//, '')
    if (!slug) {
      return { path, title: 'API Reference', content: 'API documentation for @vuetify/v0 components and composables.', loaded: true }
    }

    const response = await fetch('/api.json')
    if (!response.ok) {
      return { path, title: '', content: '', loaded: false }
    }

    const data = await response.json() as ApiJsonData

    const { pascal, camel } = slugToApiName(slug)

    // Try component first, then composable
    const api = data.components[pascal] ?? data.composables[camel]
    if (!api) {
      return { path, title: '', content: '', loaded: false }
    }

    const name = api.name ?? pascal
    return {
      path,
      title: `${name} API`,
      content: formatApiContent(api),
      loaded: true,
    }
  } catch {
    return { path, title: '', content: '', loaded: false }
  }
}

interface SearchDocument {
  id: string
  title: string
  category: string
  path: string
  headings: string[]
  content: string
}

let searchIndexCache: SearchDocument[] | null = null

/** Fetch the search index (cached) */
async function getSearchIndex (): Promise<SearchDocument[]> {
  if (searchIndexCache) return searchIndexCache

  try {
    const response = await fetch('/search-index.json')
    if (!response.ok) return []
    searchIndexCache = await response.json() as SearchDocument[]
    return searchIndexCache
  } catch {
    return []
  }
}

/** Fetch page context from search index */
async function fetchPageContext (path: string): Promise<PageContext> {
  if (!IN_BROWSER || path === '/' || path === '') {
    return { path, title: '', content: '', loaded: false }
  }

  // Handle API routes specially (uses api.json for detailed type info)
  if (path.startsWith('/api')) {
    return fetchApiContext(path)
  }

  try {
    const index = await getSearchIndex()
    const doc = index.find(d => d.path === path)

    if (!doc) {
      return { path, title: '', content: '', loaded: false }
    }

    return {
      path,
      title: doc.title,
      content: doc.content,
      loaded: true,
    }
  } catch {
    return { path, title: '', content: '', loaded: false }
  }
}

// Module-level singleton state (shared across all useAsk calls)
const messages: ShallowRef<Message[]> = shallowRef([])
const isOpen = shallowRef(false)
const isLoading = shallowRef(false)
const error: ShallowRef<string | null> = shallowRef(null)
let abortController: AbortController | null = null

/**
 * Creates a chat instance for AI Q&A.
 *
 * @returns Chat state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *  import { useAsk } from '@/composables/useAsk'
 *
 *  const { messages, isOpen, ask, open, close } = useAsk()
 *
 *  async function handleSubmit(question: string) {
 *    await ask(question)
 *  }
 * </script>
 * ```
 */
export function useAsk (): UseAskReturn {
  const route = useRoute()

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    isOpen.value = !isOpen.value
  }

  function clear () {
    messages.value = []
    error.value = null
  }

  function stop () {
    if (abortController) {
      abortController.abort()
      abortController = null
      isLoading.value = false
    }
  }

  async function ask (question: string) {
    if (!IN_BROWSER || !question.trim()) return
    if (isLoading.value) return

    error.value = null
    isLoading.value = true
    open()

    // Add user message
    const userMessage: Message = {
      id: createId(),
      role: 'user',
      content: question.trim(),
      timestamp: Date.now(),
    }

    // Add assistant placeholder
    const assistantMessage: Message = {
      id: createId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    messages.value = [...messages.value, userMessage, assistantMessage]

    abortController = new AbortController()

    try {
      // Fetch page context on-demand
      const context = await fetchPageContext(route.path)

      // Warn if context failed to load - prepend notice to assistant message
      if (!context.loaded && route.path !== '/') {
        const updatedMessages = [...messages.value]
        const lastMessage = updatedMessages.at(-1)
        if (lastMessage?.role === 'assistant') {
          lastMessage.content = '*Note: Page context unavailable. Response may be general.*\n\n'
          messages.value = updatedMessages
        }
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          context,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before asking another question.')
        }
        throw new Error('Failed to get response. Please try again.')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Streaming not supported')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        // Update the assistant message content
        const updatedMessages = [...messages.value]
        const lastMessage = updatedMessages.at(-1)
        if (lastMessage?.role === 'assistant') {
          lastMessage.content += chunk
          messages.value = updatedMessages
        }
      }
    } catch (error_) {
      if ((error_ as Error).name === 'AbortError') {
        // User cancelled - keep partial response
        return
      }

      error.value = (error_ as Error).message

      // Remove empty assistant message on error
      const updatedMessages = [...messages.value]
      const lastMessage = updatedMessages.at(-1)
      if (lastMessage?.role === 'assistant' && !lastMessage.content) {
        updatedMessages.pop()
        messages.value = updatedMessages
      }
    } finally {
      isLoading.value = false
      abortController = null
    }
  }

  return {
    messages: readonly(messages),
    isOpen: readonly(isOpen),
    isLoading: readonly(isLoading),
    error: readonly(error),
    ask,
    clear,
    open,
    close,
    toggle,
    stop,
  }
}
