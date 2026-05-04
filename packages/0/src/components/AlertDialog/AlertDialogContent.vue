/**
 * @module AlertDialogContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Content component for alert dialogs. Renders the dialog panel using the
 * native dialog element with `showModal()` for proper modal behavior.
 * Defaults to blocking escape and click-outside dismissal.
 *
 * Integrates with createStack for z-index coordination when multiple
 * dialogs are open simultaneously.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Close dialog when clicking outside content @default false */
    closeOnClickOutside?: boolean
    /** Close dialog when pressing Escape @default false */
    closeOnEscape?: boolean
    /**
     * Whether this dialog blocks scrim dismissal
     *
     * @default false
     */
    blocking?: boolean
  }

  export interface AlertDialogContentEmits {
    cancel: [e: Event]
    close: [e: Event]
  }

  export interface AlertDialogContentSlotProps {
    /** Whether the alert dialog is currently open */
    isOpen: boolean
    /** Whether this dialog is the topmost in the global stack */
    globalTop: boolean
    /** Calculated z-index for the dialog */
    zIndex: number
    /** Attributes to bind to the dialog element */
    attrs: {
      'id': string
      'role': 'alertdialog'
      'aria-modal': 'true'
      'aria-labelledby': string
      'aria-describedby': string
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAlertDialogContext } from './AlertDialogRoot.vue'

  // Composables
  import { useClickOutside } from '#v0/composables/useClickOutside'
  import { useStack } from '#v0/composables/useStack'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { onMounted, toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'AlertDialogContent' })

  defineSlots<{
    default: (props: AlertDialogContentSlotProps) => any
  }>()

  const {
    as = 'dialog',
    namespace = 'v0:alert-dialog',
    closeOnClickOutside = false,
    closeOnEscape = false,
    blocking = false,
  } = defineProps<AlertDialogContentProps>()

  const emit = defineEmits<AlertDialogContentEmits>()

  const context = useAlertDialogContext(namespace)

  const contentRef = useTemplateRef('content')

  // Register with global stack for z-index coordination
  const stack = useStack()
  const ticket = stack.register({
    onDismiss: () => context.close(),
    blocking,
  })

  watch(context.isOpen, isOpen => {
    if (isOpen) {
      ticket.select()
    } else {
      ticket.unselect()
    }
  }, { immediate: true })

  watch(context.isOpen, isOpen => {
    const element = contentRef.value?.element as HTMLDialogElement | undefined
    if (!element) return /* v8 ignore -- defensive guard */

    if (isOpen) {
      element.showModal?.()
    } else {
      element.close?.()
    }
  })

  onMounted(() => {
    if (context.isOpen.value) {
      (contentRef.value?.element as HTMLDialogElement | undefined)?.showModal()
    }
  })

  useToggleScope(
    () => closeOnClickOutside && context.isOpen.value,
    /* v8 ignore start -- callback tested via useClickOutside */
    () => {
      useClickOutside(
        () => contentRef.value?.element,
        () => context.close(),
        { bounds: true },
      )
    },
    /* v8 ignore stop */
  )

  function onCancel (e: Event) {
    if (!closeOnEscape) {
      e.preventDefault()
      return
    }
    context.close()
    emit('cancel', e)
  }

  function onClose (e: Event) {
    context.close()
    emit('close', e)
  }

  const styles = toRef(() => ({ zIndex: ticket.zIndex.value }))

  const slotProps = toRef((): AlertDialogContentSlotProps => ({
    isOpen: context.isOpen.value,
    globalTop: ticket.globalTop.value,
    zIndex: ticket.zIndex.value,
    attrs: {
      'id': context.id,
      'role': 'alertdialog',
      'aria-modal': 'true',
      'aria-labelledby': context.titleId,
      'aria-describedby': context.descriptionId,
    },
  }))
</script>

<template>
  <Atom
    ref="content"
    :as
    :style="styles"
    v-bind="slotProps.attrs"
    @cancel="onCancel"
    @close="onClose"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
