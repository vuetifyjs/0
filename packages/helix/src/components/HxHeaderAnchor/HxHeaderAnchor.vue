<script lang="ts">
  export interface HxHeaderAnchorProps {
    id: string
    tag?: 'h2' | 'h3' | 'h4'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxHeaderAnchor' })

  const {
    id,
    tag = 'h3',
  } = defineProps<HxHeaderAnchorProps>()
</script>

<template>
  <component
    :is="tag"
    :id
    class="helix-header-anchor"
  >
    <a
      class="helix-header-anchor__link"
      :href="`#${id}`"
    >
      <slot />
    </a>
  </component>
</template>

<style scoped>
  .helix-header-anchor {
    position: relative;
    color: var(--v0-on-surface);
  }

  .helix-header-anchor__link {
    text-decoration: none;
    color: inherit;
  }

  .helix-header-anchor__link:hover::before {
    content: '#';
    position: absolute;
    inset-inline-start: -1.25em;
    color: var(--v0-primary);
    opacity: 0.7;
  }
</style>
