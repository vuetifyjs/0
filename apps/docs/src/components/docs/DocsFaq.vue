<script setup lang="ts">
  // Framework
  import { ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { computed, provide, shallowRef, useSlots } from 'vue'

  const props = defineProps<{
    multiple?: boolean
  }>()

  const slots = useSlots()
  const search = shallowRef('')

  // Count FAQ items by checking slot VNodes
  const itemCount = computed(() => {
    const children = slots.default?.() ?? []
    let count = 0
    for (const child of children) {
      if (Array.isArray(child.children)) {
        count += child.children.length
      } else {
        count++
      }
    }
    return count
  })

  const showControls = computed(() => itemCount.value > 3)

  // Provide search term to child DocsFaqItem components for filtering
  provide('faq-search', search)
</script>

<template>
  <div class="my-6">
    <div v-if="showControls" class="flex items-center gap-3 mb-3">
      <div class="relative flex-1">
        <AppIcon
          class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          icon="search"
          :size="16"
        />

        <input
          v-model="search"
          class="w-full pl-9 pr-3 py-2 text-sm bg-surface-tint border border-divider rounded-lg outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant"
          placeholder="Search FAQ..."
          type="text"
        >
      </div>
    </div>

    <ExpansionPanel.Root class="flex flex-col gap-3" :multiple="props.multiple ?? true">
      <slot />
    </ExpansionPanel.Root>
  </div>
</template>
