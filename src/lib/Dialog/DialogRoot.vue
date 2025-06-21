<template>
  <slot />
</template>

<script setup lang="ts">
  import { useDialog, DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogRoot' })

  const props = defineProps<{ modelValue?: boolean }>()
  const emit = defineEmits(['update:modelValue'])

  const dialog = useDialog({
    modelValue: props.modelValue,
    onOpen: () => emit('update:modelValue', true),
    onClose: () => emit('update:modelValue', false),
  })

  const [, provideDialog] = useContext(DialogSymbol)
  provideDialog(dialog)
</script>
