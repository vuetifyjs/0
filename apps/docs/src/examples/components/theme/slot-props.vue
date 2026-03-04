<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <div class="flex gap-4">
    <Theme v-slot="{ isDark, theme }" class="flex-1 p-4 rounded bg-background text-on-background" theme="odyssey">
      <div class="text-xs font-mono opacity-70">{{ theme }} · isDark: {{ isDark }}</div>
    </Theme>

    <Theme v-slot="{ isDark, theme }" class="flex-1 p-4 rounded bg-background text-on-background" theme="blackguard">
      <div class="text-xs font-mono opacity-70">{{ theme }} · isDark: {{ isDark }}</div>
    </Theme>
  </div>
</template>
