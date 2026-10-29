<script lang="ts">
  // Framework
  import { Md1Chip, Md1Dialog, Md1Fab, Md1List, Md1Radio, Md1Snackbar, Md1Subheader, Md1TextField, Md1ToggleButtons, Md1Tooltip } from '@paper/md1'

  // Context
  import { contacts } from './Md1Data'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'

  // Types
  import type { Contact } from './Md1Data'

  const labels = ['Work', 'Family', 'Friends']
  const filters = ['All', ...labels]

  const palette = ['#3F51B5', '#009688', '#E91E63', '#FF5722', '#607D8B', '#9C27B0', '#795548', '#FF9800']

  /** Initials avatar as an inline SVG data URI: the demo ships no raster images. */
  function photo (contact: Contact): string {
    const fill = palette[contact.name.codePointAt(0)! % palette.length]
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${fill}"/><text x="20" y="26" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="18" text-anchor="middle">${contact.name.charAt(0)}</text></svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function filled (value: unknown) {
    return String(value).trim().length > 0 || 'Error: enter a name'
  }

  function valid (value: unknown) {
    return EMAIL.test(String(value)) || 'Error: enter an address like name@example.com'
  }

  /** Whether the add-contact draft can be saved; undefined keeps the dialog's Save disabled. */
  function ready (name: string, email: string) {
    return (name.trim().length > 0 && EMAIL.test(email)) || undefined
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Contacts' })

  const filter = shallowRef('All')
  const saved = shallowRef(false)

  /** Visible contacts sorted and bucketed under their alphabetical subheaders. */
  const groups = computed(() => {
    const visible = contacts.all.value
      .filter(contact => filter.value === 'All' || contact.label === filter.value)
      .toSorted((a, b) => a.name.localeCompare(b.name))

    const map = new Map<string, Contact[]>()

    for (const contact of visible) {
      const letter = contact.name.charAt(0).toUpperCase()

      map.set(letter, [...map.get(letter) ?? [], contact])
    }

    return [...map]
  })

  // The add-contact draft
  const adding = shallowRef(false)
  const draft = shallowRef<unknown>()
  const name = shallowRef('')
  const email = shallowRef('')
  const label = shallowRef('Work')

  /*
   * Every opening starts from a blank draft, committed model included: the
   * dialog reopens on its committed value, so a saved draft would otherwise
   * arrive with Save already enabled.
   */
  watch(adding, value => {
    if (!value) return

    draft.value = undefined
    name.value = ''
    email.value = ''
    label.value = 'Work'
  })

  function onSave () {
    contacts.add({ name: name.value.trim(), email: email.value.trim(), label: label.value })

    // The new row must be visible in its alphabetical slot, whatever the filter.
    if (filter.value !== 'All' && filter.value !== label.value) filter.value = 'All'

    saved.value = true
  }

  // The read-only detail dialog
  const detail = shallowRef(false)
  const current = shallowRef<Contact>()

  function onView (contact: Contact) {
    current.value = contact
    detail.value = true
  }
</script>

<template>
  <section class="md1-demo-contacts">
    <div class="md1-demo-contacts-filter">
      <Md1ToggleButtons v-model="filter" label="Filter by label" mandatory>
        <Md1ToggleButtons.Item v-for="item in filters" :key="item" :value="item">{{ item }}</Md1ToggleButtons.Item>
      </Md1ToggleButtons>
    </div>

    <div class="md1-demo-contacts-sheet md1-elevation-2">
      <template v-for="[letter, members] in groups" :key="letter">
        <Md1Subheader inset :sticky="false">{{ letter }}</Md1Subheader>

        <Md1List :lines="2">
          <Md1List.Item
            v-for="contact in members"
            :key="contact.id"
            aria-haspopup="dialog"
            @click="onView(contact)"
          >
            <Md1List.Avatar :src="photo(contact)" />

            <Md1List.Content>
              <Md1List.Primary>{{ contact.name }}</Md1List.Primary>

              <Md1List.Secondary>{{ contact.email }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Chip>{{ contact.label }}</Md1Chip>
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </template>
    </div>

    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Fab
          v-bind="attrs"
          aria-label="Add contact"
          class="md1-demo-contacts-fab"
          icon="add"
          @click="adding = true"
        />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Add contact</Md1Tooltip.Content>
    </Md1Tooltip>

    <Md1Dialog v-slot="{ commit }" v-model="adding" v-model:value="draft" variant="confirmation">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Add contact</Md1Dialog.Title>

        <div class="md1-demo-contacts-form">
          <Md1TextField
            v-model="name"
            label="Name"
            required
            :rules="[filled]"
            @update:model-value="value => commit(ready(value, email))"
          />

          <Md1TextField
            v-model="email"
            inputmode="email"
            label="Email"
            required
            :rules="[valid]"
            type="email"
            @update:model-value="value => commit(ready(name, value))"
          />
        </div>

        <Md1Radio.Group v-model="label" aria-label="Label" class="md1-demo-contacts-choice">
          <Md1Radio v-for="item in labels" :key="item" :label="item" :value="item" />
        </Md1Radio.Group>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm @confirm="onSave">Save</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Dialog v-model="detail" variant="simple">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Contact</Md1Dialog.Title>

        <div v-if="current" class="md1-demo-contacts-detail">
          <Md1Chip :avatar="photo(current)" contact>
            {{ current.name }}

            <Md1Chip.Addresses>
              <Md1Chip.Address active>{{ current.email }}</Md1Chip.Address>

              <Md1Chip.Address>{{ current.label }}</Md1Chip.Address>
            </Md1Chip.Addresses>
          </Md1Chip>

          <p class="md1-demo-contacts-hint">Press the contact to show addresses</p>
        </div>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Close</Md1Dialog.Cancel>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="saved">Contact saved</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-contacts {
    max-width: 840px;
    margin-inline: auto;
    /* Room under the list for the 56 dp FAB and its margins, so no row hides behind it. */
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }

  .md1-demo-contacts-filter {
    margin-bottom: var(--md1-keyline-margin, 16px);
  }

  .md1-demo-contacts-sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The add-contact fields sit on the dialog's 24 dp content keyline. */
  .md1-demo-contacts-form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    width: 400px;
    max-width: 100%;
    padding: 0 var(--md1-spacing-3, 24px);
  }

  /* The dialog's radios sit on the same keyline, under the fields. */
  .md1-demo-contacts-choice {
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) 0;
  }

  /*
   * Room for the contact chip's open addresses sheet: its 72 dp heading, two
   * 40 dp rows, 8 dp below them and the shadow, with the resting chip offset
   * so the sheet's photo opens over it (chip page).
   */
  .md1-demo-contacts-detail {
    box-sizing: border-box;
    inline-size: 320px;
    max-inline-size: 100%;
    min-block-size: 200px;
    padding-block-start: 20px;
    padding-inline: 28px var(--md1-spacing-3, 24px);
  }

  .md1-demo-contacts-hint {
    margin: var(--md1-spacing-2, 16px) 0 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* While the bottom bar shows, the fixed FAB clears its seam and still rises with the snackbar. */
  @media (width < 960px) {
    .md1-fab.md1-demo-contacts-fab {
      inset-block-end: calc(var(--md1-demo-seam, 0px) + var(--md1-keyline-margin, 16px) + var(--md1-snackbar-height, 0px));
    }
  }
</style>
