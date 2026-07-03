<script setup lang="ts">
  import { Dialog } from '@vuetify/v0'
  import { inject, useTemplateRef, watch } from 'vue'

  import { PALETTE_KEY } from './useCommandPalette'

  const palette = inject(PALETTE_KEY)!

  const inputRef = useTemplateRef('input')

  watch(palette.isOpen, open => {
    if (open) setTimeout(() => inputRef.value?.focus(), 0)
  })
</script>

<template>
  <Dialog.Root
    :model-value="palette.isOpen.value"
    @update:model-value="value => palette.isOpen.value = value"
  >
    <Dialog.Activator class="inline-flex items-center gap-3 px-4 py-2 bg-surface border border-divider rounded-lg hover:border-primary transition-colors">
      <span class="i-mdi-magnify text-on-surface-variant" />
      <span class="text-on-surface-variant">Search commands...</span>

      <kbd class="ml-4 px-1.5 py-0.5 text-xs font-mono bg-surface-variant text-on-surface-variant rounded">
        {{ palette.modKey }}+J
      </kbd>
    </Dialog.Activator>

    <Dialog.Content class="w-full max-w-lg mx-auto mt-[15vh] rounded-xl bg-surface border border-divider shadow-2xl overflow-hidden text-left">
      <div class="flex items-center gap-3 px-4 py-3 border-b border-divider">
        <span class="i-mdi-magnify text-xl text-on-surface-variant" />

        <input
          ref="input"
          v-model="palette.query.value"
          class="flex-1 bg-transparent text-on-surface outline-none placeholder:text-on-surface-variant"
          placeholder="Type a command..."
        >

        <kbd class="px-1.5 py-0.5 text-xs font-mono bg-surface-variant text-on-surface-variant rounded">ESC</kbd>
      </div>

      <div class="max-h-72 overflow-auto py-2">
        <Dialog.Close
          v-for="(command, index) in palette.filtered.value"
          :key="command.id"
          as="button"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
          :class="index === palette.selectedIndex.value ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-variant'"
          @click="command.action()"
          @mouseenter="palette.selectedIndex.value = index"
        >
          <span class="text-lg" :class="command.icon" />
          <span class="flex-1">{{ command.label }}</span>

          <kbd class="px-1.5 py-0.5 text-xs font-mono bg-surface-variant/50 rounded">
            {{ palette.modKey }}+{{ command.hotkey.toUpperCase() }}
          </kbd>
        </Dialog.Close>

        <div v-if="palette.filtered.value.length === 0" class="px-4 py-8 text-center text-on-surface-variant">
          No commands found
        </div>
      </div>

      <div class="flex items-center gap-4 px-4 py-2 border-t border-divider text-xs text-on-surface-variant">
        <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↑</kbd><kbd class="px-1 py-0.5 bg-surface-variant rounded">↓</kbd> navigate</span>
        <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">↵</kbd> select</span>
        <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 bg-surface-variant rounded">esc</kbd> close</span>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
