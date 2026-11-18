<script setup lang="ts">
  import { useHead } from '@unhead/vue'
  import { definePage } from 'vue-router/experimental'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  import { IN_BROWSER } from '#v0/constants/globals'
  import { convert } from '@/labs/convert/convert'
  import Preview from '@/labs/convert/Preview.vue'
  import { samples } from '@/labs/convert/samples'

  // Utilities
  import { onMounted, shallowRef, watch } from 'vue'

  // Types
  import type { ConvertResult } from '@/labs/convert/convert'

  definePage({
    meta: {
      layout: 'fullscreen',
    },
  })

  useHead({
    title: 'Markup converter',
    meta: [
      { name: 'robots', content: 'noindex' },
    ],
  })

  const source = shallowRef('')
  const result = shallowRef<ConvertResult>({
    system: 'none',
    vue: '',
    notes: [],
    refused: null,
    tree: [],
  })
  const clipboard = useClipboard()

  function load (html: string) {
    source.value = html
  }

  function run () {
    if (!IN_BROWSER) return
    result.value = convert(source.value)
  }

  onMounted(() => {
    source.value = samples[0]?.html ?? ''
  })

  watch(source, run)

  function onCopy () {
    if (result.value.vue === '') return
    clipboard.copy(result.value.vue)
  }

  function plain (text: string): string {
    return text.replaceAll('`', '')
  }
</script>

<template>
  <div class="fixed z-10 top-[calc(48px+var(--app-banner-h,0px))] bottom-0 start-0 end-0 md:start-[230px] flex flex-col gap-3 bg-background p-4 text-on-surface">
    <header class="flex shrink-0 flex-col gap-2">
      <div class="flex items-baseline justify-between gap-4">
        <h1 class="text-lg">Markup to Vue</h1>

        <p class="text-sm text-on-surface-variant">
          Bulma 1.0.4 and Bootstrap 6. Bootstrap 5 is refused.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="sample in samples"
          :key="sample.id"
          :aria-pressed="source === sample.html"
          class="rounded border px-3 py-1 text-sm"
          :class="source === sample.html ? 'border-primary bg-primary text-on-primary' : 'border-divider text-on-surface'"
          type="button"
          @click="load(sample.html)"
        >
          {{ sample.label }}
        </button>
      </div>

      <p v-if="result.refused" class="text-sm text-error">
        {{ plain(result.refused) }}
      </p>

      <p v-else-if="result.notes.length > 0" class="text-sm text-on-surface-variant">
        {{ result.notes.map(plain).join(' ') }}
      </p>
    </header>

    <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-2">
      <div class="flex min-h-0 flex-col gap-3">
        <label class="flex min-h-0 flex-1 flex-col gap-1">
          <span class="text-xs text-on-surface-variant">Markup</span>

          <textarea
            v-model="source"
            aria-label="Markup to convert"
            class="min-h-0 w-full flex-1 resize-none rounded border border-divider bg-surface p-3 font-mono text-sm text-on-surface"
            spellcheck="false"
          />
        </label>

        <div class="flex min-h-0 flex-1 flex-col gap-1">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs text-on-surface-variant">Vue</span>

            <button
              class="rounded border border-divider px-2 py-1 text-xs text-on-surface"
              type="button"
              @click="onCopy"
            >
              {{ clipboard.copied.value ? 'Copied' : 'Copy' }}
            </button>
          </div>

          <pre class="min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words rounded border border-divider bg-surface p-3 font-mono text-xs text-on-surface"><code>{{ result.vue }}</code></pre>
        </div>
      </div>

      <Preview
        v-if="result.system !== 'none'"
        class="min-h-[24rem] lg:min-h-0"
        :system="result.system"
        :tree="result.tree"
      />

      <div
        v-else
        class="flex min-h-[16rem] items-center justify-center rounded border border-divider bg-surface p-6 text-sm text-on-surface-variant lg:min-h-0"
      >
        {{ result.refused ? 'No preview. The markup was refused.' : 'No component owns this markup.' }}
      </div>
    </div>
  </div>
</template>

<style>
/* The page is position:fixed, so main has no height and this footer
   collapses up over the nav. It has nothing to do on a viewport-sized lab. */
.app-footer {
  display: none;
}
</style>
