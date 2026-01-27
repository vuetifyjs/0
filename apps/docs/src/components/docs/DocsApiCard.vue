<script setup lang="ts">
  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { shallowRef, watch } from 'vue'

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

  const lineWrap = shallowRef(settings.lineWrap.value)

  watch(settings.lineWrap, val => {
    lineWrap.value = val
  })

  const key = `${props.kind}-${props.item.name}`
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
        class="text-xs mt-1 inline-block font-mono bg-surface-variant px-1.5 py-0.5 rounded"
      >
        {{ 'signature' in item ? item.signature : ['option', 'prop', 'event', 'slot'].includes(kind) ? item.type : api.formatSignature(item as ApiProperty | ApiMethod) }}
      </code>

      <p
        v-if="item.description"
        class="text-sm text-on-surface mt-1"
        :class="{ '!mb-0': kind !== 'option' }"
      >
        {{ item.description }}
      </p>

      <p
        v-if="(kind === 'option' || kind === 'prop') && 'default' in item && item.default"
        class="text-xs text-on-surface-variant mt-2 !mb-0"
      >
        Default: <code class="text-xs bg-surface-variant px-1.5 py-0.5 rounded">{{ item.default }}</code>
      </p>
    </div>

    <template v-if="'example' in item && item.example">
      <div class="border-t border-divider bg-surface-tint">
        <button
          :aria-controls="`${api.uid}-${key}`"
          :aria-expanded="api.expanded.value.has(key)"
          class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors hover:bg-surface hover:text-primary focus-visible:bg-surface focus-visible:text-primary"
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
