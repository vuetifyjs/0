<script setup lang="ts">
  import { usePopover } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const content = useTemplateRef<HTMLElement>('content')

  const { isOpen, toggle, anchorStyles, contentAttrs, contentStyles, attach } = usePopover({
    positionArea: 'bottom',
    positionTry: 'flip-block',
  })

  attach(content)
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-8">
    <button
      class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
      :class="isOpen ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant hover:bg-primary/10'"
      :style="anchorStyles"
      @click="toggle"
    >
      <span class="inline-flex items-center gap-2">
        <span class="i-lucide-layout-grid" />
        {{ isOpen ? 'Close' : 'Open' }} Popover
      </span>
    </button>

    <div
      ref="content"
      v-bind="contentAttrs"
      class="w-64 rounded-xl bg-surface border border-divider shadow-xl p-0 m-0"
      :style="contentStyles"
    >
      <div class="p-4">
        <div class="font-medium text-on-surface mb-1">Anchor Positioned</div>
        <p class="text-sm text-on-surface-variant">
          This popover uses the native Popover API with CSS anchor positioning. It flips automatically when near viewport edges.
        </p>
      </div>
      <div class="border-t border-divider p-3 flex justify-end">
        <button
          class="px-3 py-1.5 text-xs rounded bg-primary text-on-primary"
          @click="toggle"
        >
          Got it
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs text-on-surface-variant">
      <span class="w-2 h-2 rounded-full" :class="isOpen ? 'bg-success' : 'bg-surface-variant'" />
      {{ isOpen ? 'Open' : 'Closed' }}
    </div>
  </div>
</template>
