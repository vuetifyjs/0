<script setup lang="ts">
  /**
   * Renders a list of API items (props, events, slots, functions, etc.)
   * Used inside DocsApiHoverSection for v0 API content.
   */
  export interface ApiItem {
    name: string
    type?: string
    default?: string
    signature?: string
    description?: string
  }

  defineProps<{
    /** List of API items to display */
    items: ApiItem[]
    /** Show signature instead of type (for functions) */
    showSignature?: boolean
  }>()
</script>

<template>
  <ul class="api-list">
    <li v-for="item in items" :key="item.name">
      <div class="api-item-header">
        <span class="api-item-name">{{ item.name }}</span>
        <code v-if="item.default" class="api-item-default">{{ item.default }}</code>
      </div>
      <code v-if="item.type && !showSignature" class="api-item-type">{{ item.type }}</code>
      <code v-if="item.signature && showSignature" class="api-item-signature">{{ item.signature }}</code>
      <p v-if="item.description" class="api-item-description">{{ item.description }}</p>
    </li>
  </ul>
</template>

<style scoped>
.api-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.api-list li {
  margin: 0 -12px;
  padding: 6px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--v0-divider) 50%, transparent);
}

.api-list li:last-child {
  border-bottom: none;
}

.api-item-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.api-item-name {
  font-family: var(--v0-font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--v0-primary);
}

.api-item-default {
  padding: 1px 4px;
  font-family: var(--v0-font-mono);
  font-size: 10px;
  color: var(--v0-on-surface);
  opacity: 0.5;
  background: var(--v0-surface-variant);
  border-radius: 3px;
}

.api-item-type {
  display: block;
  margin-top: 4px;
  padding: 4px 6px;
  font-family: var(--v0-font-mono);
  font-size: 10px;
  line-height: 1.5;
  color: var(--v0-on-surface);
  opacity: 0.7;
  background: var(--v0-surface-tint);
  border-radius: 4px;
}

.api-item-signature {
  display: block;
  margin-top: 4px;
  padding: 6px 8px;
  font-family: var(--v0-font-mono);
  font-size: 11px;
  line-height: 1.6;
  color: var(--v0-on-surface);
  background: var(--v0-surface-tint);
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}

.api-item-description {
  margin: 4px 0 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--v0-on-surface);
  opacity: 0.6;
}
</style>
