<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  // External dependency: @vuetify/v0 Dialog compound component
  // Consumer must have @vuetify/v0 installed
  import { Dialog } from '@vuetify/v0'

  // Sub-components
  import CxSearchEmpty from './CxSearchEmpty.vue'
  import CxSearchFooter from './CxSearchFooter.vue'
  import CxSearchInput from './CxSearchInput.vue'
  import CxSearchResult from './CxSearchResult.vue'

  // Composables
  import { useSearch } from '#codex/composables/useSearch'

  // Types
  import type { SearchItem } from '#codex/composables/useSearch'
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxSearchProps extends V0PaperProps {
    /** Search items — when provided, component handles filtering internally */
    items?: SearchItem[]
    /** Keyboard shortcut to toggle search. @default 'ctrl+k' */
    hotkey?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { watch } from 'vue'

  defineOptions({ name: 'CxSearch' })

  const {
    items,
    hotkey = 'ctrl+k',
    ...paperProps
  } = defineProps<CxSearchProps>()

  const open = defineModel<boolean>('open', { default: false })

  // When items are provided, use internal search composable
  const search = items
    ? useSearch({ items: () => items, hotkey })
    : undefined

  // Sync composable's isOpen with the v-model (single direction: model drives composable)
  if (search) {
    watch(search.isOpen, value => {
      open.value = value
    })
    watch(open, value => {
      if (value !== search.isOpen.value) {
        value ? search.open() : search.close()
      }
    })
  }
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Content v-slot="{ attrs }">
      <V0Paper
        v-bind="{ ...paperProps, ...attrs }"
        as="div"
        class="codex-search"
      >
        <span class="sr-only">Search</span>

        <!-- Auto-search mode: items provided, render full UI with default slot fallback -->
        <template v-if="search && items">
          <slot :query="search.query.value" :results="search.results.value">
            <CxSearchInput v-model:query="search.query.value" />

            <div class="codex-search__results">
              <template v-if="search.results.value.length > 0">
                <CxSearchResult
                  v-for="result in search.results.value"
                  :key="result.id"
                  :category="result.category"
                  :description="result.description"
                  :href="result.href"
                  :title="result.title"
                />
              </template>
              <CxSearchEmpty v-else :query="search.query.value" />
            </div>

            <CxSearchFooter />
          </slot>
        </template>

        <!-- Manual mode: consumer composes sub-components -->
        <template v-else>
          <slot />
        </template>
      </V0Paper>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
  .codex-search {
    display: flex;
    flex-direction: column;
  }

  .codex-search__results {
    flex: 1;
    overflow-y: auto;
  }
</style>
