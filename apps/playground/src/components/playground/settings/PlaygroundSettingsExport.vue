<script setup lang="ts">
  // Composables
  import { useExport } from '@/composables/useExport'

  const { downloadProject } = useExport()
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-on-surface-variant">
      Download your playground as a Vite project. The ZIP includes a runnable scaffold
      (<code>package.json</code>, <code>vite.config.ts</code>, <code>index.html</code>,
      <code>src/uno.config.ts</code>) alongside your editor files.
    </p>

    <div>
      <button
        class="px-3 py-1.5 text-xs font-medium rounded bg-primary text-on-primary hover:opacity-90 transition-opacity cursor-pointer"
        type="button"
        @click="downloadProject"
      >
        Download ZIP
      </button>
    </div>
  </div>
</template>
