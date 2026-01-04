/**
 * @module DialogRoot
 *
 * @remarks
 * Root component for dialog contexts. Creates and provides dialog context
 * to child Dialog components. Manages open/closed state via v-model binding.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ShallowRef } from 'vue'

  export interface DialogContext {
    isOpen: ShallowRef<boolean>
    id: string
    titleId: string
    descriptionId: string
    open: () => void
    close: () => void
  }

  export interface DialogRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier for the dialog (auto-generated if not provided) */
    id?: string
  }

  export interface DialogRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the dialog is currently open */
    isOpen: boolean
    /** Open the dialog */
    open: () => void
    /** Close the dialog */
    close: () => void
  }

  export const [useDialogContext, provideDialogContext] = createContext<DialogContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef, toValue, useId } from 'vue'

  defineOptions({ name: 'DialogRoot' })

  defineSlots<{
    default: (props: DialogRootSlotProps) => any
  }>()

  defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const {
    as = null,
    namespace = 'v0:dialog',
    ...props
  } = defineProps<DialogRootProps>()

  const isOpen = defineModel<boolean>({ default: false })

  const id = toRef(() => props.id ?? useId())
  const titleId = toRef(() => `${toValue(id)}-title`)
  const descriptionId = toRef(() => `${toValue(id)}-description`)

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  provideDialogContext(namespace, {
    isOpen,
    id: toValue(id),
    titleId: toValue(titleId),
    descriptionId: toValue(descriptionId),
    open,
    close,
  })

  const slotProps = toRef((): DialogRootSlotProps => ({
    id: toValue(id),
    isOpen: isOpen.value,
    open,
    close,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
