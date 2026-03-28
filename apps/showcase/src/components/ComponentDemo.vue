<script setup lang="ts">
  import * as helixComponents from '@paper/helix'
  import { HxCodeBlock } from '@paper/helix'

  // Components
  import PropControls from './PropControls.vue'

  // Utilities
  import { ref, toRef } from 'vue'

  // Types
  import type { DSComponent } from '@paper/helix'

  const { component } = defineProps<{
    component: DSComponent
    dsSlug: string
  }>()

  const propValues = ref<Record<string, unknown>>({})

  const resolved = toRef(() => {
    return (helixComponents as Record<string, unknown>)[component.name]
  })

  // Components that accept a default slot get placeholder text
  const SLOT_COMPONENTS = new Set([
    'HxButton', 'HxIconButton', 'HxBadge', 'HxChip', 'HxLink',
    'HxCallout', 'HxAlert', 'HxKbd',
  ])

  const slotContent = toRef(() => {
    if (SLOT_COMPONENTS.has(component.name)) {
      return component.name.replace(/^Hx/, '')
    }
    return ''
  })

  const source = toRef(() => generateSource())

  function generateSource (): string {
    const attrs = Object.entries(propValues.value)
      .filter(([key, val]) => {
        const def = component.props?.find(p => p.name === key)
        return def && String(val) !== def.default
      })
      .map(([key, val]) => {
        if (typeof val === 'boolean') return val ? key : `:${key}="false"`
        return `${key}="${val}"`
      })
      .join(' ')
    const tag = component.name
    const text = slotContent.value
    if (text) {
      return attrs ? `<${tag} ${attrs}>${text}</${tag}>` : `<${tag}>${text}</${tag}>`
    }
    return attrs ? `<${tag} ${attrs} />` : `<${tag} />`
  }

  function onValues (values: Record<string, unknown>) {
    propValues.value = values
  }
</script>

<template>
  <div class="flex flex-col border border-divider rounded-lg overflow-hidden">
    <!-- Preview + controls row -->
    <div class="flex min-h-48">
      <!-- Preview pane -->
      <div
        class="flex-1 flex items-center justify-center p-8 bg-surface-tint rounded-tl-lg"
      >
        <component
          :is="resolved"
          v-if="resolved"
          v-bind="propValues"
        >
          {{ slotContent }}
        </component>
        <div v-else class="text-xs text-on-surface-variant font-mono opacity-50">
          {{ component.name }} (not resolved)
        </div>
      </div>

      <!-- Controls pane -->
      <div
        v-if="component.props?.length"
        class="w-260px border-l border-divider overflow-y-auto"
      >
        <PropControls :props="component.props" @update:values="onValues" />
      </div>
    </div>

    <!-- Code block -->
    <div class="border-t border-divider">
      <HxCodeBlock :code="source" language="html" />
    </div>
  </div>
</template>
