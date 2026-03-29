<script lang="ts">
  export interface HxSearchInputProps {
    /** Placeholder text for the search input */
    placeholder?: string
    /** aria-activedescendant ID for keyboard navigation */
    activeDescendant?: string
    /** Whether results are expanded */
    expanded?: boolean
  }
</script>

<script setup lang="ts">
  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  defineOptions({ name: 'HxSearchInput' })

  const {
    placeholder = 'Search...',
    activeDescendant,
    expanded,
  } = defineProps<HxSearchInputProps>()

  const emit = defineEmits<{
    focus: [event: FocusEvent]
    blur: [event: FocusEvent]
  }>()

  const query = defineModel<string>('query', { default: '' })
  const input = useTemplateRef<HTMLInputElement>('input')

  onMounted(() => {
    input.value?.focus()
  })

  defineExpose({ input })
</script>

<template>
  <div class="helix-search__input">
    <svg
      aria-hidden="true"
      class="helix-search__input-icon"
      fill="none"
      height="16"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>

    <input
      ref="input"
      v-model="query"
      :aria-activedescendant="activeDescendant"
      aria-autocomplete="list"
      aria-controls="helix-search-listbox"
      :aria-expanded="expanded"
      class="helix-search__input-field"
      :placeholder
      role="combobox"
      type="search"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >

    <button
      v-if="query"
      aria-label="Clear search"
      class="helix-search__input-clear"
      type="button"
      @click="query = ''"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>

    <slot name="append" />
  </div>
</template>

<style scoped>
  .helix-search__input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid currentColor;
    opacity: 0.8;
  }

  .helix-search__input-icon {
    flex-shrink: 0;
    opacity: 0.5;
  }

  .helix-search__input-field {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font: inherit;
    color: inherit;
    width: 100%;
  }

  .helix-search__input-clear {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    border: none;
    border-radius: 0.25rem;
    background: transparent;
    color: inherit;
    opacity: 0.5;
    cursor: pointer;
  }

  .helix-search__input-clear:hover {
    opacity: 1;
  }
</style>
