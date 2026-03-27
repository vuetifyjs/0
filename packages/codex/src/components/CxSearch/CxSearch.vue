<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  // External dependency: @vuetify/v0 Dialog compound component
  // Consumer must have @vuetify/v0 installed
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxSearchProps extends V0PaperProps {
    /** Input placeholder text */
    placeholder?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'CxSearch' })

  const {
    placeholder = 'Search...',
    ...paperProps
  } = defineProps<CxSearchProps>()

  const emit = defineEmits<{
    search: [query: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const inputRef = useTemplateRef<HTMLInputElement>('input')

  watch(open, value => {
    if (value) {
      // Focus input when dialog opens
      requestAnimationFrame(() => inputRef.value?.focus())
    }
  })

  function onInput (event: Event) {
    const target = event.target as HTMLInputElement
    emit('search', target.value)
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content>
      <V0Paper
        v-bind="paperProps"
        as="div"
        class="codex-search"
      >
        <div class="codex-search__input-area">
          <input
            ref="input"
            class="codex-search__input"
            :placeholder
            type="search"
            @input="onInput"
          >
        </div>

        <!-- Results area — consumer provides content -->
        <div class="codex-search__results">
          <slot />
        </div>
      </V0Paper>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
  .codex-search {
    display: flex;
    flex-direction: column;
  }

  .codex-search__input-area {
    display: flex;
    align-items: center;
  }

  .codex-search__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font: inherit;
    width: 100%;
  }

  .codex-search__results {
    flex: 1;
    overflow-y: auto;
  }
</style>
