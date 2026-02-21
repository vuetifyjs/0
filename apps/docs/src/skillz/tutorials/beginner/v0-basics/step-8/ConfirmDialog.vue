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
      class="rounded-xl border border-solid border-divider bg-surface p-0 max-w-sm w-full shadow-xl"
    >
      <div class="p-6">
        <Dialog.Title class="text-lg font-semibold text-on-surface mb-1">
          {{ title }}
        </Dialog.Title>

        <Dialog.Description class="text-sm text-on-surface-variant leading-relaxed">
          {{ message }}
        </Dialog.Description>
      </div>

      <div class="flex justify-end gap-3 px-6 py-4 border-t border-solid border-divider bg-surface-tint rounded-b-xl">
        <Dialog.Close>
          <button class="px-4 py-2 text-sm font-medium rounded-lg border border-solid border-divider text-on-surface hover:bg-surface transition-colors">
            {{ cancelLabel }}
          </button>
        </Dialog.Close>

        <Dialog.Close>
          <button
            class="px-4 py-2 text-sm font-medium rounded-lg bg-error text-on-error hover:opacity-90 transition-opacity"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </Dialog.Close>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
