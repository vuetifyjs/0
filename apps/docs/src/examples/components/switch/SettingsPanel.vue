<script setup lang="ts">
  import { Form, Switch } from '@vuetify/v0'
  import type { Setting } from './useSettings'

  const {
    settings,
    submit,
    reset,
  } = defineProps<{
    settings: Setting[]
    submit: (valid: boolean) => void
    reset: () => void
  }>()

  const enabled = defineModel<string[]>('enabled', { default: () => [] })

  const track = 'relative inline-flex items-center w-11 h-6 rounded-full bg-surface-variant transition-colors data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary/50'
  const thumb = 'block size-4 rounded-full bg-on-primary shadow-sm transition-transform translate-x-1 data-[state=checked]:translate-x-6 data-[state=indeterminate]:translate-x-3.5'

  function onSubmit (payload: { valid: boolean }) {
    submit(payload.valid)
  }
</script>

<template>
  <Form
    class="flex flex-col gap-4"
    @reset="reset"
    @submit="onSubmit"
  >
    <Switch.Group v-model="enabled" class="flex flex-col gap-1" label="Notification settings">
      <label class="flex items-center justify-between gap-4 py-3 cursor-pointer border-b border-divider">
        <span class="text-sm font-medium text-on-surface">Enable all</span>

        <Switch.SelectAll
          class="inline-flex items-center border-none bg-transparent p-0 outline-none"
          label="Enable all settings"
        >
          <Switch.Track :class="track">
            <Switch.Thumb :class="thumb" />
          </Switch.Track>
        </Switch.SelectAll>
      </label>

      <label
        v-for="setting in settings"
        :key="setting.id"
        class="flex items-center justify-between gap-4 py-3 cursor-pointer"
      >
        <span class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-on-surface">{{ setting.label }}</span>
          <span class="text-xs text-on-surface-variant">{{ setting.description }}</span>
        </span>

        <Switch.Root
          class="inline-flex items-center border-none bg-transparent p-0 outline-none shrink-0"
          name="notifications"
          :value="setting.id"
        >
          <Switch.Track :class="track">
            <Switch.Thumb :class="thumb" />
          </Switch.Track>
        </Switch.Root>
      </label>
    </Switch.Group>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
        type="submit"
      >
        Save changes
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="reset"
      >
        Reset
      </button>
    </div>
  </Form>
</template>
