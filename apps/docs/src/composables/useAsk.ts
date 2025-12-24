/**
 * @module useAsk
 *
 * @remarks
 * Chat state management for the AI Q&A feature.
 * Handles message history, streaming responses, and UI state.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0/constants'

// Composables
import { usePageContext } from './usePageContext'

// Utilities
import { readonly, shallowRef } from 'vue'

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
  messages: Readonly<ShallowRef<Message[]>>
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

const API_URL = `${import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'}/docs/ask`

let messageId = 0
function createId () {
  return `msg-${++messageId}-${Date.now()}`
}

/**
 * Creates a chat instance for AI Q&A.
 *
 * @returns Chat state and controls
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAsk } from '@/composables/useAsk'
 *
 * const { messages, isOpen, ask, open, close } = useAsk()
 *
 * async function handleSubmit(question: string) {
 *   await ask(question)
 * }
 * </script>
 * ```
 */
export function useAsk (): UseAskReturn {
  const { context } = usePageContext()

  const messages: ShallowRef<Message[]> = shallowRef([])
  const isOpen = shallowRef(false)
  const isLoading = shallowRef(false)
  const error: ShallowRef<string | null> = shallowRef(null)

  let abortController: AbortController | null = null

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          context: context.value,
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
