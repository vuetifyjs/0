<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import DocumentActions from './DocumentActions.vue'

  const action = shallowRef('None')

  function onAction (name: string) {
    action.value = name
  }
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <Menu.Root>
      <Menu.Context class="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-divider text-sm text-on-surface-variant">
        Right-click this area
      </Menu.Context>

      <Menu.Content class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg">
        <DocumentActions @action="onAction" />
      </Menu.Content>
    </Menu.Root>

    <p class="text-sm text-on-surface-variant">
      Last action: {{ action }}
    </p>
  </div>
</template>
