<script lang="ts">
  export interface EmBadgeAnchorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBadgeAnchor' })
</script>

<template>
  <span class="emerald-badge__anchor">
    <slot />
  </span>
</template>

<style scoped>
.emerald-badge__anchor {
  position: relative;
  display: inline-flex;
}

/*
 * Figma icon-badge exhibit (8940:13357): 20px badge over a 32px icon,
 * protruding 5px past the right edge and 6px above the top — 25% / 30%
 * of the badge size, kept proportional across shapes.
 */
.emerald-badge__anchor > :slotted(.emerald-badge) {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(25%, -30%);
}
</style>
