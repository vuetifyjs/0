<script lang="ts" setup>
  // Utilities
  import { ref, computed, onMounted, shallowRef, watch } from 'vue'
  import { createHighlighterCore } from 'shiki/core'
  import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

  // Types
  import type { HighlighterCore } from 'shiki/core'

  const props = defineProps<{
    file?: string
    title?: string
    code?: string
  }>()

  const showCode = ref(false)
  const highlightedCode = shallowRef<string>('')
  const copied = ref(false)
  const highlighter = shallowRef<HighlighterCore | null>(null)

  const fileName = computed(() => props.file?.split('/').pop() || '')

  async function copyCode () {
    if (!props.code) return

    try {
      await navigator.clipboard.writeText(props.code)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  async function highlight (code: string) {
    if (!highlighter.value || !code) return

    highlightedCode.value = highlighter.value.codeToHtml(code, {
      lang: 'vue',
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
    })
  }

  onMounted(async () => {
    if (props.code) {
      highlighter.value = await createHighlighterCore({
        themes: [
          import('@shikijs/themes/github-light-default'),
          import('@shikijs/themes/github-dark-default'),
        ],
        langs: [
          import('@shikijs/langs/vue'),
        ],
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
      })

      await highlight(props.code)
    }
  })

  watch(() => props.code, async code => {
    if (code) await highlight(code)
  })
</script>

<template>
  <div class="border border-divider rounded-lg my-6 overflow-hidden">
    <div
      v-if="title"
      class="px-4 py-3 font-semibold border-b border-divider bg-surface-tint"
    >
      {{ title }}
    </div>

    <div class="p-4 bg-surface">
      <slot />
    </div>

    <div class="border-t border-divider bg-surface-tint">
      <button
        class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface"
        @click="showCode = !showCode"
      >
        <span v-if="showCode">Hide code</span>
        <span v-else>Show code</span>
        <span v-if="fileName" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ fileName }}</span>
      </button>
    </div>

    <div
      v-if="showCode && highlightedCode"
      class="relative bg-pre"
    >
      <button
        class="absolute top-3 right-3 pa-1 inline-flex rounded opacity-90 hover:opacity-100 bg-surface-tint"
        @click="copyCode"
      >
        <AppIcon :icon="!copied ? 'copy' : 'success'" />
      </button>
      <div
        class="[&_pre]:p-4 [&_pre]:pr-20 [&_pre]:leading-relaxed [&_pre]:overflow-x-auto"
        v-html="highlightedCode"
      />
    </div>
  </div>
</template>

<style scoped>
  ::v-deep(.shiki) {
    border: none;
    border-top: thin solid var(--v0-divider);
    border-radius: 0;
    margin-bottom: 0;
  }
</style>
