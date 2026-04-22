<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
</script>

<template>
  <Collapsible.Root
    class="border border-divider rounded-lg border-solid overflow-hidden"
  >
    <Collapsible.Activator
      class="w-full px-3 py-2 border-none flex items-center gap-3 text-left cursor-pointer bg-surface hover:bg-surface-tint"
    >
      <Collapsible.Cue class="inline-flex items-center justify-center w-5 text-sm text-on-surface opacity-60 data-[state=open]:text-primary">
        <span class="data-[state=open]:hidden">+</span>
        <span class="hidden data-[state=open]:inline">&minus;</span>
      </Collapsible.Cue>

      <span class="flex-1 font-medium text-on-surface text-base">
        Toggle content
      </span>
    </Collapsible.Activator>

    <Collapsible.Content class="px-3 py-2 border-t border-divider border-solid">
      <div class="text-on-surface text-sm">
        This content can be toggled open and closed. The Collapsible component manages a single boolean state with full keyboard and accessibility support.
      </div>
    </Collapsible.Content>
  </Collapsible.Root>
</template>
