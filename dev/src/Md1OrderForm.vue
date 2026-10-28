<script setup lang="ts">
  // Components
  import {
    Md1Autocomplete,
    Md1Button,
    Md1Chip,
    Md1DatePicker,
    Md1Dialog,
    Md1DropdownButton,
    Md1Slider,
    Md1Snackbar,
    Md1Switch,
    Md1TextField,
    Md1TimePicker,
  } from '@paper/md1'

  // Framework
  import { Form, isString, useTimer } from '@vuetify/v0'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const names = [
    'Ana Ribeiro',
    'Ben Okafor',
    'Chen Wei',
    'Dana Petrov',
    'Elif Demir',
    'Franco Rossi',
    'Grace Mbeki',
    'Hana Suzuki',
    'Igor Volkov',
    'Jade Nguyen',
  ]

  const categories = {
    coffee: 'Coffee',
    tea: 'Tea',
    equipment: 'Equipment',
    gifts: 'Gift sets',
  }

  const customer = shallowRef<string>()
  const category = shallowRef<keyof typeof categories>('coffee')
  const quantity = shallowRef('')
  const date = shallowRef('')
  const time = shallowRef('')
  const priority = shallowRef(3)
  const tags = ref<string[]>([])
  const draft = shallowRef('')
  const gift = shallowRef(false)
  const notes = shallowRef('')

  const missing = shallowRef<string>()

  /** The fields the form resets to; anything else makes Discard ask first. */
  const dirty = toRef(() =>
    !!customer.value
    || quantity.value !== ''
    || date.value !== ''
    || time.value !== ''
    || priority.value !== 3
    || tags.value.length > 0
    || gift.value
    || notes.value !== '',
  )

  function least (value: unknown) {
    const count = Number(value)

    return (Number.isInteger(count) && count >= 1) || 'Error: order at least one item'
  }

  function filled (value: unknown) {
    return String(value).trim().length > 0 || 'Error: pick a delivery date'
  }

  // The field shows the long date the data-formats page prefers; the picker works in ISO dates.
  const dates = new Map<string, string>()

  function format (value: string): string {
    const [year, month, day] = value.split('-').map(Number)
    const text = new Date(year!, month! - 1, day).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })

    dates.set(text, value)

    return text
  }

  function parse (value: unknown): string | undefined {
    return isString(value) ? dates.get(value) : undefined
  }

  function onDate (value: unknown, commit: (value: unknown) => void) {
    if (isString(value)) commit(format(value))
  }

  // The same round trip for the clock: 12-hour text in the field, HH:MM in the picker.
  const times = new Map<string, string>()

  function clock (value: string): string {
    const [hour, minute] = value.split(':').map(Number)
    const text = new Date(2026, 0, 1, hour!, minute!).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

    times.set(text, value)

    return text
  }

  function when (value: unknown): string | undefined {
    return isString(value) ? times.get(value) : undefined
  }

  function onTime (value: unknown, commit: (value: unknown) => void) {
    if (isString(value)) commit(clock(value))
  }

  function onTag () {
    const value = draft.value.trim()

    if (value && !tags.value.includes(value)) tags.value = [...tags.value, value]

    draft.value = ''
  }

  function onRemove (tag: string) {
    tags.value = tags.value.filter(value => value !== tag)
  }

  const open = shallowRef(false)
  const confirm = shallowRef(false)

  const timer = useTimer(() => router.push('/md1/orders'), { duration: 1400 })

  async function onSave (submit: () => Promise<boolean>) {
    missing.value = customer.value ? undefined : 'Error: choose a customer'

    const valid = await submit()

    if (!valid || missing.value) return

    open.value = true
    timer.start()
  }

  function onDiscard () {
    if (dirty.value) confirm.value = true
    else router.push('/md1/orders')
  }
</script>

<template>
  <section class="md1-demo-order">
    <div class="md1-demo-order__sheet md1-elevation-2">
      <h2 class="md1-demo-order__heading">Order details</h2>

      <Form v-slot="{ submit }" class="md1-demo-order__form">
        <div class="md1-demo-order__grid">
          <Md1Autocomplete
            v-model="customer"
            class="md1-demo-order__span"
            :error-messages="missing"
            helper="Start typing a name"
            label="Customer"
            required
          >
            <Md1Autocomplete.Item v-for="name in names" :key="name" :value="name" />
          </Md1Autocomplete>

          <div class="md1-demo-order__line">
            <Md1DropdownButton v-model="category" aria-label="Category" dense>
              <Md1DropdownButton.Item v-for="(label, value) in categories" :key="value" :value>{{ label }}</Md1DropdownButton.Item>
            </Md1DropdownButton>

            <Md1TextField
              v-model="quantity"
              error-icon
              helper="Whole units, minimum 1"
              inputmode="numeric"
              label="Quantity"
              required
              :rules="[least]"
            />
          </div>

          <div class="md1-demo-order__priority">
            <span aria-hidden="true" class="md1-demo-order__caption">Priority</span>

            <Md1Slider
              v-model="priority"
              discrete
              label="Priority"
              :max="5"
              :min="1"
              :step="1"
            />
          </div>

          <Md1TextField
            v-slot="{ value, commit }"
            v-model="date"
            error-icon
            label="Delivery date"
            picker="date"
            required
            :rules="[filled]"
          >
            <Md1DatePicker :model-value="parse(value)" @update:model-value="onDate($event, commit)" />
          </Md1TextField>

          <Md1TextField
            v-slot="{ value, commit }"
            v-model="time"
            label="Delivery time"
            optional
            picker="time"
          >
            <Md1TimePicker :model-value="when(value)" @update:model-value="onTime($event, commit)" />
          </Md1TextField>

          <div class="md1-demo-order__span md1-demo-order__tags">
            <Md1TextField
              v-model="draft"
              dense
              helper="Press Enter to add"
              label="Tags"
              optional
              @keydown.enter.prevent="onTag"
            />

            <div v-if="tags.length > 0" class="md1-demo-order__chips">
              <Md1Chip
                v-for="tag in tags"
                :key="tag"
                deletable
                @delete="onRemove(tag)"
              >
                {{ tag }}
              </Md1Chip>
            </div>
          </div>

          <div class="md1-demo-order__gift">
            <Md1Switch v-model="gift" label="Gift wrap" />
          </div>

          <Md1TextField
            v-model="notes"
            class="md1-demo-order__span"
            :counter="200"
            helper="Anything the courier should know"
            label="Notes"
            multiline
            optional
          />
        </div>

        <p class="md1-demo-order__legend">* Required fields</p>

        <div class="md1-demo-order__actions">
          <Md1Button variant="raised" @click="onSave(submit)">Save</Md1Button>

          <Md1Button @click="onDiscard">Discard</Md1Button>
        </div>
      </Form>
    </div>

    <Md1Dialog v-model="confirm">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Discard this order?</Md1Dialog.Title>

        <Md1Dialog.Text>Everything entered so far will be lost.</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Keep editing</Md1Dialog.Cancel>

          <Md1Dialog.Confirm @confirm="router.push('/md1/orders')">Discard</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal>
      <Md1Snackbar v-model="open" :timeout="4000">Order saved</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-order {
    max-width: 840px;
    margin-inline: auto;
  }

  .md1-demo-order__sheet {
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-order__heading {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-demo-order__form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* Two field columns from the 600 breakpoint, one below it. */
  .md1-demo-order__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    align-items: start;
  }

  @media (min-width: 600px) {
    .md1-demo-order__grid {
      grid-template-columns: 1fr 1fr;
    }

    .md1-demo-order__span {
      grid-column: span 2;
    }
  }

  /* The product line: the category dropdown beside the quantity field, aligned on their baselines. */
  .md1-demo-order__line {
    display: flex;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-demo-order__line > .md1-dropdown-button {
    margin-top: var(--md1-spacing-3, 24px);
  }

  .md1-demo-order__line > .md1-text-field {
    flex: 1 1 auto;
    min-width: 0;
  }

  /* The caption names the slider visually; the gap below it is room for the value pin, which rises 40 dp over the centreline. */
  .md1-demo-order__priority {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-4, 32px);
  }

  .md1-demo-order__caption {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-order__tags {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-demo-order__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-1, 8px);
  }

  /* The switch sits level with the fields around it. */
  .md1-demo-order__gift {
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  .md1-demo-order__legend {
    margin: 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Forms place the affirmative button at the start, under the fields it submits. */
  .md1-demo-order__actions {
    display: flex;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
