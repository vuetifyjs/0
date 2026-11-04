<script lang="ts">
  // Framework
  import { isString, useId } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BFormAdornControlProps {
    disabled?: boolean
    id?: string
    name?: string
    placeholder?: string
    type?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormAdornControl' })

  defineEmits(['update:model-value'])

  const model = defineModel<string>({ default: '' })

  const {
    disabled = false,
    id: _id,
    name,
    placeholder,
    type = 'text',
  } = defineProps<BFormAdornControlProps>()

  const autoId = useId()

  const uid = toRef(() => isString(_id) && _id.length > 0 ? _id : autoId)
</script>

<template>
  <input
    :id="uid"
    v-model="model"
    class="form-ghost"
    :disabled="disabled || undefined"
    :name
    :placeholder
    :type
  >
</template>
