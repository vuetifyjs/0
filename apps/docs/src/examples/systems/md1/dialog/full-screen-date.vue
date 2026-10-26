<script setup lang="ts">
  import { Md1Button, Md1DatePicker, Md1Dialog, Md1TextField } from '@paper/md1'
  import { isString } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

  // The field shows the long date; the picker works in ISO dates. Each shown
  // date remembers its ISO form, which the picker opens on; the ISO date the
  // dialog writes back on OK is turned into the long date again.
  const iso = new Map<string, string>()

  const open = shallowRef(false)
  const saved = shallowRef(format('2017-04-13'))
  const date = shallowRef('')
  const guests = shallowRef('12')

  const dirty = toRef(() => date.value !== saved.value)

  // Every opening starts from what was last saved.
  watch(open, value => {
    if (value) date.value = saved.value
  })

  function format (value: string): string {
    const [year, month, day] = value.split('-').map(Number)
    const text = new Date(year!, month! - 1, day).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })

    iso.set(text, value)

    return text
  }

  function parse (value: unknown): string | undefined {
    return isString(value) ? iso.get(value) : undefined
  }

  function onDate (value: string) {
    date.value = /^\d{4}-\d{2}-\d{2}$/.test(value) ? format(value) : value
  }

  function onSave () {
    saved.value = date.value
  }
</script>

<template>
  <div class="md1-docs-dialog-stack" data-grid>
    <Md1Dialog v-slot="{ close }" v-model="open" :dirty variant="full-screen">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">Book a table</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content aria-labelledby="md1-docs-fs-date-title">
        <div class="md1-docs-fs-bar">
          <Md1Button aria-label="Discard" icon="close" @click="close" />

          <span class="md1-docs-fs-spacer" />

          <Md1Dialog.Confirm @confirm="onSave">Save</Md1Dialog.Confirm>
        </div>

        <h2 id="md1-docs-fs-date-title" class="md1-docs-fs-title md1-type-headline">Reserve the private dining room for a large party at Cafe Basilico</h2>

        <div class="md1-docs-fs-fields">
          <Md1TextField
            v-slot="{ value }"
            label="Date"
            :model-value="date"
            picker="date"
            @update:model-value="onDate"
          >
            <Md1DatePicker :model-value="parse(value)" />
          </Md1TextField>

          <Md1TextField v-model="guests" label="Guests" />
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note" role="status">Booked for {{ saved }}</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-dialog-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The 56 dp primary app bar of a full-screen dialog: the X, and the verb at the end. No title: it is too long for the bar. */
  .md1-docs-fs-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--md1-spacing-1, 8px) 0 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-fs-bar .md1-button[data-variant] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-fs-spacer {
    flex: 1 1 auto;
  }

  /* The long title moves into the content, where it can wrap, on the 24 dp content keyline. */
  .md1-docs-fs-title {
    margin: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 0;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-fs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
  }
</style>
