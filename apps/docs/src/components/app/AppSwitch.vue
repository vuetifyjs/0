<script setup lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  const { as, label, small } = defineProps<{
    as?: string
    label?: string
    small?: boolean
  }>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <Switch.Root
    v-model="model"
    :as
    class="inline-flex items-center border-none bg-transparent p-0 outline-none"
    :label
  >
    <Switch.Track
      :class="[
        'relative inline-flex items-center rounded-full transition-colors',
        'bg-on-surface/20 data-[state=checked]:bg-primary',
        small ? 'w-8 h-4.5' : 'w-11 h-6',
      ]"
    >
      <Switch.Thumb
        :class="[
          '![visibility:visible] block rounded-full bg-white shadow-sm transition-transform',
          small
            ? 'size-3.5 translate-x-0.5 data-[state=checked]:translate-x-3.75'
            : 'size-4 translate-x-1 data-[state=checked]:translate-x-6',
        ]"
      />
    </Switch.Track>
  </Switch.Root>
</template>
