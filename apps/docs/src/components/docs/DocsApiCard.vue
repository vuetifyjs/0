<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useCodeHighlighter } from '@/composables/useCodeHighlighter'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { renderInlineMarkdown } from '@/utilities/markdown'
  import { shallowReactive, toRef, watchEffect } from 'vue'

  // Types
  import type { ApiEvent, ApiFunction, ApiMethod, ApiOption, ApiProp, ApiProperty, ApiSlot } from '@build/generate-api'

  type ApiItem = ApiOption | ApiProperty | ApiMethod | ApiProp | ApiEvent | ApiSlot | ApiFunction

  const props = defineProps<{
    item: ApiItem
    kind: 'option' | 'property' | 'method' | 'prop' | 'event' | 'slot' | 'function'
    headingTag?: 'h3' | 'h4'
  }>()

  const api = useApiHelpers()
  const settings = useSettings()
  const highlighter = useCodeHighlighter()

  const lineWrap = useSyncedRef(settings.lineWrap)

  const key = `${props.kind}-${props.item.name}`

  const language = toRef(() => {
    if (!('example' in props.item) || !props.item.example) return null
    return /^<(?:template|script)/.test(props.item.example.trim()) ? 'vue' : 'ts'
  })

  const signature = toRef(() => {
    if ('signature' in props.item) return props.item.signature
    if (['option', 'prop', 'event', 'slot'].includes(props.kind)) return props.item.type
    return api.formatSignature(props.item as ApiProperty | ApiMethod)
  })

  const preset = toRef(() => 'default' in props.item ? props.item.default : '')

  const chips = shallowReactive({ signature: '', preset: '' })

  if (IN_BROWSER) {
    watchEffect(async () => {
      const code = signature.value
      if (!code) return
      const result = await highlighter.inline({ code, language: 'typescript' })
      if (signature.value === code) chips.signature = result.html
    })

    watchEffect(async () => {
      const code = preset.value
      if (!code) return
      const result = await highlighter.inline({ code, language: 'typescript' })
      if (preset.value === code) chips.preset = result.html
    })
  }
</script>

<template>
  <div class="border border-divider rounded-lg overflow-hidden">
    <div class="px-4 py-3 bg-surface">
      <component
        :is="headingTag ?? 'h4'"
        :id="item.name"
        class="!my-0 !text-sm !leading-tight"
      >
        <a
          class="header-anchor"
          :href="`#${item.name}`"
          @click.prevent="api.scrollToAnchor(item.name)"
        >
          <span class="text-sm font-semibold font-mono text-primary">{{ item.name }}</span>

          <span
            v-if="(kind === 'option' || kind === 'prop') && 'required' in item && item.required"
            class="text-error text-xs ml-2"
          >
            required
          </span>
        </a>
      </component>

      <code
        v-if="item.type || ('signature' in item && item.signature)"
        class="shiki-inline text-xs mt-1 inline-block font-mono bg-surface-variant px-1.5 py-0.5 rounded"
      >
        <span v-if="chips.signature" v-html="chips.signature" />
        <template v-else>{{ signature }}</template>
      </code>

      <p
        v-if="item.description"
        class="text-sm text-on-surface mt-1"
        :class="{ '!mb-0': kind !== 'option' }"
        v-html="renderInlineMarkdown(item.description)"
      />

      <p
        v-if="(kind === 'option' || kind === 'prop') && 'default' in item && item.default"
        class="text-xs text-on-surface-variant mt-2 !mb-0"
      >
        Default: <code class="shiki-inline text-xs bg-surface-variant px-1.5 py-0.5 rounded">
          <span v-if="chips.preset" v-html="chips.preset" />
          <template v-else>{{ item.default }}</template>
        </code>
      </p>
    </div>

    <template v-if="'example' in item && item.example">
      <div class="border-t border-divider bg-surface-tint">
        <button
          :aria-controls="`${api.uid}-${key}`"
          :aria-expanded="api.expanded.value.has(key)"
          class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors focus-visible:bg-surface focus-visible:text-primary"
          :class="!api.expanded.value.has(key) && 'hover:bg-surface hover:text-primary'"
          type="button"
          @click="api.toggle(key, item.example)"
        >
          <AppIcon v-if="api.expanded.value.has(key)" icon="chevron-up" :size="16" />
          <AppIcon v-else icon="code" :size="16" />
        </button>
      </div>

      <div
        v-if="api.expanded.value.has(key) && api.highlighted[key]"
        :id="`${api.uid}-${key}`"
        class="docs-api-card relative bg-pre group"
        :class="{ 'docs-api-card--wrap': lineWrap.value }"
      >
        <span
          v-if="language"
          class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50 uppercase"
        >
          {{ language }}
        </span>

        <DocsCodeActions
          v-model:wrap="lineWrap"
          bin
          class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
          :code="api.highlighted[key]?.code ?? ''"
          language="typescript"
          show-copy
          show-wrap
          :title="item.name"
        />

        <div v-html="api.highlighted[key]?.html ?? ''" />
      </div>
    </template>
  </div>
</template>
