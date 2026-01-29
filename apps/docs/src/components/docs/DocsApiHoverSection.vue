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
    <span class="popover-section-title">{{ title }}</span>
    <ul class="popover-list">
      <li v-for="item in items" :key="item.name">
        <div class="popover-item-header">
          <span class="popover-item-name">{{ item.name }}</span>
          <code v-if="item.type && !showSignature" class="popover-type">{{ item.type }}</code>
          <code v-if="item.default" class="popover-default">{{ item.default }}</code>
        </div>
        <code v-if="item.signature && showSignature" class="popover-signature">{{ item.signature }}</code>
        <p v-if="item.description" class="popover-item-description">
          {{ item.description }}
        </p>
      </li>
    </ul>
  </div>
</template>
