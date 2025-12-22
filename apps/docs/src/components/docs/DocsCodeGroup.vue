<script lang="ts" setup>
  // Composables
  import { createSingle, useProxyRegistry } from '@vuetify/v0'

  // Utilities
  import { computed, toValue, useSlots, type VNode, watch } from 'vue'

  const slots = useSlots()

  const single = createSingle({ mandatory: 'force', events: true })
  const proxy = useProxyRegistry(single)

  // Extract labels from slot children and register them
  const children = computed(() => {
    const nodes = slots.default?.() ?? []
    // Filter out text/comment nodes (whitespace between code blocks)
    const componentNodes = nodes.filter((node: VNode) =>
      typeof node.type === 'object' || typeof node.type === 'function',
    )
    return componentNodes.map((node: VNode, index: number) => ({
      node,
      label: node.props?.title ?? `Tab ${index + 1}`,
      index,
    }))
  })

  watch(children, items => {
    single.clear()
    for (const item of items) {
      single.register({ id: item.label, value: item.label })
    }
  }, { immediate: true })

  const selectedId = computed(() => toValue(single.selectedId))
</script>

<template>
  <div class="docs-code-group my-4">
    <div class="flex gap-1 px-3 pt-3 pb-0 bg-pre rounded-t-lg overflow-x-auto border-t border-x border-divider">
      <button
        v-for="tab in proxy.values"
        :key="tab.id"
        class="px-2 py-1 text-xs font-medium rounded whitespace-nowrap inline-flex align-center line-height-relaxed"
        :class="[
          tab.isSelected.value
            ? 'bg-primary text-on-primary'
            : 'bg-surface-tint border border-divider text-on-surface-tint hover:bg-surface'
        ]"
        @click="tab.toggle"
      >
        {{ tab.value }}
      </button>
    </div>

    <div class="docs-code-group__content">
      <template v-for="child in children" :key="child.label">
        <div v-show="child.label === selectedId">
          <component :is="child.node" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.docs-code-group__content :deep(.docs-markup) {
  margin-top: 0;
  margin-bottom: 0;
}

.docs-code-group__content :deep(pre) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.docs-code-group__content :deep(.shiki) {
  border-top: none;
}
</style>
