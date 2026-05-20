<script lang="ts">
  export interface EmCardMediaProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardMedia' })
</script>

<template>
  <div class="emerald-card__media">
    <slot />
  </div>
</template>

<style>
.emerald-card__media {
  display: block;
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--emerald-neutral-100, #f3f3f4);
}

.emerald-card__media :deep(img),
.emerald-card__media :deep(video) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Card uses overflow:clip; media at top inherits the rounded top corners. */
.emerald-card > .emerald-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
</style>
