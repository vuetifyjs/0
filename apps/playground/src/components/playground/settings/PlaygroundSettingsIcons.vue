<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Data
  import { ICON_COLLECTIONS, iconifyPreviewUrl } from '@/data/icon-sets'

  // Utilities
  import { shallowRef } from 'vue'

  const copied = shallowRef<string | null>(null)
  let copyTimer = 0

  async function onCopy (text: string) {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = text
      window.clearTimeout(copyTimer)
      copyTimer = window.setTimeout(() => {
        copied.value = null
      }, 1500)
    } catch {
      // Clipboard may be denied; ignore
    }
  }
</script>

<template>
  <div class="flex flex-col gap-3 h-full min-h-0">
    <div class="flex items-center justify-between gap-2 shrink-0">
      <p class="text-xs text-on-surface-variant">
        Click a set to copy an example class
      </p>

      <Tooltip.Root
        :close-delay="100"
        interactive
        :open-delay="200"
        position-area="bottom span-left"
      >
        <Tooltip.Activator
          class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-tint transition-colors cursor-default"
          type="button"
        >
          <AppIcon icon="book-open" :size="14" />
          <span>How to use</span>
        </Tooltip.Activator>

        <Tooltip.Content
          class="bg-surface border border-divider rounded-lg shadow-xl p-3 w-72 max-w-[min(18rem,calc(100vw-2rem))] text-left"
        >
          <div class="text-xs font-medium text-on-surface mb-2">
            UnoCSS + Iconify
          </div>

          <p class="text-[11px] text-on-surface-variant leading-relaxed mb-2">
            Drop any Iconify icon into a template as a class. No install —
            collections load from the CDN on first use.
          </p>

          <pre class="text-[11px] font-mono leading-relaxed bg-surface-tint/60 border border-divider rounded-md px-2.5 py-2 text-on-surface mb-2 overflow-x-auto">{{ '<span class="i-lucide-home text-xl" />' }}</pre>

          <p class="text-[11px] text-on-surface-variant leading-relaxed mb-2">
            Pattern:
            <code class="text-on-surface">i-collection-name</code>
          </p>

          <a
            class="text-[11px] text-primary hover:underline"
            href="https://icones.js.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Browse all sets on icones.js.org ↗
          </a>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>

    <div class="grid grid-cols-2 gap-2 flex-1 min-h-0 content-start">
      <button
        v-for="col in ICON_COLLECTIONS"
        :key="col.id"
        class="flex flex-col items-center gap-2 rounded-lg border border-divider px-2 py-3 text-center hover:border-primary/50 hover:bg-surface-tint/50 transition-colors"
        type="button"
        @click="onCopy(col.example)"
      >
        <img
          alt=""
          class="w-7 h-7"
          decoding="async"
          height="28"
          :src="iconifyPreviewUrl(col.example)"
          width="28"
        >

        <span class="text-xs font-medium text-on-surface truncate max-w-full">
          {{ col.label }}
        </span>

        <span class="text-[10px] font-mono text-on-surface-variant truncate max-w-full">
          {{ copied === col.example ? 'Copied' : col.example }}
        </span>
      </button>
    </div>
  </div>
</template>
