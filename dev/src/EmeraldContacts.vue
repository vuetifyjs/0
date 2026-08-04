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
  import { shallowRef, toRef } from 'vue'

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

  const contacts: Contact[] = [
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
  ]

  const labels: Label[] = ['Lead', 'Partner', 'Customer', 'Vip', 'Freelancer', 'Supplier']

  function labelCount (label: Label) {
    return contacts.filter(c => c.labels.includes(label)).length
  }

  const folders = [
    { id: 'all', label: 'All Contacts', count: contacts.length },
    { id: 'favourites', label: 'Favourites', count: contacts.filter(c => c.favourite).length },
    { id: 'spam', label: 'Spam', count: contacts.filter(c => c.spam).length },
    { id: 'blocked', label: 'Blocked', count: contacts.filter(c => c.blocked).length },
  ] as const

  const folderNav = createSingle({ mandatory: 'force' })
  for (const folder of folders) folderNav.register({ id: folder.id, value: folder })
  folderNav.select('all')

  const labelFilter = createSelection({ multiple: true })
  for (const label of labels) labelFilter.register({ id: label, value: label })

  const search = shallowRef('')
  const filter = createFilter<Contact>({ keys: ['name', 'email'], mode: 'some' })

  const scoped = toRef(() => {
    let list = contacts
    if (folderNav.selected('favourites')) list = list.filter(c => c.favourite)
    else if (folderNav.selected('spam')) list = list.filter(c => c.spam)
    else if (folderNav.selected('blocked')) list = list.filter(c => c.blocked)

    if (labelFilter.selectedIds.size > 0) {
      list = list.filter(c => c.labels.some(l => labelFilter.selected(l)))
    }
    return list
  })

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
              <em>{{ folder.count }}</em>
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
                <EmTag v-for="label in contact.labels" :key="label" variant="info">{{ label }}</EmTag>
              </span>
            </li>
          </ul>
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
    align-items: start;
  }

  .adm-contact__side {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
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

  .adm-contact__group + .adm-contact__group {
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-contact__group-letter {
    margin: 0 0 var(--emerald-spacing-xs, 8px);
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
    padding: var(--emerald-spacing-s, 12px) 4px;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
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
    }
  }

  @media (max-width: 560px) {
    .adm-contact__card-tags {
      display: none;
    }
  }
</style>
