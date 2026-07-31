<script setup lang="ts">
  import { Button, isNull } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import type { NumberFieldContext } from '@vuetify/v0'

  const { field, label, commit } = defineProps<{
    field: NumberFieldContext
    label: string
    commit: (value: number) => void
  }>()

  const draft = shallowRef<string | null>(null)

  function onFocus () {
    draft.value = String(field.value.value ?? '')
  }

  function onInput (event: Event) {
    draft.value = (event.target as HTMLInputElement).value
  }

  function onBlur () {
    if (!isNull(draft.value)) {
      commit(field.parse(draft.value))
    }
    draft.value = null
  }
</script>

<template>
  <div class="flex flex-col gap-1">
    <span class="text-xs text-on-surface-variant">{{ label }}</span>

    <div class="flex items-center gap-2">
      <Button.Root
        class="size-8 rounded-lg border border-divider text-on-surface disabled:opacity-40"
        :disabled="!field.canDecrement.value"
        @click="field.decrement()"
      >
        &minus;
      </Button.Root>

      <input
        class="w-28 px-3 py-2 text-center tabular-nums rounded-lg border border-divider bg-surface text-on-surface outline-none focus:border-primary transition-colors"
        inputmode="decimal"
        :value="draft ?? field.display.value"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
      >

      <Button.Root
        class="size-8 rounded-lg border border-divider text-on-surface disabled:opacity-40"
        :disabled="!field.canIncrement.value"
        @click="field.increment()"
      >
        +
      </Button.Root>
    </div>
  </div>
</template>
