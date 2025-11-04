<script lang="ts" setup>
  import { ref, computed, onMounted, shallowRef } from 'vue'
  import { createHighlighterCore } from 'shiki/core'
  import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

  const props = defineProps<{
    file?: string
    title?: string
    code?: string
  }>()

  const showCode = ref(false)
  const highlightedCode = shallowRef<string>('')

  const fileName = computed(() => props.file?.split('/').pop() || '')

  onMounted(async () => {
    if (props.code) {
      const highlighter = await createHighlighterCore({
        themes: [
          import('@shikijs/themes/github-light-default'),
        ],
        langs: [
          import('@shikijs/langs/vue'),
        ],
        engine: createOnigurumaEngine(() => import('shiki/wasm')),
      })

      highlightedCode.value = highlighter.codeToHtml(props.code, {
        lang: 'vue',
        theme: 'github-light-default',
      })
    }
  })
</script>

<template>
  <div class="border border-gray-200 rounded-lg my-6 overflow-hidden">
    <div v-if="title" class="px-4 py-3 font-semibold border-b border-gray-200 bg-gray-50">
      {{ title }}
    </div>

    <div class="p-8 bg-white">
      <slot />
    </div>

    <div class="border-t border-gray-200 bg-gray-50">
      <button
        class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-gray-700 transition-colors hover:bg-gray-100"
        @click="showCode = !showCode"
      >
        <span v-if="showCode">Hide code</span>
        <span v-else>Show code</span>
        <span v-if="fileName" class="ml-auto opacity-60 font-mono text-[0.8125rem]">{{ fileName }}</span>
      </button>
    </div>

    <div
      v-if="showCode && highlightedCode"
      class="[&_pre]:p-4"
      v-html="highlightedCode"
    />
  </div>
</template>
