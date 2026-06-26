<script setup lang="ts">
  import { Button, Input } from '@vuetify/v0'

  const { saved, save, forget, reset } = defineProps<{
    saved: boolean
    save: () => void
    forget: () => void
    reset: () => void
  }>()

  const name = defineModel<string>('name', { default: '' })
  const theme = defineModel<string>('theme', { default: 'system' })
  const note = defineModel<string>('note', { default: '' })

  const themes = ['light', 'dark', 'system']

  const field = 'w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary transition-colors'
</script>

<template>
  <div class="space-y-4">
    <Input.Root v-model="name" label="Display name">
      <Input.Control
        autocomplete="name"
        :class="field"
        placeholder="Your name"
      />
    </Input.Root>

    <div class="space-y-1.5">
      <p class="text-xs text-on-surface-variant">Theme</p>

      <div class="flex gap-1.5">
        <Button.Root
          v-for="t in themes"
          :key="t"
          class="flex-1 px-3 py-1.5 text-xs rounded-md border capitalize transition-colors"
          :class="theme === t
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-divider text-on-surface-variant hover:border-primary/50'"
          @click="theme = t"
        >
          {{ t }}
        </Button.Root>
      </div>
    </div>

    <div class="rounded-lg border border-divider p-3 space-y-2">
      <Input.Root v-model="note" label="Draft note">
        <Input.Control
          :class="field"
          placeholder="Type a note to persist"
        />
      </Input.Root>

      <div class="flex items-center justify-between gap-2">
        <p class="text-xs" :class="saved ? 'text-success' : 'text-on-surface-variant'">
          has('note'): <span class="font-mono">{{ saved }}</span>
        </p>

        <div class="flex gap-1.5">
          <Button.Root
            class="px-3 py-1.5 text-xs rounded-md bg-primary text-on-primary font-medium hover:opacity-90 transition-opacity"
            @click="save"
          >
            Save
          </Button.Root>

          <Button.Root
            class="px-3 py-1.5 text-xs rounded-md border border-divider text-on-surface-variant hover:border-error hover:text-error transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="!saved"
            @click="forget"
          >
            Forget
          </Button.Root>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <Button.Root
        class="px-3 py-1.5 text-xs rounded-md border border-divider text-on-surface-variant hover:border-error hover:text-error transition-colors"
        @click="reset"
      >
        Reset all
      </Button.Root>
    </div>
  </div>
</template>
