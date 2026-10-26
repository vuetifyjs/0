<script setup lang="ts">
  import { Md1Button, Md1Chip } from '@paper/md1'

  import { ref } from 'vue'

  const INITIAL = ['Toronto', 'This week', 'Has attachment', 'Unread']

  const filters = ref([...INITIAL])

  function onDelete (filter: string) {
    filters.value = filters.value.filter(item => item !== filter)
  }

  function onReset () {
    filters.value = [...INITIAL]
  }
</script>

<template>
  <div class="md1-docs-stack md1-docs-chip-deletable">
    <div class="md1-docs-row md1-docs-chip-filters">
      <Md1Chip
        v-for="filter in filters"
        :key="filter"
        deletable
        @delete="onDelete(filter)"
      >
        {{ filter }}
      </Md1Chip>

      <span v-if="filters.length === 0" class="md1-docs-note" role="status">No filters</span>
    </div>

    <Md1Button :disabled="filters.length === INITIAL.length" @click="onReset">Reset</Md1Button>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /*
   * The filters hold the width of the full set and start at its left edge, so
   * deleting a chip closes the gap from the right instead of re-centring the
   * row and moving the chip under the pointer. The row keeps the height of the
   * full set, one line or two when it wraps, so Reset stays put when it brings
   * the chips back.
   */
  .md1-docs-chip-deletable {
    container-type: inline-size;
  }

  .md1-docs-chip-deletable > .md1-docs-chip-filters {
    inline-size: min(100%, 440px);
    justify-content: flex-start;
    align-content: flex-start;
    min-block-size: 32px;
  }

  @container (width < 440px) {
    .md1-docs-chip-deletable > .md1-docs-chip-filters {
      min-block-size: 72px;
    }
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
