/**
 * @module SnackbarRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * A single snackbar instance. Provides dismiss context for Snackbar.Close.
 * Set ARIA role directly: role="alert" for urgent, role="status" for informational.
 *
 * When mounted under a Snackbar.Portal, the rendered text is mirrored into the
 * Portal's persistent announcers so the first message is reliably announced —
 * urgent routes to the assertive/alert region. Without a Portal the role
 * attributes remain as best-effort: some screen readers do not announce
 * role="status" regions injected via JS (nvaccess/nvda#14591), which is what a
 * freshly mounted toast is.
 *
 * @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
 * @see https://adrianroselli.com/2026/01/live-region-support.html
 * @see https://github.com/nvaccess/nvda/issues/14591
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSnackbarPortalContext } from './SnackbarPortal.vue'
  import { useSnackbarQueueContext } from './SnackbarQueue.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { useId } from '#v0/utilities'
  import { nextTick, onMounted, toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface SnackbarRootContext {
    id: ID
    onDismiss: () => void
  }

  export const [useSnackbarRootContext, provideSnackbarRootContext] =
    createContext<SnackbarRootContext>({ suffix: 'root' })

  export interface SnackbarRootProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:notifications' */
    namespace?: string
    /** Unique identifier. Auto-generated if not provided. */
    id?: ID
    /** When true, sets role="alert" for urgent messages; otherwise role="status". */
    urgent?: boolean
  }

  export interface SnackbarRootSlotProps {
    id: ID
    attrs: {
      role: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarRoot' })

  const emit = defineEmits<{
    dismiss: [id: ID]
  }>()

  defineSlots<{
    default: (props: SnackbarRootSlotProps) => any
  }>()

  const { as = 'div', namespace = 'v0:notifications', id = useId(), renderless, urgent } = defineProps<SnackbarRootProps>()

  const portal = useSnackbarPortalContext(namespace, null)
  const queue = useSnackbarQueueContext(namespace, null)

  function onDismiss () {
    if (queue) {
      queue.dismiss(id)
    } else {
      emit('dismiss', id)
    }
  }

  provideSnackbarRootContext(namespace, { id, onDismiss })

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  onMounted(async () => {
    if (!portal) return

    await nextTick()

    const text = el.value?.textContent
    if (text) portal.announce(text, urgent)
  })

  const slotProps = toRef((): SnackbarRootSlotProps => ({
    id,
    attrs: {
      role: urgent ? 'alert' : 'status',
    },
  }))
</script>

<template>
  <Atom
    ref="atom"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
