<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemMeta,
    EmListItemSubtitle,
    EmListItemTitle,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSelection, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  type Label = 'Core' | 'Docs' | 'Design' | 'Sponsor' | 'Triage' | 'Community'

  type Circle = 'Core team' | 'Maintainers' | 'Sponsors' | 'Community'

  interface Contact {
    [key: string]: unknown
    id: string
    name: string
    handle: string
    role: string
    region: string
    initials: string
    circle: Circle
    labels: Label[]
    favourite: boolean
    active: boolean
    archived: boolean
  }

  const contacts = ref<Contact[]>([
    { id: 'p1', name: 'Marisol Vega', handle: '@marisol', role: 'Release lead', region: 'Lisbon · UTC+1', initials: 'MV', circle: 'Core team', labels: ['Core', 'Triage'], favourite: true, active: true, archived: false },
    { id: 'p2', name: 'Kwame Boateng', handle: '@kwameb', role: 'Design systems', region: 'Accra · UTC', initials: 'KB', circle: 'Core team', labels: ['Core', 'Design'], favourite: true, active: true, archived: false },
    { id: 'p3', name: 'Priya Nadar', handle: '@priyan', role: 'Composables', region: 'Bengaluru · UTC+5:30', initials: 'PN', circle: 'Core team', labels: ['Core'], favourite: false, active: true, archived: false },
    { id: 'p4', name: 'Tobias Renner', handle: '@trenner', role: 'Documentation', region: 'Berlin · UTC+2', initials: 'TR', circle: 'Maintainers', labels: ['Docs'], favourite: false, active: true, archived: false },
    { id: 'p5', name: 'Hana Sato', handle: '@hanas', role: 'Accessibility', region: 'Osaka · UTC+9', initials: 'HS', circle: 'Maintainers', labels: ['Core', 'Docs'], favourite: true, active: true, archived: false },
    { id: 'p6', name: 'Diego Fuentes', handle: '@dfuentes', role: 'Build and CI', region: 'Bogotá · UTC-5', initials: 'DF', circle: 'Maintainers', labels: ['Triage'], favourite: false, active: true, archived: false },
    { id: 'p7', name: 'Omar Haddad', handle: '@ohaddad', role: 'Nuxt module', region: 'Amman · UTC+3', initials: 'OH', circle: 'Maintainers', labels: ['Core'], favourite: false, active: false, archived: false },
    { id: 'p8', name: 'Elin Bergström', handle: '@elinb', role: 'Northwind Labs', region: 'Stockholm · UTC+2', initials: 'EB', circle: 'Sponsors', labels: ['Sponsor'], favourite: true, active: true, archived: false },
    { id: 'p9', name: 'Rafael Costa', handle: '@rcosta', role: 'Meridian Cloud', region: 'São Paulo · UTC-3', initials: 'RC', circle: 'Sponsors', labels: ['Sponsor'], favourite: false, active: false, archived: false },
    { id: 'p10', name: 'Ines Kowalski', handle: '@ineskow', role: 'Community lead', region: 'Kraków · UTC+2', initials: 'IK', circle: 'Community', labels: ['Community', 'Docs'], favourite: false, active: true, archived: false },
    { id: 'p11', name: 'Yuki Tanabe', handle: '@ytanabe', role: 'Playground', region: 'Kyoto · UTC+9', initials: 'YT', circle: 'Community', labels: ['Community'], favourite: false, active: true, archived: false },
    { id: 'p12', name: 'Nadia Rahman', handle: '@nrahman', role: 'Translations', region: 'Dhaka · UTC+6', initials: 'NR', circle: 'Community', labels: ['Community', 'Docs'], favourite: false, active: false, archived: true },
    { id: 'p13', name: 'Soren Vogt', handle: '@svogt', role: 'Former maintainer', region: 'Aarhus · UTC+2', initials: 'SV', circle: 'Maintainers', labels: ['Triage'], favourite: false, active: false, archived: true },
  ])

  const labels: Label[] = ['Core', 'Docs', 'Design', 'Sponsor', 'Triage', 'Community']

  const circles: Circle[] = ['Core team', 'Maintainers', 'Sponsors', 'Community']

  const folders = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'starred', label: 'Starred' },
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived' },
  ] as const

  type FolderId = typeof folders[number]['id']

  function inFolder (contact: Contact, id: FolderId) {
    if (id === 'starred') return contact.favourite
    if (id === 'active') return contact.active
    if (id === 'archived') return contact.archived
    return true
  }

  function count (id: FolderId) {
    return contacts.value.filter(contact => inFolder(contact, id)).length
  }

  function labelCount (label: Label) {
    return contacts.value.filter(contact => contact.labels.includes(label)).length
  }

  const folderNav = createSingle({ mandatory: 'force' })
  for (const folder of folders) folderNav.register({ id: folder.id, value: folder })
  folderNav.select('everyone')

  const labelFilter = createSelection({ multiple: true })
  for (const label of labels) labelFilter.register({ id: label, value: label })

  const search = shallowRef('')
  const filter = createFilter<Contact>({ keys: ['name', 'handle', 'role'], mode: 'some' })

  const scoped = toRef(() => contacts.value.filter(contact => {
    const folder = folders.find(entry => folderNav.selected(entry.id))
    if (folder && !inFolder(contact, folder.id)) return false
    if (labelFilter.selectedIds.size === 0) return true
    return contact.labels.some(label => labelFilter.selected(label))
  }))

  const filtered = toRef(() => filter.apply(search.value, scoped.value).items.value)

  /** Grouped by circle rather than alphabet — the roster reads as an org, not an index. */
  const grouped = toRef(() => circles
    .map(circle => [circle, filtered.value.filter(contact => contact.circle === circle)] as const)
    .filter(([, list]) => list.length > 0))

  const starred = toRef(() => contacts.value.filter(contact => contact.favourite).length)

  function onFavourite (contact: Contact) {
    contact.favourite = !contact.favourite
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-contact">
      <aside aria-label="Directory scopes" class="adm-contact__side">
        <!-- Rail opens on a summary block; the reference opens on a title. -->
        <div class="adm-contact__summary">
          <span class="adm-contact__summary-count">{{ contacts.length }}</span>
          <span class="adm-contact__summary-label">people in the directory</span>
          <span class="adm-contact__summary-meta">{{ starred }} starred · {{ circles.length }} circles</span>
        </div>

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
          Add person
        </EmButton>
      </aside>

      <section aria-label="Contact directory" class="adm-contact__main">
        <div class="adm-contact__toolbar">
          <EmTextField v-model="search" aria-label="Search the directory" class="adm-contact__search" placeholder="Search by name, handle, or role" />
          <span class="adm-contact__result">{{ filtered.length }} of {{ contacts.length }}</span>
        </div>

        <!-- Labels filter from the toolbar, not from the rail. -->
        <div class="adm-contact__labels">
          <EmTag
            v-for="label in labels"
            :key="label"
            interactive
            :selected="labelFilter.selected(label)"
            variant="neutral"
            @click="labelFilter.toggle(label)"
          >
            <span aria-hidden="true" class="adm-contact__dot" :data-tone="label" />
            {{ label }}
            <em>{{ labelCount(label) }}</em>
          </EmTag>

          <EmButton
            v-if="labelFilter.selectedIds.size > 0"
            class="adm-contact__clear"
            variant="tertiary"
            @click="labelFilter.reset()"
          >
            Clear
          </EmButton>
        </div>

        <div class="adm-contact__directory">
          <div v-if="filtered.length === 0" class="adm-contact__empty">No one matches those filters.</div>

          <div v-for="[circle, group] in grouped" :key="circle" class="adm-contact__group">
            <h2 class="adm-contact__group-head">
              {{ circle }}
              <em>{{ group.length }}</em>
            </h2>

            <!-- Rows are not selectable and carry their own star control, so the
                 item host stays a plain element — a button cannot nest one. -->
            <EmList>
              <EmListItem
                v-for="contact in group"
                :key="contact.id"
                as="div"
                class="adm-contact__card"
                :value="contact.id"
              >
                <EmListItemMedia>
                  <EmAvatar size="md"><EmAvatarFallback>{{ contact.initials }}</EmAvatarFallback></EmAvatar>
                </EmListItemMedia>

                <EmListItemContent>
                  <!-- Name and handle share a line; the role replaces the email underneath. -->
                  <EmListItemTitle class="adm-contact__card-name">
                    <strong>{{ contact.name }}</strong>
                    <span class="adm-contact__card-handle">{{ contact.handle }}</span>
                  </EmListItemTitle>

                  <EmListItemSubtitle class="adm-contact__card-role">{{ contact.role }}</EmListItemSubtitle>
                </EmListItemContent>

                <EmListItemMeta class="adm-contact__card-region">{{ contact.region }}</EmListItemMeta>

                <span class="adm-contact__card-tags">
                  <EmTag v-for="label in contact.labels" :key="label" variant="neutral">
                    <span aria-hidden="true" class="adm-contact__dot" :data-tone="label" />
                    {{ label }}
                  </EmTag>
                </span>

                <button
                  :aria-label="`${contact.favourite ? 'Remove' : 'Add'} ${contact.name} ${contact.favourite ? 'from' : 'to'} starred`"
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
              </EmListItem>
            </EmList>
          </div>
        </div>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-contact {
    display: grid;
    grid-template-columns: 208px minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  .adm-contact__side {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    max-height: 100%;
    overflow-y: auto;
    padding: var(--emerald-spacing-s, 12px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-contact__summary {
    display: flex;
    flex-direction: column;
    padding: var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-l, 10px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-contact__summary-count {
    font-size: var(--emerald-text-h3-size, 24px);
    font-weight: 700;
    line-height: 1.1;
  }

  .adm-contact__summary-label {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
  }

  .adm-contact__summary-meta {
    margin-top: 4px;
    font-size: 11px;
    opacity: 0.85;
  }

  .adm-contact__new {
    margin-top: auto;
    width: 100%;
    justify-content: center;
  }

  .adm-contact__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .adm-contact__folder {
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

  .adm-contact__folder span {
    flex: 1;
  }

  .adm-contact__folder:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-contact__folder[data-active] {
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
    box-shadow: inset 3px 0 0 var(--emerald-primary-600, #1fae60);
  }

  .adm-contact__folder em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-contact__dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-contact__dot[data-tone='Docs'] { background: var(--emerald-info-500, #3a70e2); }
  .adm-contact__dot[data-tone='Design'] { background: var(--emerald-secondary-600, #00b4dc); }
  .adm-contact__dot[data-tone='Sponsor'] { background: var(--emerald-alert-600, #d9af00); }
  .adm-contact__dot[data-tone='Triage'] { background: var(--emerald-danger-500, #c61424); }
  .adm-contact__dot[data-tone='Community'] { background: var(--emerald-neutral-600, #939dac); }

  .adm-contact__main {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
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
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-contact__search {
    flex: 1;
    min-width: 0;
  }

  .adm-contact__result {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-contact__labels {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    padding-bottom: var(--emerald-spacing-s, 12px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-contact__labels em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-contact__clear {
    padding: 0 var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b3-size, 12px);
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
    margin-top: var(--emerald-spacing-m, 16px);
  }

  .adm-contact__group-head {
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0 0 var(--emerald-spacing-xs, 8px);
    padding: 4px 0;
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .adm-contact__group-head em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-weight: 600;
    letter-spacing: 0;
  }

  .adm-contact__directory .emerald-list {
    gap: 4px;
  }

  /* Rows are carded and spaced rather than ruled into a continuous table. */
  .adm-contact__card {
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
    border-radius: var(--emerald-radius-l, 10px);
  }

  .adm-contact__card:hover {
    border-color: var(--emerald-neutral-300, #ccd6e7);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-contact__card .emerald-list__content {
    gap: 0;
  }

  .adm-contact__card-name {
    display: flex;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
    overflow: visible;
  }

  .adm-contact__card-name strong {
    overflow: hidden;
    font-size: var(--emerald-text-b2-size, 14px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-contact__card-handle {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-family: ui-monospace, SFMono-Regular, monospace;
    font-size: 11px;
  }

  .adm-contact__card-role {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-contact__card-region {
    flex: none;
    width: 168px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-contact__card-tags {
    display: flex;
    flex: none;
    gap: 6px;
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
    color: var(--emerald-alert-600, #d9af00);
  }

  .adm-contact__star:focus-visible,
  .adm-contact__folder:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }

  @media (max-width: 1080px) {
    .adm-contact__card-region {
      display: none;
    }
  }

  @media (max-width: 900px) {
    .adm-contact {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
      height: calc(100vh - 120px);
    }

    .adm-contact__new {
      margin-top: 0;
    }
  }

  /* Fold the rail into a scrolling chip row so the directory stays above the
     fold instead of sitting under a full-height sidebar. */
  @media (max-width: 560px) {
    .adm-contact__side {
      flex-direction: row;
      align-items: center;
      gap: var(--emerald-spacing-xs, 8px);
      padding: var(--emerald-spacing-xs, 8px);
    }

    .adm-contact__summary,
    .adm-contact__card-tags {
      display: none;
    }

    .adm-contact__list {
      flex: 1;
      flex-direction: row;
      gap: 4px;
      overflow-x: auto;
      overscroll-behavior-x: contain;
    }

    .adm-contact__folder {
      width: auto;
      padding: 6px var(--emerald-spacing-xs, 8px);
      white-space: nowrap;
    }

    .adm-contact__new {
      flex: none;
      width: auto;
    }

    .adm-contact__toolbar {
      flex-wrap: wrap;
    }
  }
</style>
