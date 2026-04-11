<script lang="ts">
  export interface CxHeaderAnchorProps {
    id: string
    tag?: 'h2' | 'h3' | 'h4'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxHeaderAnchor' })

  const {
    id,
    tag = 'h3',
  } = defineProps<CxHeaderAnchorProps>()
</script>

<template>
  <component
    :is="tag"
    :id
    class="codex-header-anchor"
  >
    <a
      class="codex-header-anchor__link"
      :href="`#${id}`"
    >
      <slot />
    </a>
  </component>
</template>

<style scoped>
  .codex-header-anchor {
    position: relative;
  }

  .codex-header-anchor__link {
    text-decoration: none;
    color: inherit;
  }

  .codex-header-anchor__link:hover::before {
    content: '#';
    position: absolute;
    inset-inline-start: -1.25em;
    opacity: 0.5;
  }
</style>
