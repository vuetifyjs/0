<script lang="ts">
  export interface HxSearchResultProps {
    /** Result title */
    title: string
    /** Optional description */
    description?: string
    /** Optional category label */
    category?: string
    /** Optional link href */
    href?: string
    /** Whether this result is currently active/highlighted */
    active?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSearchResult' })

  const {
    title,
    description,
    category,
    href,
    active = false,
  } = defineProps<HxSearchResultProps>()

  const emit = defineEmits<{
    select: []
  }>()
</script>

<template>
  <div
    class="helix-search__result"
    :data-active="active || undefined"
    role="presentation"
    @click="emit('select')"
  >
    <component
      :is="href ? 'a' : 'div'"
      class="helix-search__result-content"
      :href
    >
      <span class="helix-search__result-title">{{ title }}</span>
      <span v-if="description" class="helix-search__result-description">{{ description }}</span>
    </component>

    <span v-if="category" class="helix-search__result-category">{{ category }}</span>
  </div>
</template>

<style scoped>
  .helix-search__result {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .helix-search__result-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    text-decoration: none;
    color: inherit;
  }

  .helix-search__result-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .helix-search__result-description {
    font-size: 0.875em;
    opacity: 0.7;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .helix-search__result-category {
    flex-shrink: 0;
    font-size: 0.75em;
    opacity: 0.5;
    margin-inline-start: 0.5rem;
  }
</style>
