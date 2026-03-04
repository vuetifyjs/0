<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Theme class="p-4 rounded bg-background text-on-background" theme="polaris">
      <div class="text-sm font-medium mb-2">Polaris</div>
      <div class="flex gap-2">
        <span class="px-3 py-1 rounded bg-primary text-on-primary text-xs">Primary</span>
        <span class="px-3 py-1 rounded bg-secondary text-on-secondary text-xs">Secondary</span>
        <span class="px-3 py-1 rounded bg-accent text-on-accent text-xs">Accent</span>
      </div>
    </Theme>

    <Theme class="p-4 rounded bg-background text-on-background" theme="nebula">
      <div class="text-sm font-medium mb-2">Nebula</div>
      <div class="flex gap-2">
        <span class="px-3 py-1 rounded bg-primary text-on-primary text-xs">Primary</span>
        <span class="px-3 py-1 rounded bg-secondary text-on-secondary text-xs">Secondary</span>
        <span class="px-3 py-1 rounded bg-accent text-on-accent text-xs">Accent</span>
      </div>
    </Theme>

    <Theme class="p-4 rounded bg-background text-on-background" theme="blackguard">
      <div class="text-sm font-medium mb-2">Blackguard</div>
      <div class="flex gap-2">
        <span class="px-3 py-1 rounded bg-primary text-on-primary text-xs">Primary</span>
        <span class="px-3 py-1 rounded bg-secondary text-on-secondary text-xs">Secondary</span>
        <span class="px-3 py-1 rounded bg-accent text-on-accent text-xs">Accent</span>
      </div>
    </Theme>
  </div>
</template>
