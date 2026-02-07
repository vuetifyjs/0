<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  const props = defineProps<{
    command: string
  }>()

  const { copied, copy } = useClipboard()
</script>

<template>
  <div class="inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border bg-surface font-mono text-sm max-w-full" :title="props.command">
    <code class="flex-1 truncate opacity-80 !bg-transparent !p-0 !rounded-none">{{ props.command }}</code>

    <button
      :aria-label="copied ? 'Copied!' : 'Copy command'"
      class="shrink-0 size-7 rounded-full flex items-center justify-center hover:bg-surface-tint transition-colors"
      :class="copied && 'text-success'"
      @click="copy(props.command)"
    >
      <AppIcon
        :icon="copied ? 'check' : 'copy'"
        :size="14"
      />
    </button>
  </div>
</template>
