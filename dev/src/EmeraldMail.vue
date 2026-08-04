<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmDialog,
    EmDialogClose,
    EmDialogContent,
    EmDialogFooter,
    EmDialogTitle,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemMeta,
    EmListItemSubtitle,
    EmListItemTitle,
    EmTag,
    EmTextarea,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  type FolderId = 'inbox' | 'triaged' | 'sent' | 'drafts' | 'archive' | 'junk'

  interface Folder {
    id: FolderId
    label: string
  }

  const folders: Folder[] = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'triaged', label: 'Triaged' },
    { id: 'sent', label: 'Sent' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'archive', label: 'Archive' },
    { id: 'junk', label: 'Junk' },
  ]

  type Tag = 'Releases' | 'Sponsors' | 'Support' | 'RFC' | 'Community'

  const tags: { id: Tag, count: number }[] = [
    { id: 'Releases', count: 4 },
    { id: 'Sponsors', count: 3 },
    { id: 'Support', count: 6 },
    { id: 'RFC', count: 2 },
    { id: 'Community', count: 5 },
  ]

  interface Message {
    [key: string]: unknown
    id: string
    folder: FolderId
    sender: string
    handle: string
    initials: string
    subject: string
    tag: Tag
    preview: string
    body: string
    time: string
    unread: boolean
  }

  const messages: Message[] = [
    { id: 'm1', folder: 'inbox', sender: 'Marisol Vega', handle: 'marisol@vuetifyjs.com', initials: 'MV', subject: 'v1.2 release train slips one week', tag: 'Releases', preview: 'Two graduation PRs are still open…', body: 'Two graduation PRs are still open, so the v1.2 train moves from the 11th to the 25th.\n\nThat keeps us on the Tuesday cadence and gives the Combobox stable-promotion room to land with its axe sweep green.\n\nI will refresh the milestone board tonight.\n\n— Marisol', time: '08:42', unread: true },
    { id: 'm2', folder: 'inbox', sender: 'Kwame Boateng', handle: 'kwame@vuetifyjs.com', initials: 'KB', subject: 'Emerald tag contrast fails APCA at 12px', tag: 'Support', preview: 'Lc 42 against the tinted surface…', body: 'The neutral tag on a tinted surface measures Lc 42, which is under the Lc 60 floor we set for 12px text.\n\nRaising the border one step and dropping the fill to the 100 ramp clears it without touching the type scale.', time: '10:05', unread: true },
    { id: 'm3', folder: 'inbox', sender: 'Tobias Renner', handle: 'tobias@vuetifyjs.com', initials: 'TR', subject: 'Composable pages need the maturity chip', tag: 'RFC', preview: 'Eleven pages still render the old…', body: 'Eleven composable pages still render the old status line instead of the maturity chip.\n\nI can script the swap, but the preview / stable copy needs a decision first.', time: 'Yesterday', unread: true },
    { id: 'm4', folder: 'inbox', sender: 'Lena Brandt', handle: 'lena@vuetifyjs.com', initials: 'LB', subject: 'Northwind Labs renewal — 12 months', tag: 'Sponsors', preview: 'They want the ecosystem tier again…', body: 'Northwind wants the ecosystem tier again and asked whether the logo slot moves with the docs redesign.\n\nI said the slot survives; confirm if that is wrong.', time: 'Yesterday', unread: false },
    { id: 'm5', folder: 'inbox', sender: 'Hana Sato', handle: 'hana@vuetifyjs.com', initials: 'HS', subject: 'Screen-reader pass on the Combobox listbox', tag: 'Support', preview: 'NVDA announces the count twice…', body: 'NVDA announces the option count twice when the listbox re-filters. VoiceOver only announces it once.\n\nA live-region debounce fixes it — patch attached.', time: 'Tue', unread: false },
    { id: 'm6', folder: 'inbox', sender: 'Diego Fuentes', handle: 'diego@vuetifyjs.com', initials: 'DF', subject: 'Browser suite flaking on the new Chromium', tag: 'Support', preview: 'Four popover specs time out on the…', body: 'Four popover specs time out on the runner but never locally. Anchor positioning resolves a frame later there.\n\nI am pinning the Playwright browser until we can reproduce it.', time: 'Mon', unread: false },
    { id: 'm7', folder: 'inbox', sender: 'Ines Kowalski', handle: 'ines@vuetifyjs.com', initials: 'IK', subject: 'August community call — agenda draft', tag: 'Community', preview: 'Thirty minutes, three demos, one…', body: 'Thirty minutes: three demos and one open Q&A block.\n\nIf the Emerald preview is ready I would rather lead with it than with the roadmap slides.', time: 'Jul 30', unread: false },
    { id: 'g1', folder: 'triaged', sender: 'Yuki Tanabe', handle: 'yuki@vuetifyjs.com', initials: 'YT', subject: 'Playground pins TypeScript to 5.x', tag: 'Support', preview: 'The worker loads no libs when TS…', body: 'The REPL worker loads no lib files when TypeScript floats to latest, so every example reds out. Pinning to the 5.x line restores it.', time: 'Jul 29', unread: false },
    { id: 'g2', folder: 'triaged', sender: 'Omar Haddad', handle: 'omar@vuetifyjs.com', initials: 'OH', subject: 'Nuxt module auto-import collisions', tag: 'RFC', preview: 'Only useId and useHydration overlap…', body: 'Only useId and useHydration overlap with Nuxt built-ins. Prefixing both in the module keeps the bare imports free.', time: 'Jul 27', unread: false },
    { id: 's1', folder: 'sent', sender: 'To: Marisol Vega', handle: 'marisol@vuetifyjs.com', initials: 'MV', subject: 'Re: v1.2 release train slips one week', tag: 'Releases', preview: 'The 22nd works — I will move the…', body: 'The 25th works. I will move the changeset freeze to the Friday before so the version PR is quiet over the weekend.', time: 'Jul 31', unread: false },
    { id: 's2', folder: 'sent', sender: 'To: Sponsor list', handle: 'sponsors@vuetifyjs.com', initials: 'SL', subject: 'Q3 impact note', tag: 'Sponsors', preview: 'Downloads, contributors, and where…', body: 'Downloads, contributor count, and where the funding went this quarter. Two charts, no slides.', time: 'Jul 25', unread: false },
    { id: 'd1', folder: 'drafts', sender: 'Draft', handle: 'not sent', initials: 'DR', subject: 'Re: RFC 0031 — token alias resolution', tag: 'RFC', preview: 'Dot paths should resolve before the…', body: 'Dot paths should resolve before the theme merge, otherwise an alias pointing at an overridden token silently keeps the base value.', time: 'Jul 24', unread: false },
    { id: 'a1', folder: 'archive', sender: 'Priya Nadar', handle: 'priya@vuetifyjs.com', initials: 'PN', subject: 'Registry version signal — decision recorded', tag: 'RFC', preview: 'Documented as a philosophy exception…', body: 'Recorded as a documented exception in section 4.4 rather than a general pattern. Upsert granularity stays a separate thread.', time: 'Jul 18', unread: false },
    { id: 'a2', folder: 'archive', sender: 'Ines Kowalski', handle: 'ines@vuetifyjs.com', initials: 'IK', subject: 'July community call recording', tag: 'Community', preview: 'Ninety-one live, four hundred replays…', body: 'Ninety-one people live and just over four hundred replays in the first week. The composable walkthrough drove most of it.', time: 'Jul 11', unread: false },
    { id: 'j1', folder: 'junk', sender: 'UI Kit Bundle', handle: 'deals@uikit-bundle.example', initials: 'UB', subject: '900 components, today only', tag: 'Support', preview: 'Lifetime access expires at midnight…', body: 'Lifetime access expires at midnight. Act now.', time: 'Aug 2', unread: true },
    { id: 'j2', folder: 'junk', sender: 'Growth Signals', handle: 'no-reply@growth-signals.example', initials: 'GS', subject: 'Triple your npm downloads', tag: 'Support', preview: 'Our audience network guarantees…', body: 'Our audience network guarantees a 300% lift in weekly installs.', time: 'Jul 28', unread: true },
  ]

  function count (id: FolderId) {
    return messages.filter(message => message.folder === id).length
  }

  function unreadCount (id: FolderId) {
    return messages.filter(message => message.folder === id && message.unread).length
  }

  const folderNav = createSingle({ mandatory: 'force' })
  for (const folder of folders) folderNav.register({ id: folder.id, value: folder })
  folderNav.select('inbox')

  const search = shallowRef('')
  const filter = createFilter<Message>({ keys: ['sender', 'subject'], mode: 'some' })

  const folder = toRef(() => folders.find(entry => folderNav.selected(entry.id)))
  const scoped = toRef(() => messages.filter(message => folderNav.selected(message.folder)))
  const filtered = toRef(() => filter.apply(search.value, scoped.value).items.value)

  const active = shallowRef<string | undefined>(messages[0].id)

  /**
   * Rows unregister from EmList when a folder or search filters them out, which
   * clears the selection. Re-point at the first visible row once the DOM has
   * settled — `mandatory: 'force'` can't do this, it selects whichever ticket
   * registers first and Vue mounts keyed children in reverse on a wholesale swap.
   */
  watch(filtered, rows => {
    if (rows.some(row => row.id === active.value)) return
    active.value = rows[0]?.id
  }, { flush: 'post' })

  /** A search can empty the rows entirely; the reading pane keeps the last one open. */
  const open = shallowRef<Message | undefined>(messages[0])

  watch(active, id => {
    const message = messages.find(entry => entry.id === id)
    if (message) open.value = message
  })

  /** Mobile master/detail — desktop shows both panes regardless. */
  const detail = shallowRef(false)

  function onFolder (id: FolderId) {
    folderNav.select(id)
    search.value = ''
    detail.value = false
  }

  const reply = shallowRef('')

  function onReply () {
    reply.value = ''
  }

  const composeOpen = shallowRef(false)
  const composeTo = shallowRef('')
  const composeSubject = shallowRef('')
  const composeBody = shallowRef('')

  function onSend () {
    composeOpen.value = false
    composeTo.value = ''
    composeSubject.value = ''
    composeBody.value = ''
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-mail" :data-detail="detail || undefined">
      <div class="adm-mail__bar">
        <div class="adm-mail__bar-title">
          <h1>{{ folder?.label }}</h1>
          <span class="adm-mail__count">{{ filtered.length }} shown · {{ unreadCount(folder?.id ?? 'inbox') }} unread</span>
        </div>

        <EmTextField v-model="search" aria-label="Search mail" class="adm-mail__search" placeholder="Search sender or subject" />

        <EmButton class="adm-mail__compose" variant="primary" @click="composeOpen = true">
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
          Compose
        </EmButton>
      </div>

      <aside aria-label="Mailboxes" class="adm-mail__folders">
        <ul class="adm-mail__list">
          <li v-for="entry in folders" :key="entry.id">
            <button
              class="adm-mail__folder"
              :data-active="folderNav.selected(entry.id) || undefined"
              type="button"
              @click="onFolder(entry.id)"
            >
              <em v-if="unreadCount(entry.id)" class="adm-mail__folder-badge">{{ unreadCount(entry.id) }}</em>
              <em v-else class="adm-mail__folder-badge adm-mail__folder-badge--quiet">{{ count(entry.id) }}</em>
              <span>{{ entry.label }}</span>
            </button>
          </li>
        </ul>

        <p class="adm-mail__nav-label">Threads by tag</p>

        <div class="adm-mail__tags">
          <EmTag v-for="tag in tags" :key="tag.id" variant="neutral">
            <span aria-hidden="true" class="adm-mail__dot" :data-tone="tag.id" />
            {{ tag.id }}
            <em>{{ tag.count }}</em>
          </EmTag>
        </div>
      </aside>

      <section aria-label="Messages" class="adm-mail__list-pane">
        <EmList v-model="active" mandatory>
          <EmListItem
            v-for="message in filtered"
            :key="message.id"
            class="adm-mail__message"
            :data-unread="message.unread || undefined"
            :value="message.id"
            @click="detail = true"
          >
            <EmListItemMedia>
              <EmAvatar size="sm"><EmAvatarFallback>{{ message.initials }}</EmAvatarFallback></EmAvatar>
            </EmListItemMedia>

            <EmListItemContent>
              <EmListItemTitle>{{ message.subject }}</EmListItemTitle>

              <EmListItemSubtitle class="adm-mail__message-meta">
                <span class="adm-mail__message-sender">{{ message.sender }}</span>
                <span aria-hidden="true" class="adm-mail__dot" :data-tone="message.tag" />
                <span class="adm-mail__message-tag">{{ message.tag }}</span>
              </EmListItemSubtitle>

              <span class="adm-mail__message-preview">{{ message.preview }}</span>
            </EmListItemContent>

            <EmListItemMeta>{{ message.time }}</EmListItemMeta>
          </EmListItem>
        </EmList>

        <p v-if="filtered.length === 0" class="adm-mail__empty">No messages match "{{ search }}"</p>
      </section>

      <section aria-label="Reading pane" class="adm-mail__reading">
        <template v-if="open">
          <EmButton class="adm-mail__back" variant="tertiary" @click="detail = false">
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
            ><path d="M15 18l-6-6 6-6" /></svg>
            Back
          </EmButton>

          <header class="adm-mail__reading-head">
            <div class="adm-mail__reading-from">
              <EmAvatar size="md"><EmAvatarFallback>{{ open.initials }}</EmAvatarFallback></EmAvatar>

              <span class="adm-mail__reading-who">
                <strong>{{ open.sender }}</strong>
                <span class="adm-mail__reading-handle">{{ open.handle }}</span>
              </span>

              <time class="adm-mail__reading-time">{{ open.time }}</time>
            </div>

            <h2>{{ open.subject }}</h2>

            <div class="adm-mail__reading-chips">
              <EmTag variant="neutral">{{ folder?.label }}</EmTag>

              <EmTag variant="neutral">
                <span aria-hidden="true" class="adm-mail__dot" :data-tone="open.tag" />
                {{ open.tag }}
              </EmTag>
            </div>
          </header>

          <p class="adm-mail__reading-body">{{ open.body }}</p>

          <div class="adm-mail__reply">
            <EmTextarea v-model="reply" aria-label="Reply" :placeholder="`Reply to ${open.sender}…`" :rows="2" />

            <div class="adm-mail__reply-foot">
              <span class="adm-mail__reply-hint">Replies stay in {{ folder?.label }}</span>
              <EmButton :disabled="!reply.trim()" variant="primary" @click="onReply">Send reply</EmButton>
            </div>
          </div>
        </template>

        <p v-else class="adm-mail__reading-empty">Select a message to read it here.</p>
      </section>

      <EmDialog v-model="composeOpen">
        <EmDialogContent>
          <div class="adm-mail__dialog-head">
            <EmDialogTitle>New message</EmDialogTitle>
            <EmDialogClose />
          </div>

          <EmTextField v-model="composeTo" aria-label="To" placeholder="To" />
          <EmTextField v-model="composeSubject" aria-label="Subject" placeholder="Subject" />
          <EmTextarea v-model="composeBody" aria-label="Message" placeholder="Write your message…" :rows="6" />

          <EmDialogFooter>
            <EmButton variant="tertiary" @click="composeOpen = false">Discard</EmButton>
            <EmButton variant="primary" @click="onSend">Send</EmButton>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-mail {
    display: grid;
    grid-template-columns: 208px minmax(0, 340px) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  /* The toolbar spans every pane: the folder heading, the one search that scopes
     the list, and Compose all read as a single row of chrome. */
  .adm-mail__bar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-mail__bar-title {
    display: flex;
    flex-direction: column;
    min-width: 148px;
  }

  .adm-mail__bar-title h1 {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .adm-mail__count {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__search {
    flex: 1;
    min-width: 0;
  }

  .adm-mail__compose {
    flex: none;
  }

  .adm-mail__folders,
  .adm-mail__list-pane,
  .adm-mail__reading {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-mail__folders {
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    overflow-y: auto;
  }

  .adm-mail__nav-label {
    margin: var(--emerald-spacing-s, 12px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .adm-mail__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Count leads, label follows — the mirror of the reference rail. */
  .adm-mail__folder {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-xs, 8px);
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    font: inherit;
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: left;
    cursor: pointer;
  }

  .adm-mail__folder:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-mail__folder:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }

  .adm-mail__folder[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
  }

  .adm-mail__folder-badge {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 20px;
    padding: 0 5px;
    border-radius: var(--emerald-radius-s, 6px);
    background: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-on-primary, #fff);
    font-style: normal;
    font-size: 11px;
    font-weight: 700;
  }

  .adm-mail__folder-badge--quiet {
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-weight: 600;
  }

  .adm-mail__folder[data-active] .adm-mail__folder-badge--quiet {
    background: var(--emerald-background, #fefefe);
  }

  /* Tags wrap as chips instead of stacking as a second nav list. */
  .adm-mail__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .adm-mail__tags em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-mail__dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-mail__dot[data-tone='Sponsors'] { background: var(--emerald-secondary-600, #00b4dc); }
  .adm-mail__dot[data-tone='Support'] { background: var(--emerald-danger-500, #c61424); }
  .adm-mail__dot[data-tone='RFC'] { background: var(--emerald-info-500, #3a70e2); }
  .adm-mail__dot[data-tone='Community'] { background: var(--emerald-alert-600, #d9af00); }

  .adm-mail__list-pane {
    padding: var(--emerald-spacing-xs, 8px);
  }

  .adm-mail__list-pane .emerald-list {
    flex: 1;
    min-height: 0;
    gap: 2px;
    overflow-y: auto;
  }

  /* Three-line rows top-align their avatar against the subject. */
  .adm-mail__message {
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-xs, 8px);
  }

  /* Unread reads as a leading rail rather than a trailing dot. */
  .adm-mail__message::before {
    content: '';
    flex: none;
    align-self: stretch;
    width: 3px;
    border-radius: 999px;
    background: transparent;
  }

  .adm-mail__message[data-unread]::before {
    background: var(--emerald-primary-600, #1fae60);
  }

  /* Subject leads the row; the sender drops to the meta line under it. */
  .adm-mail__message .emerald-list__content {
    gap: 3px;
  }

  .adm-mail__message .emerald-list__meta {
    align-self: flex-start;
  }

  .adm-mail__message-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .adm-mail__message-sender {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-mail__message-tag {
    flex: none;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 10px;
    font-weight: 600;
  }

  .adm-mail__message-preview {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-mail__empty {
    padding: var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: center;
  }

  .adm-mail__reading {
    padding: var(--emerald-spacing-l, 20px);
    gap: var(--emerald-spacing-m, 16px);
    overflow-y: auto;
  }

  .adm-mail__reading > .adm-mail__back {
    display: none;
    align-self: flex-start;
  }

  /* Sender identity leads, subject sits under it — the reference stacks the
     subject first with the avatar pushed to the far edge. */
  .adm-mail__reading-head {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    padding-bottom: var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-mail__reading-from {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-mail__reading-who {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-mail__reading-handle,
  .adm-mail__reading-time {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__reading-head h2 {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    letter-spacing: -0.01em;
  }

  .adm-mail__reading-chips {
    display: flex;
    gap: 6px;
  }

  .adm-mail__reading-body {
    margin: 0;
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: 1.65;
    white-space: pre-line;
  }

  /* Composer is one bordered block with its own footer, not a loose field
     with a right-aligned button. */
  .adm-mail__reply {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    margin-top: auto;
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-l, 10px);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-mail__reply-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-mail__reply-hint {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__reading-empty {
    margin: auto;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-mail__dialog-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Below the three-pane breakpoint the reading pane becomes a detail view the
     message list pushes onto, so a tap always leads somewhere. */
  @media (max-width: 1100px) {
    .adm-mail {
      grid-template-columns: 180px minmax(0, 1fr);
      height: auto;
    }

    .adm-mail__reading {
      display: none;
    }

    .adm-mail[data-detail] {
      grid-template-columns: minmax(0, 1fr);
    }

    .adm-mail[data-detail] .adm-mail__bar,
    .adm-mail[data-detail] .adm-mail__folders,
    .adm-mail[data-detail] .adm-mail__list-pane {
      display: none;
    }

    .adm-mail[data-detail] .adm-mail__reading {
      display: flex;
      min-height: 60vh;
    }

    .adm-mail[data-detail] .adm-mail__reading > .adm-mail__back {
      display: inline-flex;
    }
  }

  @media (max-width: 720px) {
    .adm-mail {
      grid-template-columns: minmax(0, 1fr);
    }

    .adm-mail__bar {
      flex-wrap: wrap;
      gap: var(--emerald-spacing-xs, 8px);
    }

    .adm-mail__bar-title {
      flex: 1 0 auto;
    }

    .adm-mail__search {
      flex: 1 0 100%;
      order: 3;
    }

    .adm-mail__folders {
      flex-direction: row;
      align-items: center;
      gap: var(--emerald-spacing-xs, 8px);
      overflow-x: auto;
      overscroll-behavior-x: contain;
    }

    .adm-mail__folders .adm-mail__nav-label,
    .adm-mail__tags {
      display: none;
    }

    .adm-mail__list {
      flex-direction: row;
      gap: 4px;
    }

    .adm-mail__folder {
      width: auto;
      gap: 6px;
      white-space: nowrap;
    }
  }
</style>
