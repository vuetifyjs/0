<script setup lang="ts">
  import { Theme, useTheme } from '@vuetify/v0'
  import { toRef } from 'vue'

  const theme = useTheme()
  const current = toRef(() => theme.selectedId.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="p-4 rounded bg-surface text-on-surface border border-divider">
      <p class="text-sm">
        Current page theme: <strong>{{ current }}</strong>
      </p>
    </div>

    <Theme class="p-4 rounded border border-divider" theme="light">
      <p class="text-sm bg-surface text-on-surface p-3 rounded">
        This section is always <strong>light</strong>
      </p>
    </Theme>

    <Theme class="p-4 rounded border border-divider" theme="dark">
      <p class="text-sm bg-surface text-on-surface p-3 rounded">
        This section is always <strong>dark</strong>
      </p>
    </Theme>
  </div>
</template>
