<script setup lang="ts">
  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'

  // Types
  import type { ApiEvent, ApiMethod, ApiOption, ApiProp, ApiProperty, ApiSlot } from '../../../build/generate-api'

  type ApiItem = ApiOption | ApiProperty | ApiMethod | ApiProp | ApiEvent | ApiSlot

  const props = defineProps<{
    item: ApiItem
    kind: 'option' | 'property' | 'method' | 'prop' | 'event' | 'slot'
    headingTag?: 'h3' | 'h4'
  }>()

  const {
    uid,
    expandedExamples,
    highlightedExamples,
    scrollToAnchor,
    toggleExample,
    formatSignature,
  } = useApiHelpers()

  const exampleKey = `${props.kind}-${props.item.name}`
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
          @click.prevent="scrollToAnchor(item.name)"
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
        v-if="item.type"
        class="text-xs mt-1 inline-block font-mono bg-surface-variant px-1.5 py-0.5 rounded"
      >
        {{ ['option', 'prop', 'event', 'slot'].includes(kind) ? item.type : formatSignature(item as ApiProperty | ApiMethod) }}
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
      <div class="border-t border-divider bg-surface hover:bg-surface-tint">
        <button
          :aria-controls="`${uid}-${exampleKey}`"
          :aria-expanded="expandedExamples.has(exampleKey)"
          class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors"
          type="button"
          @click="toggleExample(exampleKey, item.example)"
        >
          <span v-if="expandedExamples.has(exampleKey)">Hide code example</span>

          <span v-else>Show code example</span>
        </button>
      </div>

      <div
        v-if="expandedExamples.has(exampleKey) && highlightedExamples[exampleKey]"
        :id="`${uid}-${exampleKey}`"
        class="relative bg-pre group"
      >
        <DocsCodeActions
          bin
          class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
          :code="highlightedExamples[exampleKey]?.code ?? ''"
          language="typescript"
          show-copy
          :title="item.name"
        />

        <div
          class="[&_pre]:p-4 [&_pre]:pr-20 [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:m-0 [&_pre]:border-0 [&_pre]:outline-0"
          v-html="highlightedExamples[exampleKey]?.html ?? ''"
        />
      </div>
    </template>
  </div>
</template>
