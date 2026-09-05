<script setup lang="ts">
  const { title = 'Your app' } = defineProps<{
    title?: string
  }>()
</script>

<template>
  <div class="rounded-xl border border-divider bg-surface shadow-sm overflow-hidden">
    <div class="flex items-center gap-2 px-3 h-8 border-b border-divider bg-surface-variant/60">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span class="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span class="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>

      <div class="flex-1 mx-2 h-5 rounded-md bg-background/60 border border-divider/60 px-2 inline-flex items-center text-[10px] text-on-surface-variant truncate">
        {{ title }}
      </div>
    </div>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
