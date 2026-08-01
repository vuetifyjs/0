<script setup lang="ts">
  defineOptions({ name: 'OnDialogFooter' })
</script>

<template>
  <div class="onyx-dialog__footer">
    <slot />
  </div>
</template>

<!-- Unscoped: matches the DS-wide no-scoped-styles policy for consistency across the
     family (DESIGN_SYSTEMS.md §3), even though this element has no compound children. -->
<style>
  .onyx-dialog__footer {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-sm, 12px);
    justify-content: flex-end;
  }
</style>
