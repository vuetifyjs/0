/**
 * @module useAsk
 *
 * @remarks
 * Chat state management for the AI Q&A feature.
 * Handles message history, streaming responses, and UI state.
 * Fetches dynamic page context (examples, API, benchmarks, related) on-demand.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

// Utilities
import { readonly, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

// Types
import type { ApiData } from '../../build/generate-api'
import type { ExamplesData } from '../../build/generate-examples'
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

// Context types sent to API
interface ApiContext {
  name: string
  kind: 'component' | 'composable'
  props?: Array<{ name: string, type: string, required: boolean, default?: string, description?: string }>
  events?: Array<{ name: string, type: string, description?: string }>
  slots?: Array<{ name: string, type?: string, description?: string }>
  options?: Array<{ name: string, type: string, required: boolean, default?: string, description?: string }>
  methods?: Array<{ name: string, type: string, description?: string }>
  properties?: Array<{ name: string, type: string, description?: string }>
}

interface BenchmarkSummary {
  name: string
  hz: number
  mean: number
}

interface RelatedPage {
  path: string
  title: string
}

interface PageContext {
  examples?: Record<string, string>
  api?: ApiContext[]
  benchmarks?: BenchmarkSummary[]
  related?: RelatedPage[]
}

const API_URL = `${import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'}/docs/ask`

let messageId = 0
function createId () {
  return `msg-${++messageId}-${Date.now()}`
}

// Caches
let examplesCache: ExamplesData | null = null
let apiCache: ApiData | null = null
let searchIndexCache: Array<{ path: string, title: string }> | null = null
let benchmarksCache: Record<string, BenchmarkSummary[]> | null = null

async function getExamplesData (): Promise<ExamplesData> {
  if (examplesCache) return examplesCache
  try {
    const response = await fetch('/examples.json')
    if (!response.ok) return {}
    examplesCache = await response.json()
    return examplesCache!
  } catch {
    return {}
  }
}

async function getApiData (): Promise<ApiData> {
  if (apiCache) return apiCache
  try {
    const response = await fetch('/api.json')
    if (!response.ok) return { components: {}, composables: {} }
    apiCache = await response.json()
    return apiCache!
  } catch {
    return { components: {}, composables: {} }
  }
}

async function getSearchIndex (): Promise<Array<{ path: string, title: string }>> {
  if (searchIndexCache) return searchIndexCache
  try {
    const response = await fetch('/search-index.json')
    if (!response.ok) return []
    const data = await response.json()
    searchIndexCache = data.map((d: { path: string, title: string }) => ({ path: d.path, title: d.title }))
    return searchIndexCache!
  } catch {
    return []
  }
}

async function getBenchmarksData (): Promise<Record<string, BenchmarkSummary[]>> {
  if (benchmarksCache) return benchmarksCache
  try {
    const response = await fetch('/benchmarks.json')
    if (!response.ok) return {}

    const data = await response.json()
    const result: Record<string, BenchmarkSummary[]> = {}

    for (const file of data.files || []) {
      // Extract composable name from filepath
      // e.g., ".../useFilter/index.bench.ts" -> "use-filter"
      const match = file.filepath.match(/\/(use[A-Z][a-zA-Z]+)\//)
      if (!match) continue

      const composableName = match[1]
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '')

      const benchmarks: BenchmarkSummary[] = []
      for (const group of file.groups || []) {
        for (const bench of group.benchmarks || []) {
          benchmarks.push({
            name: bench.name,
            hz: bench.hz,
            mean: bench.mean,
          })
        }
      }

      if (benchmarks.length > 0) {
        result[composableName] = benchmarks
      }
    }

    benchmarksCache = result
    return result
  } catch {
    return {}
  }
}

/** Extract the page slug from path for matching examples/api */
function getPageSlug (path: string): string | null {
  // /components/*/step -> step
  // /composables/*/use-selection -> use-selection
  const match = path.match(/\/(components|composables)\/[^/]+\/([^/]+)/)
  return match?.[2] ?? null
}

/** Get API data for a page */
function getApiForPage (path: string, apiData: ApiData): ApiContext[] | undefined {
  const slug = getPageSlug(path)
  if (!slug) return undefined

  if (path.includes('/components/')) {
    // Convert slug to PascalCase prefix: step -> Step
    const prefix = slug.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')

    const apis = Object.entries(apiData.components)
      .filter(([name]) => name.startsWith(prefix))
      .map(([, api]) => ({
        name: api.name,
        kind: 'component' as const,
        props: api.props,
        events: api.events,
        slots: api.slots,
      }))

    return apis.length > 0 ? apis : undefined
  }

  if (path.includes('/composables/')) {
    // Convert slug to camelCase: use-selection -> useSelection
    const camelName = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

    const api = apiData.composables[camelName]
    if (api) {
      return [{
        name: api.name,
        kind: 'composable' as const,
        options: api.options,
        methods: api.methods,
        properties: api.properties,
      }]
    }
  }

  return undefined
}

/** Get related pages with resolved titles */
async function _getRelatedPages (frontmatterRelated: string[] | undefined): Promise<RelatedPage[] | undefined> {
  if (!frontmatterRelated?.length) return undefined

  const searchIndex = await getSearchIndex()
  const related: RelatedPage[] = []

  for (const relatedPath of frontmatterRelated) {
    const doc = searchIndex.find(d => d.path === relatedPath)
    if (doc) {
      related.push({ path: doc.path, title: doc.title })
    } else {
      // Fallback: generate title from path
      const title = relatedPath.split('/').pop()?.split('-').map(
        p => p.charAt(0).toUpperCase() + p.slice(1),
      ).join(' ') ?? relatedPath
      related.push({ path: relatedPath, title })
    }
  }

  return related.length > 0 ? related : undefined
}

/** Fetch all dynamic context for the current page */
async function fetchPageContext (path: string): Promise<PageContext> {
  if (!IN_BROWSER || path === '/' || path === '') {
    return {}
  }

  const slug = getPageSlug(path)
  if (!slug) return {}

  const [examplesData, apiData, benchmarksData] = await Promise.all([
    getExamplesData(),
    getApiData(),
    getBenchmarksData(),
  ])

  const context: PageContext = {}

  // Get examples for this page
  const examples = examplesData[slug]
  if (examples && Object.keys(examples).length > 0) {
    context.examples = examples
  }

  // Get API data
  const api = getApiForPage(path, apiData)
  if (api) {
    context.api = api
  }

  // Get benchmarks (composables only)
  if (path.includes('/composables/')) {
    const benchmarks = benchmarksData[slug]
    if (benchmarks) {
      context.benchmarks = benchmarks
    }
  }

  // TODO: Get related pages from frontmatter
  // This requires access to the page's frontmatter which isn't easily available here
  // For now, skip related - can be added later if needed

  return context
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

    // Get conversation history (last 6 messages, excluding the new ones)
    const history = messages.value
      .filter(m => m.content.trim()) // Only include messages with content
      .slice(-6)
      .map(m => ({ role: m.role, content: m.content }))

    messages.value = [...messages.value, userMessage, assistantMessage]

    abortController = new AbortController()

    try {
      // Fetch dynamic page context
      const context = await fetchPageContext(route.path)

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          path: route.path,
          history: history.length > 0 ? history : undefined,
          context: Object.keys(context).length > 0 ? context : undefined,
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

      // Buffer chunks and batch updates at ~60fps for performance
      let pendingContent = ''
      let rafId: number | null = null

      function flushPendingContent () {
        rafId = null
        if (!pendingContent) return

        const lastMessage = messages.value.at(-1)
        if (lastMessage?.role === 'assistant') {
          messages.value = [
            ...messages.value.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + pendingContent },
          ]
        }
        pendingContent = ''
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        pendingContent += decoder.decode(value, { stream: true })

        // Schedule update on next animation frame (batches rapid chunks)
        if (!rafId) {
          rafId = requestAnimationFrame(flushPendingContent)
        }
      }

      // Cancel pending frame and flush remaining content
      if (rafId) cancelAnimationFrame(rafId)
      pendingContent += decoder.decode()
      flushPendingContent()
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
