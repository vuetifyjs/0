/**
 * @module useKeydown
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-keydown
 *
 * @remarks
 * Keydown event listener plugin with key filtering and automatic cleanup.
 *
 * Key features:
 * - Global keyboard event coordination
 * - Key-specific event handling with registry
 * - preventDefault and stopPropagation options
 * - Automatic cleanup on scope disposal
 * - Plugin-first architecture for app-level usage
 *
 * Plugin-primary composable for managing document-level keyboard events.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createKeydownPlugin } from '@vuetify/v0'
 *
 * const app = createApp(App)
 * app.use(createKeydownPlugin())
 * ```
 */

// Factories
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'
import { createContext, useContext } from '#v0/composables/createContext'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'

// Utilities
import { onMounted, getCurrentScope, onScopeDispose, shallowReadonly, shallowRef } from 'vue'

// Globals
import { IN_DOCUMENT } from '#v0/constants'

// Types
import type { RegistryTicket, RegistryContext, RegistryOptions } from '#v0/composables/useRegistry'
import type { App, Ref } from 'vue'
import type { ContextTrinity } from '#v0/composables/createTrinity'

export interface KeyHandler {
  /**
   * The key to listen for. This can be a single character, a modifier key (e.g., `Control`, `Shift`),
   * or a special key (e.g., `ArrowUp`).
   */
  key: string
  /**
   * The handler function to call when the specified key is pressed.
   *
   * @param event The KeyboardEvent object containing details about the keydown event.
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-handler
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Escape',
   *   handler: (event) => {
   *     console.log('Escape key pressed!', event)
   *   },
   * })
   * ```
   */
  handler: (event: KeyboardEvent) => void
  /**
   * Whether to call event.preventDefault() when the handler is invoked.
   *
   * @default false
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-preventdefault
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Tab',
   *   handler: (event) => {
   *     console.log('Tab key pressed!', event)
   *   },
   *   preventDefault: true,
   * })
   * ```
   */
  preventDefault?: boolean
  /**
   * Whether to call event.stopPropagation() when the handler is invoked.
   *
   * @default false
   *
   * @see https://0.vuetify.dev/api/composables/use-keydown#keyhandler-stoppropagation
   *
   * @example
   * ```ts
   * import { useKeydown } from '@vuetify/v0'
   *
   * useKeydown({
   *   key: 'Escape',
   *   handler: (event) => {
   *     console.log('Escape key pressed!', event)
   *   },
   *   stopPropagation: true,
   * })
   * ```
   */
  stopPropagation?: boolean
}

export interface KeyHandlerTicket extends RegistryTicket, KeyHandler {}

export interface KeydownContext<Z extends KeyHandlerTicket = KeyHandlerTicket> extends RegistryContext<Z> {
  /**
   * Reactive state indicating whether keyboard listeners are active.
   */
  isListening: Readonly<Ref<boolean>>
  /**
   * Manually start listening for keyboard events.
   */
  startListening: () => void
  /**
   * Manually stop listening for keyboard events.
   */
  stopListening: () => void
}

export interface KeydownOptions extends RegistryOptions {
  /**
   * Whether to start listening immediately when called in a component scope.
   * @default true
   */
  immediate?: boolean
}

export interface KeydownContextOptions extends KeydownOptions {
  namespace?: string
}

export interface KeydownPluginOptions extends KeydownContextOptions {}

/**
 * Creates a new keydown instance.
 *
 * @param options The options for the keydown instance.
 * @template Z The type of the keydown ticket.
 * @template E The type of the keydown context.
 * @returns A new keydown instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-keydown
 *
 * @example
 * ```ts
 * import { createKeydown } from '@vuetify/v0'
 *
 * const keydown = createKeydown({ immediate: false })
 *
 * keydown.register({
 *   key: 'Escape',
 *   handler: (event) => console.log('Escape pressed'),
 *   preventDefault: true
 * })
 *
 * keydown.startListening()
 * ```
 */
export function createKeydown<
  Z extends KeyHandlerTicket = KeyHandlerTicket,
  E extends KeydownContext<Z> = KeydownContext<Z>,
> (_options: KeydownOptions = {}): E {
  const { immediate = true, ...options } = _options
  const registry = useRegistry<Z, E>(options)
  const isListening = shallowRef(false)
  let documentListener: ((event: KeyboardEvent) => void) | null = null

  function startDocumentListener () {
    if (documentListener || !IN_DOCUMENT) return

    documentListener = (event: KeyboardEvent) => {
      for (const handler of registry.values()) {
        if (handler.key === event.key) {
          if (handler.preventDefault) event.preventDefault()
          if (handler.stopPropagation) event.stopPropagation()
          handler.handler(event)
        }
      }
    }

    document.addEventListener('keydown', documentListener)
  }

  function stopDocumentListener () {
    if (!IN_DOCUMENT || !documentListener) return

    document.removeEventListener('keydown', documentListener)
    documentListener = null
  }

  function startListening () {
    if (isListening.value) return

    startDocumentListener()
    isListening.value = true
  }

  function stopListening () {
    if (!isListening.value) return

    stopDocumentListener()
    isListening.value = false
  }

  if (getCurrentScope() && immediate) {
    onMounted(startListening)
  }

  onScopeDispose(stopListening, true)

  return {
    ...registry,
    startListening,
    stopListening,
    isListening: shallowReadonly(isListening),
  } as E
}

/**
 * Creates a new keydown context trinity.
 *
 * @param options The options for the keydown context.
 * @template Z The type of the keydown ticket.
 * @template E The type of the keydown context.
 * @returns A new keydown context trinity.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-keydown
 *
 * @example
 * ```ts
 * import { createKeydownContext } from '@vuetify/v0'
 *
 * const [useKeydownContext, provideKeydownContext, context] = createKeydownContext({
 *   namespace: 'my-app:keydown'
 * })
 * ```
 */
export function createKeydownContext<
  Z extends KeyHandlerTicket = KeyHandlerTicket,
  E extends KeydownContext<Z> = KeydownContext<Z>,
> (_options: KeydownContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:keydown', ...options } = _options
  const [useKeydownContext, _provideKeydownContext] = createContext<E>(namespace)
  const context = createKeydown<Z, E>(options)

  function provideKeydownContext (_context: E = context, app?: App): E {
    return _provideKeydownContext(_context, app)
  }

  return createTrinity<E>(useKeydownContext, provideKeydownContext, context)
}

/**
 * Creates a new keydown plugin.
 *
 * @param options The options for the keydown plugin.
 * @template Z The type of the keydown ticket.
 * @template E The type of the keydown context.
 * @returns A new keydown plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-keydown
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createKeydownPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(createKeydownPlugin())
 *
 * app.mount('#app')
 * ```
 */
export function createKeydownPlugin<
  Z extends KeyHandlerTicket = KeyHandlerTicket,
  E extends KeydownContext<Z> = KeydownContext<Z>,
> (_options: KeydownPluginOptions = {}) {
  const { namespace = 'v0:keydown', ...options } = _options
  const [, provideKeydownContext, context] = createKeydownContext<Z, E>({ ...options, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideKeydownContext(context, app)
    },
  })
}

/**
 * Returns the current keydown instance from context.
 *
 * @param namespace The namespace for the keydown context. Defaults to `v0:keydown`.
 * @returns The current keydown instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-keydown
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useKeydown } from '@vuetify/v0'
 *
 *   const keydown = useKeydown()
 *
 *   keydown.register({
 *     key: 'Escape',
 *     handler: () => console.log('Escape pressed')
 *   })
 * </script>
 * ```
 */
export function useKeydown<
  Z extends KeyHandlerTicket = KeyHandlerTicket,
  E extends KeydownContext<Z> = KeydownContext<Z>,
> (namespace = 'v0:keydown'): E {
  return useContext<E>(namespace)
}

