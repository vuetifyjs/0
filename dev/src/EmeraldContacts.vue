<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSelection, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  type Label = 'Lead' | 'Partner' | 'Customer' | 'Vip' | 'Freelancer' | 'Supplier'

  interface Contact {
    [key: string]: unknown
    id: string
    name: string
    email: string
    initials: string
    labels: Label[]
    favourite: boolean
    spam: boolean
    blocked: boolean
  }

  const contacts = ref<Contact[]>([
    { id: 'p1', name: 'Alice Johnson', email: 'alice.johnson@example.com', initials: 'AJ', labels: ['Customer'], favourite: true, spam: false, blocked: false },
    { id: 'p2', name: 'Aron Thompson', email: 'aron.thompson@example.com', initials: 'AT', labels: ['Lead', 'Vip'], favourite: false, spam: false, blocked: false },
    { id: 'p3', name: 'Benjamin White', email: 'benjamin.white@example.com', initials: 'BW', labels: ['Partner', 'Customer'], favourite: true, spam: false, blocked: false },
    { id: 'p4', name: 'Charlotte Lee', email: 'charlotte.lee@example.com', initials: 'CL', labels: ['Freelancer', 'Supplier'], favourite: false, spam: false, blocked: false },
    { id: 'p5', name: 'Emma Wilson', email: 'emma.wilson@example.com', initials: 'EW', labels: ['Supplier'], favourite: false, spam: false, blocked: false },
    { id: 'p6', name: 'Ethan Moore', email: 'ethan.moore@example.com', initials: 'EM', labels: ['Vip'], favourite: true, spam: false, blocked: false },
    { id: 'p7', name: 'Grace Kim', email: 'grace.kim@example.com', initials: 'GK', labels: ['Lead'], favourite: false, spam: false, blocked: false },
    { id: 'p8', name: 'Henry Davis', email: 'henry.davis@example.com', initials: 'HD', labels: ['Customer', 'Vip'], favourite: false, spam: false, blocked: false },
    { id: 'p9', name: 'Isla Brooks', email: 'isla.brooks@example.com', initials: 'IB', labels: ['Partner'], favourite: false, spam: true, blocked: false },
    { id: 'p10', name: 'Jacob Wright', email: 'jacob.wright@example.com', initials: 'JW', labels: ['Freelancer'], favourite: false, spam: false, blocked: true },
  ])

  const labels: Label[] = ['Lead', 'Partner', 'Customer', 'Vip', 'Freelancer', 'Supplier']

  function labelCount (label: Label) {
    return contacts.value.filter(contact => contact.labels.includes(label)).length
  }

  const folders = [
    { id: 'all', label: 'All Contacts' },
    { id: 'favourites', label: 'Favourites' },
    { id: 'spam', label: 'Spam' },
    { id: 'blocked', label: 'Blocked' },
  ] as const

  type FolderId = typeof folders[number]['id']

  function inFolder (contact: Contact, id: FolderId) {
    if (id === 'favourites') return contact.favourite
    if (id === 'spam') return contact.spam
    if (id === 'blocked') return contact.blocked
    return true
  }

  function count (id: FolderId) {
    return contacts.value.filter(contact => inFolder(contact, id)).length
  }

  const folderNav = createSingle({ mandatory: 'force' })
  for (const folder of folders) folderNav.register({ id: folder.id, value: folder })
  folderNav.select('all')

  const labelFilter = createSelection({ multiple: true })
  for (const label of labels) labelFilter.register({ id: label, value: label })

  const search = shallowRef('')
  const filter = createFilter<Contact>({ keys: ['name', 'email'], mode: 'some' })

  const scoped = toRef(() => contacts.value.filter(contact => {
    const folder = folders.find(entry => folderNav.selected(entry.id))
    if (folder && !inFolder(contact, folder.id)) return false
    if (labelFilter.selectedIds.size === 0) return true
    return contact.labels.some(label => labelFilter.selected(label))
  }))

  const filtered = toRef(() => filter.apply(search.value, scoped.value).items.value)

  const grouped = toRef(() => {
    const groups = new Map<string, Contact[]>()
    for (const contact of filtered.value) {
      const letter = contact.name[0]?.toUpperCase() ?? '#'
      if (!groups.has(letter)) groups.set(letter, [])
      groups.get(letter)!.push(contact)
    }
    return [...groups.entries()].toSorted(([a], [b]) => a.localeCompare(b))
  })

  function onFavourite (contact: Contact) {
    contact.favourite = !contact.favourite
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-contact" data-theme="emerald">
      <aside aria-label="Contact folders" class="adm-contact__side">
        <h1 class="adm-contact__title">Contacts</h1>

        <EmButton class="adm-contact__new" variant="primary">
          <svg
            aria-hidden="true"
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
          ><path d="M12 5v14M5 12h14" /></svg>
          New Contact
        </EmButton>

        <ul class="adm-contact__list">
          <li v-for="folder in folders" :key="folder.id">
            <button
              class="adm-contact__folder"
              :data-active="folderNav.selected(folder.id) || undefined"
              type="button"
              @click="folderNav.select(folder.id)"
            >
              <span>{{ folder.label }}</span>
              <em>{{ count(folder.id) }}</em>
            </button>
          </li>
        </ul>

        <p class="adm-contact__nav-label">Labels</p>

        <ul class="adm-contact__list adm-contact__list--labels">
          <li v-for="label in labels" :key="label">
            <button
              class="adm-contact__label"
              :data-active="labelFilter.selected(label) || undefined"
              type="button"
              @click="labelFilter.toggle(label)"
            >
              <span aria-hidden="true" class="adm-contact__dot" :data-tone="label" />
              <span class="adm-contact__label-name">{{ label }}</span>
              <em>{{ labelCount(label) }}</em>
            </button>
          </li>
        </ul>
      </aside>

      <section aria-label="Contact directory" class="adm-contact__main">
        <div class="adm-contact__toolbar">
          <EmTextField v-model="search" aria-label="Search Contact" class="adm-contact__search" placeholder="Search Contact" />
        </div>

        <div class="adm-contact__directory">
          <div v-if="filtered.length === 0" class="adm-contact__empty">No contacts match your search.</div>

          <div v-for="[letter, group] in grouped" :key="letter" class="adm-contact__group">
            <h2 class="adm-contact__group-letter">{{ letter }}</h2>

            <ul class="adm-contact__cards">
              <li v-for="contact in group" :key="contact.id" class="adm-contact__card">
                <EmAvatar size="md"><EmAvatarFallback>{{ contact.initials }}</EmAvatarFallback></EmAvatar>

                <span class="adm-contact__card-body">
                  <strong>{{ contact.name }}</strong>
                  <span class="adm-contact__card-email">{{ contact.email }}</span>
                </span>

                <span class="adm-contact__card-tags">
                  <EmTag v-for="label in contact.labels" :key="label" variant="neutral">
                    <span aria-hidden="true" class="adm-contact__dot" :data-tone="label" />
                    {{ label }}
                  </EmTag>
                </span>

                <button
                  :aria-label="`${contact.favourite ? 'Remove' : 'Add'} ${contact.name} ${contact.favourite ? 'from' : 'to'} favourites`"
                  :aria-pressed="contact.favourite"
                  class="adm-contact__star"
                  :data-active="contact.favourite || undefined"
                  type="button"
                  @click="onFavourite(contact)"
                >
                  <svg
                    aria-hidden="true"
                    :fill="contact.favourite ? 'currentColor' : 'none'"
                    height="16"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    width="16"
                  ><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9L12 3Z" /></svg>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-contact {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  .adm-contact__side {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    max-height: 100%;
    overflow-y: auto;
    padding: var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-contact__title {
    margin: 0 0 4px;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
  }

  .adm-contact__new {
    width: 100%;
    justify-content: center;
    margin-bottom: var(--emerald-spacing-s, 12px);
  }

  .adm-contact__nav-label {
    margin: var(--emerald-spacing-s, 12px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .adm-contact__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-contact__folder,
  .adm-contact__label {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    font: inherit;
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: left;
    cursor: pointer;
  }

  .adm-contact__folder span,
  .adm-contact__label-name {
    flex: 1;
  }

  .adm-contact__folder:hover,
  .adm-contact__label:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-contact__folder[data-active],
  .adm-contact__label[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
  }

  .adm-contact__folder em,
  .adm-contact__label em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-contact__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--emerald-secondary-600, #00b4dc);
  }

  .adm-contact__dot[data-tone='Partner'] { background: var(--emerald-primary-700, #027d4c); }
  .adm-contact__dot[data-tone='Customer'] { background: var(--emerald-primary-500, #26c26d); }
  .adm-contact__dot[data-tone='Vip'] { background: var(--emerald-warning-500, #e08b00); }
  .adm-contact__dot[data-tone='Freelancer'] { background: var(--emerald-danger-500, #c61424); }
  .adm-contact__dot[data-tone='Supplier'] { background: var(--emerald-neutral-600, #8f979d); }

  .adm-contact__main {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    height: 100%;
    min-height: 0;
    padding: var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-contact__toolbar {
    display: flex;
  }

  .adm-contact__search {
    width: 100%;
    max-width: 360px;
  }

  .adm-contact__empty {
    padding: var(--emerald-spacing-l, 20px) 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: center;
  }

  .adm-contact__directory {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .adm-contact__group + .adm-contact__group {
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-contact__group-letter {
    position: sticky;
    top: 0;
    z-index: 1;
    margin: 0 0 var(--emerald-spacing-xs, 8px);
    padding: 2px 0;
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    text-transform: uppercase;
  }

  .adm-contact__cards {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-contact__card {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-contact__card:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-contact__star {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-neutral-500, #a3afbe);
    cursor: pointer;
  }

  .adm-contact__star:hover {
    background: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-contact__star[data-active] {
    color: var(--emerald-warning-500, #e08b00);
  }

  .adm-contact__star:focus-visible,
  .adm-contact__folder:focus-visible,
  .adm-contact__label:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }

  .adm-contact__card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .adm-contact__card-body strong {
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-contact__card-email {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-contact__card-tags {
    display: flex;
    flex: none;
    gap: 6px;
  }

  @media (max-width: 900px) {
    .adm-contact {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
      height: calc(100vh - 120px);
    }
  }

  /* Fold the rail into scrolling chip rows so the directory stays above the
     fold instead of sitting under a full-height sidebar. */
  @media (max-width: 560px) {
    .adm-contact__side {
      gap: var(--emerald-spacing-s, 12px);
      padding: var(--emerald-spacing-s, 12px);
    }

    .adm-contact__title,
    .adm-contact__nav-label {
      display: none;
    }

    .adm-contact__new {
      margin-bottom: 0;
    }

    .adm-contact__list {
      flex-direction: row;
      gap: 4px;
      overflow-x: auto;
      overscroll-behavior-x: contain;
    }

    .adm-contact__folder,
    .adm-contact__label {
      width: auto;
      padding: 6px var(--emerald-spacing-xs, 8px);
      white-space: nowrap;
    }

    .adm-contact__card-tags {
      display: none;
    }
  }
</style>
