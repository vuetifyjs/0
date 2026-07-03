<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Button, Dialog, Snackbar } from '@vuetify/v0'

  const saved = shallowRef(false)

  function onSave () {
    saved.value = true
  }

  function onDismiss () {
    saved.value = false
  }
</script>

<template>
  <div class="flex justify-center p-6">
    <Dialog.Root>
      <Dialog.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Open Settings
      </Dialog.Activator>

      <Dialog.Content class="m-auto rounded-xl bg-surface border border-divider max-w-sm w-full">
        <div class="px-4 py-3 border-b border-divider">
          <Dialog.Title as="h3" class="text-base font-semibold text-on-surface">
            Settings
          </Dialog.Title>
        </div>

        <div class="p-4">
          <p class="text-sm text-on-surface-variant">
            Adjust your preferences, then save.
          </p>
        </div>

        <div class="flex gap-2 justify-end p-4 pt-0">
          <Dialog.Close class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint">
            Close
          </Dialog.Close>

          <Button.Root
            class="px-4 py-2 text-sm font-medium rounded-md bg-primary text-on-primary"
            @click="onSave"
          >
            Save
          </Button.Root>
        </div>
      </Dialog.Content>
    </Dialog.Root>

    <!-- Defaults to teleport="top-layer" — mounts inside the open dialog, stays interactive.
         Position lives on the Portal wrapper (like the basic example) so the useStack z-index
         lands on a positioned element and still wins once it falls back to body on close. -->
    <Snackbar.Portal class="fixed bottom-4 right-4">
      <Snackbar.Root
        v-if="saved"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm bg-surface border border-divider"
        role="status"
        @dismiss="onDismiss"
      >
        <Snackbar.Content>Settings saved</Snackbar.Content>

        <Snackbar.Close class="p-1 -mr-1 opacity-50 hover:opacity-100">
          <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor" />
          </svg>
        </Snackbar.Close>
      </Snackbar.Root>
    </Snackbar.Portal>
  </div>
</template>
