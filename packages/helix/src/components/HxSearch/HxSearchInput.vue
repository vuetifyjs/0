<script lang="ts">
  export interface HxSearchInputProps {
    /** Placeholder text for the search input */
    placeholder?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { onMounted, useTemplateRef } from 'vue'

  defineOptions({ name: 'HxSearchInput' })

  const {
    placeholder = 'Search...',
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
      class="helix-search__input-field"
      :placeholder
      type="search"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    >
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
</style>
