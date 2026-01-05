<script setup lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<template>
  <div class="flex justify-center">
    <Dialog.Root>
      <Dialog.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Click Me
      </Dialog.Activator>

      <Dialog.Content class="m-auto rounded-xl bg-surface border border-divider max-w-md w-full">
        <div class="px-4 py-2 border-b border-divider">
          <Dialog.Title as="h3" class="text-lg font-semibold text-on-surface">
            Deactivate account
          </Dialog.Title>

          <Dialog.Description class="text-sm text-on-surface-variant">
            This will permanently deactivate your account.
          </Dialog.Description>
        </div>

        <div class="p-4 space-y-4">
          <p class="text-sm text-on-surface leading-relaxed">
            Are you sure you want to deactivate your account? All of your data will
            be permanently removed from our servers. This action cannot be undone.
          </p>
        </div>

        <div class="flex gap-3 justify-end p-4 pt-0">
          <Dialog.Close class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint">
            Cancel
          </Dialog.Close>

          <Dialog.Close class="px-4 py-2 text-sm font-medium rounded-md bg-error text-on-error">
            Deactivate
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</template>
