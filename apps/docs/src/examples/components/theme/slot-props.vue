<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <div class="flex gap-4">
    <Theme v-slot="{ isDark }" class="flex-1 p-4 rounded border border-divider" theme="light">
      <p class="text-sm bg-surface text-on-surface p-3 rounded">
        isDark: <strong>{{ isDark }}</strong>
      </p>
    </Theme>

    <Theme v-slot="{ isDark }" class="flex-1 p-4 rounded border border-divider" theme="dark">
      <p class="text-sm bg-surface text-on-surface p-3 rounded">
        isDark: <strong>{{ isDark }}</strong>
      </p>
    </Theme>
  </div>
</template>
