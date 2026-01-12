<script setup lang="ts">
  // Framework
  import { useDate } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  const { adapter } = useDate()

  const year = toRef(() => {
    const today = adapter.date()
    return today ? adapter.getYear(today) : new Date().getFullYear()
  })
</script>

<template>
  <span>&copy; 2016-{{ year }} Vuetify, LLC</span>
</template>
