<script setup lang="ts">
  /**
   * Reusable section component for DocsApiHover popover content.
   * Renders a titled list of API items (props, events, slots, functions, etc.)
   */
  export interface ApiItem {
    name: string
    type?: string
    default?: string
    signature?: string
    description?: string
  }

  defineProps<{
    /** Section title (e.g., "Props", "Events", "Functions") */
    title: string
    /** List of API items to display */
    items: ApiItem[]
    /** Show signature instead of type (for functions) */
    showSignature?: boolean
  }>()
</script>

<template>
  <div v-if="items.length > 0" class="popover-section">
    <span class="sticky top-0 z-1 block mx-[-12px] py-2 px-3 text-[11px] font-semibold uppercase tracking-[0.5px] text-on-surface/60 bg-surface-tint border-y border-divider">
      {{ title }}
    </span>
    <ul class="m-0 p-0 list-none">
      <li
        v-for="(item, i) in items"
        :key="item.name"
        class="mx-[-12px] py-1.5 px-3"
        :class="i < items.length - 1 ? 'border-b border-divider/50' : ''"
      >
        <div class="flex items-baseline gap-2">
          <span class="font-mono text-xs font-medium text-primary">{{ item.name }}</span>
          <code
            v-if="item.type && !showSignature"
            class="py-0.5 px-1.5 font-mono text-[11px] text-on-surface/60 bg-surface-variant rounded overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
          >
            {{ item.type }}
          </code>
          <code
            v-if="item.default"
            class="ml-auto py-0.5 px-1.5 font-mono text-[10px] bg-surface-variant rounded"
          >
            {{ item.default }}
          </code>
        </div>
        <code
          v-if="item.signature && showSignature"
          class="block mt-1 py-1 px-2 font-mono text-[11px] text-on-surface/60 bg-surface-variant rounded overflow-x-auto whitespace-nowrap"
        >
          {{ item.signature }}
        </code>
        <p
          v-if="item.description"
          class="mt-1 mb-0 text-[11px] leading-[1.4] text-on-surface/60"
        >
          {{ item.description }}
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* First section in container should not have top border */
.popover-section:first-child > span {
  border-top: none;
}
</style>
