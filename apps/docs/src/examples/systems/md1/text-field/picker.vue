<script setup lang="ts">
  import { Md1DatePicker, Md1TextField } from '@paper/md1'
  import { isString } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  // The field shows the long date; the picker works in ISO dates. Each shown date remembers its ISO form.
  const iso = new Map<string, string>()

  const departure = shallowRef(format('2017-04-13'))
  const arrival = shallowRef('')

  function format (value: string): string {
    const [year, month, day] = value.split('-').map(Number)
    const text = new Date(year!, month! - 1, day).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })

    iso.set(text, value)

    return text
  }

  function parse (value: unknown): string | undefined {
    return isString(value) ? iso.get(value) : undefined
  }

  function onPick (value: unknown, commit: (value: unknown) => void) {
    if (isString(value)) commit(format(value))
  }
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="md1-docs-fields" data-grid>
    <Md1TextField
      v-slot="{ value, commit }"
      v-model="departure"
      label="Departure"
      picker="date"
    >
      <Md1DatePicker :model-value="parse(value)" @update:model-value="onPick($event, commit)" />
    </Md1TextField>

    <Md1TextField
      v-slot="{ value, commit }"
      v-model="arrival"
      box
      label="Return"
      picker="date"
    >
      <Md1DatePicker :model-value="parse(value)" @update:model-value="onPick($event, commit)" />
    </Md1TextField>
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
