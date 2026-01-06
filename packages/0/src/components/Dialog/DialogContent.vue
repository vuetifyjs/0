/**
 * @module DialogContent
 *
 * @remarks
 * Content component for dialogs. Renders the dialog panel using the native
 * dialog element with `showModal()` for proper modal behavior including
 * focus trapping, backdrop, and escape key handling.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface DialogContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Close dialog when clicking outside content @default true */
    closeOnClickOutside?: boolean
  }

  export interface DialogContentEmits {
    cancel: [e: Event]
    close: [e: Event]
  }

  export interface DialogContentSlotProps {
    /** Whether the dialog is currently open */
    isOpen: boolean
    /** Attributes to bind to the dialog element */
    attrs: {
      'id': string
      'role': 'dialog'
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
  import { useDialogContext } from './DialogRoot.vue'

  // Composables
  import { useClickOutside } from '#v0/composables/useClickOutside'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { onMounted, toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'DialogContent' })

  defineSlots<{
    default: (props: DialogContentSlotProps) => any
  }>()

  const {
    as = 'dialog',
    namespace = 'v0:dialog',
    closeOnClickOutside = true,
  } = defineProps<DialogContentProps>()

  const emit = defineEmits<DialogContentEmits>()

  const context = useDialogContext(namespace)

  const contentRef = useTemplateRef('content')

  onMounted(() => {
    if (context.isOpen.value) {
      (contentRef.value?.element as HTMLDialogElement | undefined)?.showModal()
    }
  })

  watch(context.isOpen, isOpen => {
    const element = contentRef.value?.element as HTMLDialogElement | undefined
    if (!element) return /* v8 ignore -- defensive guard */

    if (isOpen) {
      element.showModal?.()
    } else {
      element.close?.()
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
    context.isOpen.value = false
    emit('cancel', e)
  }

  function onClose (e: Event) {
    context.isOpen.value = false
    emit('close', e)
  }

  const slotProps = toRef((): DialogContentSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'id': context.id,
      'role': 'dialog',
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
    v-bind="slotProps.attrs"
    @cancel="onCancel"
    @close="onClose"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
