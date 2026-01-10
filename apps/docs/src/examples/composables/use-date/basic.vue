<script setup lang="ts">
  import { useDate } from '@vuetify/v0'
  import { computed } from 'vue'

  const { adapter, locale } = useDate()

  const today = computed(() => adapter.date())
  const formatted = computed(() => today.value ? adapter.format(today.value, 'fullDate') : '')
  const shortDate = computed(() => today.value ? adapter.format(today.value, 'shortDate') : '')
  const custom = computed(() => today.value ? adapter.formatByString(today.value, 'YYYY-MM-DD HH:mm') : '')
  const weekday = computed(() => today.value ? adapter.format(today.value, 'weekday') : '')
  const time = computed(() => today.value ? adapter.format(today.value, 'fullTime12h') : '')
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <span class="opacity-60">Locale:</span>
      <span class="font-mono">{{ locale }}</span>

      <span class="opacity-60">Full date:</span>
      <span class="font-semibold">{{ formatted }}</span>

      <span class="opacity-60">Short date:</span>
      <span>{{ shortDate }}</span>

      <span class="opacity-60">Weekday:</span>
      <span>{{ weekday }}</span>

      <span class="opacity-60">Time:</span>
      <span>{{ time }}</span>

      <span class="opacity-60">Custom format:</span>
      <span class="font-mono">{{ custom }}</span>
    </div>
  </div>
</template>
