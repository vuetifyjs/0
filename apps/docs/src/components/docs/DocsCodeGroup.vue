<script setup lang="ts">
  // Framework
  import { createSingle, useProxyRegistry } from '@vuetify/v0'

  // Composables
  import { useSettings, type PackageManager } from '@/composables/useSettings'

  // Utilities
  import { cloneVNode, computed, toValue, useId, useSlots, type VNode, watch } from 'vue'

  const props = defineProps<{
    noFilename?: boolean
  }>()

  const PACKAGE_MANAGERS: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun']

  const slots = useSlots()
  const uid = useId()
  const settings = useSettings()

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
      // Clone node with hideFilename prop if set on code-group
      node: props.noFilename ? cloneVNode(node, { hideFilename: true }) : node,
      label: node.props?.title ?? `Tab ${index + 1}`,
      index,
    }))
  })

  watch(children, items => {
    single.clear()
    single.onboard(items.map(item => ({ id: item.label, value: item.label })))
  }, { immediate: true })

  // Select user's preferred package manager when preference or children change
  watch([children, () => settings.packageManager.value], ([items, pm]) => {
    // Validate package manager preference
    if (!PACKAGE_MANAGERS.includes(pm)) return

    const labels = new Set(items.map(i => i.label.toLowerCase()))
    const hasPackageManagers = PACKAGE_MANAGERS.some(p => labels.has(p))
    if (hasPackageManagers && labels.has(pm)) {
      single.select(pm)
    }
  }, { immediate: true })

  const selectedId = computed(() => toValue(single.selectedId))

  function onKeydown (event: KeyboardEvent) {
    const tabs = Array.from(proxy.values)
    const currentIndex = tabs.findIndex(t => t.isSelected.value)
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowLeft': {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        event.preventDefault()
        break
      }
      case 'ArrowRight': {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        event.preventDefault()
        break
      }
      case 'Home': {
        nextIndex = 0
        event.preventDefault()
        break
      }
      case 'End': {
        nextIndex = tabs.length - 1
        event.preventDefault()
        break
      }
      default: {
        return
      }
    }

    if (nextIndex !== currentIndex) {
      // Manual activation: arrow keys only move focus, Enter/Space selects (native button behavior)
      document.querySelector<HTMLButtonElement>(`#${CSS.escape(`${uid}-tab-${tabs[nextIndex].id}`)}`)?.focus()
    }
  }
</script>

<template>
  <div class="docs-code-group my-4">
    <div
      aria-label="Code examples"
      class="flex gap-1 px-3 pt-3 pb-0 bg-surface rounded-t-lg overflow-x-auto border-t border-x border-divider"
      role="tablist"
      @keydown="onKeydown"
    >
      <button
        v-for="tab in proxy.values"
        :id="`${uid}-tab-${tab.id}`"
        :key="tab.id"
        :aria-controls="`${uid}-panel-${tab.id}`"
        :aria-selected="tab.isSelected.value"
        class="px-2 py-1 text-xs font-medium rounded whitespace-nowrap inline-flex items-center line-height-relaxed"
        :class="[
          tab.isSelected.value
            ? 'bg-primary text-on-primary'
            : 'bg-surface-tint border border-divider text-on-surface-tint hover:bg-surface'
        ]"
        role="tab"
        :tabindex="tab.isSelected.value ? 0 : -1"
        @click="tab.toggle"
      >
        {{ tab.value }}
      </button>
    </div>

    <div class="docs-code-group__content">
      <template v-for="child in children" :key="child.label">
        <div
          :id="`${uid}-panel-${child.label}`"
          :aria-labelledby="`${uid}-tab-${child.label}`"
          :hidden="child.label !== selectedId"
          role="tabpanel"
        >
          <component :is="child.node" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.docs-code-group__content > [role="tabpanel"] > * {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
