<script setup lang="ts">
  /**
   * Reusable section component for DocsApiHover popover content.
   * Used by both Vue API and v0 API sections for consistency.
   */
  defineProps<{
    /** Section title (e.g., "Props", "When to use") */
    title: string
  }>()
</script>

<template>
  <div class="popover-section">
    <span class="popover-section-label">{{ title }}</span>
    <div class="popover-section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.popover-section {
  margin-bottom: 12px;
}

.popover-section:last-child {
  margin-bottom: 0;
}

.popover-section-label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--v0-primary);
}

.popover-section-content {
  font-size: 12px;
  line-height: 1.5;
  color: var(--v0-on-surface);
}

.popover-section-content :deep(p) {
  margin: 0;
}

.popover-section-content :deep(code) {
  display: block;
  margin-top: 4px;
  padding: 4px 6px;
  font-family: var(--v0-font-mono);
  font-size: 11px;
  color: var(--v0-on-surface);
  opacity: 0.7;
  background: var(--v0-surface-variant);
  border-radius: 4px;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
