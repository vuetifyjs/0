<script setup lang="ts">
  import { shallowRef } from 'vue'
  import FormatMenu from './FormatMenu.vue'

  const bold = shallowRef(false)
  const align = shallowRef('left')
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <FormatMenu v-model:align="align" v-model:bold="bold" />

    <p class="text-sm text-on-surface-variant">
      Bold {{ bold ? 'on' : 'off' }}, aligned {{ align }}.
    </p>
  </div>
</template>
