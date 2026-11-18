<script setup lang="ts">
  import { BButton, BChips } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  import type { BChipsItem } from '@paper/bootstrap'

  const initial: BChipsItem[] = [
    { value: 'basic', text: 'Basic chip' },
    { value: 'avatar', text: 'With avatar', src: 'https://github.com/mdo.png' },
    { value: 'icon', text: 'With icon', icon: true },
    { value: 'dismiss', text: 'Dismissible' },
  ]

  const items = shallowRef<BChipsItem[]>(initial.map(item => ({ ...item })))

  function onDismiss (value: string) {
    items.value = items.value.filter(item => item.value !== value)
  }

  function onReset () {
    items.value = initial.map(item => ({ ...item }))
  }
</script>

<template>
  <div
    class="d-flex align-items-center gap-2"
    style="--bs-chip-height: 1.75rem; height: var(--bs-chip-height)"
  >
    <BChips
      dismissible
      :items
      @dismiss="onDismiss"
    />

    <BButton
      v-if="items.length === 0"
      size="xs"
      style="height: var(--bs-chip-height); min-height: var(--bs-chip-height)"
      variant="subtle"
      @click="onReset"
    >
      Reset
    </BButton>
  </div>
</template>
