<script lang="ts">
  export interface HxSearchResultProps {
    /** Result title */
    title: string
    /** Optional subtitle (e.g. headings breadcrumb) */
    subtitle?: string
    /** Optional description */
    description?: string
    /** Optional category label */
    category?: string
    /** Optional link href */
    href?: string
    /** Whether this result is currently selected via keyboard */
    selected?: boolean
    /** Unique ID for aria-activedescendant */
    resultId?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSearchResult' })

  const {
    title,
    subtitle,
    description,
    category,
    href,
    selected = false,
    resultId,
  } = defineProps<HxSearchResultProps>()

  const emit = defineEmits<{
    select: []
    hover: []
  }>()
</script>

<template>
  <div
    :id="resultId"
    :aria-selected="selected"
    class="helix-search__result"
    :data-selected="selected || undefined"
    role="option"
    tabindex="-1"
    @click="emit('select')"
    @mouseenter="emit('hover')"
  >
    <div class="helix-search__result-content">
      <component
        :is="href ? 'a' : 'span'"
        class="helix-search__result-title"
        :href
      >
        {{ title }}
      </component>
      <span v-if="subtitle" class="helix-search__result-subtitle">{{ subtitle }}</span>
      <span v-if="description" class="helix-search__result-description">{{ description }}</span>
    </div>

    <span v-if="category" class="helix-search__result-category">{{ category }}</span>

    <div class="helix-search__result-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
  .helix-search__result {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 150ms;
  }

  .helix-search__result-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 0.125rem;
  }

  .helix-search__result-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
    color: inherit;
    font-weight: 500;
  }

  .helix-search__result-subtitle {
    font-size: 0.75em;
    opacity: 0.6;
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

  .helix-search__result-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
  }
</style>
