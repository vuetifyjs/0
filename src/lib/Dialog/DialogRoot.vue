<template>
  <slot />
</template>

<script lang="ts">
  export interface DialogRootProps {
    modelValue?: boolean
  }
</script>

<script setup lang="ts">
  import { useDialog, DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogRoot' })

  const props = defineProps<DialogRootProps>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const dialog = useDialog({
    modelValue: props.modelValue,
    onOpen: () => emit('update:modelValue', true),
    onClose: () => emit('update:modelValue', false),
  })

  const [, provideDialog] = useContext(DialogSymbol)
  provideDialog(dialog)
</script>
