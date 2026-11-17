<script setup lang="ts">
  import { Button, Form, TimePicker } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const value = shallowRef<string | null>(null)
  const booked = shallowRef<string | null>(null)

  const rules = [(time: unknown) => time !== '12:00' || 'The desk is closed at noon']

  async function onBook (submit: () => Promise<boolean>) {
    const valid = await submit()
    booked.value = valid ? value.value : null
  }
</script>

<template>
  <Form v-slot="{ submit }" class="flex flex-col items-start gap-3">
    <TimePicker.Root
      v-model="value"
      class="group flex flex-wrap items-center gap-2"
      required
      :rules
    >
      <TimePicker.Hour
        v-slot="{ text }"
        class="w-16 h-12 flex items-center justify-center border border-divider rounded tabular-nums group-data-[state=invalid]:border-error"
      >
        {{ text || '—' }}
      </TimePicker.Hour>

      <span aria-hidden="true">:</span>

      <TimePicker.Minute
        v-slot="{ text }"
        class="w-16 h-12 flex items-center justify-center border border-divider rounded tabular-nums group-data-[state=invalid]:border-error"
      >
        {{ text || '—' }}
      </TimePicker.Minute>

      <TimePicker.Description class="basis-full text-sm text-on-surface-variant">
        Pick a pickup time. The desk is closed at noon.
      </TimePicker.Description>

      <TimePicker.Error
        v-slot="{ errors }"
        class="basis-full text-sm text-error data-[state=hidden]:hidden"
      >
        <span v-for="error in errors" :key="error">{{ error }}</span>
      </TimePicker.Error>
    </TimePicker.Root>

    <Button.Root class="px-3 py-2 border border-divider rounded" @click="onBook(submit)">
      Book
    </Button.Root>

    <p class="text-sm text-on-surface-variant">
      {{ booked ? `Booked for ${booked}` : 'Not booked' }}
    </p>
  </Form>
</template>
