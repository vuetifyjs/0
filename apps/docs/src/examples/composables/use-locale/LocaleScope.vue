<script setup lang="ts">
  import { createLocaleContext } from '@vuetify/v0'
  import type { LocaleRecord } from '@vuetify/v0'

  const { default: initial, messages } = defineProps<{
    default: string
    messages: Record<string, LocaleRecord>
  }>()

  const [, provideLocale] = createLocaleContext({ default: initial, messages })

  provideLocale()
</script>

<template>
  <slot />
</template>
