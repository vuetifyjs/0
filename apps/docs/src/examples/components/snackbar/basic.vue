<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Snackbar } from '@vuetify/v0'

  const visible = shallowRef(false)

  function onShow () {
    visible.value = true
  }

  function onDismiss () {
    visible.value = false
  }
</script>

<template>
  <div class="relative flex items-center justify-center min-h-48 p-6 bg-background rounded-lg border border-divider overflow-hidden">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
      @click="onShow"
    >
      Show Snackbar
    </button>

    <Snackbar.Portal class="absolute bottom-4 right-4" :teleport="false">
      <Snackbar.Root
        v-if="visible"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm bg-surface border border-divider"
        role="status"
        @dismiss="onDismiss"
      >
        <Snackbar.Content>
          Changes saved successfully
        </Snackbar.Content>

        <Snackbar.Close class="p-1 -mr-1 opacity-50 hover:opacity-100">
          <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor" />
          </svg>
        </Snackbar.Close>
      </Snackbar.Root>
    </Snackbar.Portal>
  </div>
</template>
