<script lang="ts" setup>
  import { Popover } from '@vuetify/v0'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Popover.Root v-model="open">
    <Popover.Anchor>
      <button class="px-4 py-1 rounded" style="background-color: var(--v0-primary); color: var(--v0-on-primary);">
        Toggle Popover
      </button>
    </Popover.Anchor>

    <Popover.Content>
      <div class="p-4 border rounded shadow-lg" style="background-color: var(--v0-surface); border-color: var(--v0-divider);">
        <p class="mb-3">Popover content goes here</p>
        <button class="px-3 py-1 rounded text-sm" style="background-color: var(--v0-surface-tint);" @click="open = false">
          Close
        </button>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
