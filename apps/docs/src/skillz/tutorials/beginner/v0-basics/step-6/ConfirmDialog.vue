<script setup>
  // Framework
  import { Dialog } from '@vuetify/v0'

  defineProps({
    title: { type: String, default: 'Confirm' },
    message: { type: String, default: 'Are you sure?' },
    confirmLabel: { type: String, default: 'Confirm' },
    cancelLabel: { type: String, default: 'Cancel' },
  })

  const emit = defineEmits(['confirm'])
</script>

<template>
  <Dialog.Root>
    <Dialog.Activator>
      <slot name="activator" />
    </Dialog.Activator>

    <Dialog.Content
      class="rounded-lg border border-solid border-divider bg-surface p-6 max-w-sm w-full shadow-lg"
    >
      <Dialog.Title class="text-lg font-semibold text-on-surface mb-2">
        {{ title }}
      </Dialog.Title>

      <Dialog.Description class="text-sm text-on-surface-variant mb-6">
        {{ message }}
      </Dialog.Description>

      <div class="flex justify-end gap-3">
        <Dialog.Close>
          <button class="px-4 py-2 text-sm rounded border border-solid border-divider text-on-surface hover:bg-surface-tint transition-colors">
            {{ cancelLabel }}
          </button>
        </Dialog.Close>

        <Dialog.Close>
          <button
            class="px-4 py-2 text-sm rounded bg-error text-on-error transition-colors"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
