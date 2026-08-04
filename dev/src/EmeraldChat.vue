<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmTag,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  interface ChatMessage {
    id: string
    from: 'me' | 'them'
    author: string
    initials: string
    text: string
    time: string
  }

  interface Conversation {
    [key: string]: unknown
    id: string
    name: string
    topic: string
    initials: string
    preview: string
    time: string
    unread: number
    online: boolean
    kind: 'channel' | 'direct'
    messages: ChatMessage[]
  }

  const conversations: Conversation[] = [
    {
      id: 'c1', name: '#emerald-ds', topic: '9 members · design system build', initials: 'ED', preview: 'Dark surfaces still swallow the elevation shadow', time: '11:24', unread: 3, online: true, kind: 'channel',
      messages: [
        { id: 'm1', from: 'them', author: 'Kwame Boateng', initials: 'KB', text: 'Dark surfaces still swallow the elevation shadow — the card reads flat at 800.', time: '11:02' },
        { id: 'm2', from: 'me', author: 'You', initials: 'ME', text: 'Because the shadow is pure black at 8%. On a near-black surface that is invisible.', time: '11:09' },
        { id: 'm3', from: 'them', author: 'Kwame Boateng', initials: 'KB', text: 'So we swap to a lightened rim in dark instead of a drop shadow?', time: '11:15' },
        { id: 'm4', from: 'me', author: 'You', initials: 'ME', text: 'A 1px rim plus a longer, softer shadow. Onyx already proved it works.', time: '11:20' },
        { id: 'm5', from: 'them', author: 'Priya Nadar', initials: 'PN', text: 'I will fold that into the elevation tokens tonight.', time: '11:24' },
      ],
    },
    {
      id: 'c2', name: 'Marisol Vega', topic: 'Release manager', initials: 'MV', preview: 'Freeze is Friday, so the 25th is safe', time: '10:48', unread: 2, online: true, kind: 'direct',
      messages: [
        { id: 'm1', from: 'them', author: 'Marisol Vega', initials: 'MV', text: 'Are we still promoting Combobox in this train?', time: '10:31' },
        { id: 'm2', from: 'me', author: 'You', initials: 'ME', text: 'Yes, the axe sweep came back clean this morning.', time: '10:40' },
        { id: 'm3', from: 'them', author: 'Marisol Vega', initials: 'MV', text: 'Freeze is Friday, so the 25th is safe.', time: '10:48' },
      ],
    },
    {
      id: 'c3', name: '#docs', topic: '14 members · authoring and examples', initials: 'DX', preview: 'Every composable page needs the maturity chip', time: '09:57', unread: 0, online: true, kind: 'channel',
      messages: [
        { id: 'm1', from: 'them', author: 'Tobias Renner', initials: 'TR', text: 'Every composable page still needs the maturity chip. Eleven left.', time: '09:41' },
        { id: 'm2', from: 'me', author: 'You', initials: 'ME', text: 'Script it — the copy is settled, preview and stable only.', time: '09:57' },
      ],
    },
    {
      id: 'c4', name: '#release-train', topic: '22 members · ships every fourth Tuesday', initials: 'RT', preview: 'Changeset reminder fired on four PRs', time: '09:12', unread: 1, online: false, kind: 'channel',
      messages: [
        { id: 'm1', from: 'them', author: 'Diego Fuentes', initials: 'DF', text: 'Changeset reminder fired on four PRs overnight. Two are docs-only, so they can stay bare.', time: '09:12' },
      ],
    },
    {
      id: 'c5', name: 'Hana Sato', topic: 'Accessibility', initials: 'HS', preview: 'The live region announces twice on refilter', time: 'Yesterday', unread: 1, online: false, kind: 'direct',
      messages: [
        { id: 'm1', from: 'them', author: 'Hana Sato', initials: 'HS', text: 'The live region announces the option count twice when the listbox refilters.', time: 'Yesterday' },
        { id: 'm2', from: 'me', author: 'You', initials: 'ME', text: 'Debounce it to one frame and it should settle.', time: 'Yesterday' },
      ],
    },
    {
      id: 'c6', name: 'Ines Kowalski', topic: 'Community', initials: 'IK', preview: 'Ninety-one live on the July call', time: 'Yesterday', unread: 0, online: true, kind: 'direct',
      messages: [
        { id: 'm1', from: 'them', author: 'Ines Kowalski', initials: 'IK', text: 'Ninety-one people live on the July call, four hundred replays since.', time: 'Yesterday' },
        { id: 'm2', from: 'me', author: 'You', initials: 'ME', text: 'Lead August with the Emerald preview then, not the roadmap.', time: 'Yesterday' },
      ],
    },
    {
      id: 'c7', name: '#triage', topic: '6 members · inbound issues', initials: 'TG', preview: 'Popover specs flake only on the runner', time: 'Mon', unread: 0, online: false, kind: 'channel',
      messages: [
        { id: 'm1', from: 'them', author: 'Diego Fuentes', initials: 'DF', text: 'Popover specs flake only on the runner. Anchor positioning resolves a frame later there.', time: 'Mon' },
      ],
    },
  ]

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'channels', label: 'Channels' },
    { id: 'direct', label: 'Direct' },
  ] as const

  const filterNav = createSingle({ mandatory: 'force' })
  for (const entry of filters) filterNav.register({ id: entry.id, value: entry })
  filterNav.select('all')

  const search = shallowRef('')
  const filter = createFilter<Conversation>({ keys: ['name'], mode: 'some' })

  function scope (id: string) {
    if (id === 'unread') return conversations.filter(conversation => conversation.unread > 0)
    if (id === 'channels') return conversations.filter(conversation => conversation.kind === 'channel')
    if (id === 'direct') return conversations.filter(conversation => conversation.kind === 'direct')
    return conversations
  }

  const scoped = toRef(() => scope(filters.find(entry => filterNav.selected(entry.id))?.id ?? 'all'))

  const filtered = toRef(() => filter.apply(search.value, scoped.value).items.value)

  /** Split by kind — channels lead, direct messages follow. */
  const groups = toRef(() => ([
    ['Channels', filtered.value.filter(conversation => conversation.kind === 'channel')],
    ['Direct', filtered.value.filter(conversation => conversation.kind === 'direct')],
  ] as const).filter(([, list]) => list.length > 0))

  const unreadTotal = toRef(() => conversations.reduce((total, conversation) => total + conversation.unread, 0))

  const conversationNav = createSingle({ mandatory: 'force' })
  for (const conversation of conversations) conversationNav.register({ id: conversation.id, value: conversation })
  conversationNav.select(conversations[0].id)

  const active = toRef(() => conversationNav.selectedValue.value as Conversation | undefined)

  /** Mobile master/detail — desktop shows both panes regardless. */
  const detail = shallowRef(false)

  const draft = shallowRef('')
  const messages = useTemplateRef<HTMLElement>('messages')

  async function bottom () {
    await nextTick()
    const el = messages.value
    if (el) el.scrollTop = el.scrollHeight
  }

  function onConversation (id: string) {
    conversationNav.select(id)
    detail.value = true
  }

  function onSend () {
    const conversation = active.value
    if (!conversation || !draft.value.trim()) return
    conversation.messages.push({ id: `m${conversation.messages.length + 1}`, from: 'me', author: 'You', initials: 'ME', text: draft.value.trim(), time: 'Now' })
    draft.value = ''
    bottom()
  }

  watch(active, bottom)
</script>

<template>
  <EmeraldShell>
    <div class="adm-chat" :data-detail="detail || undefined">
      <section aria-label="Conversations" class="adm-chat__list-pane">
        <header class="adm-chat__list-head">
          <h1 class="adm-chat__title">Messages</h1>
          <span v-if="unreadTotal" class="adm-chat__title-badge">{{ unreadTotal }} unread</span>
        </header>

        <!-- Filters sit above the search: pick the slice first, then narrow it. -->
        <div class="adm-chat__filters" role="tablist">
          <button
            v-for="entry in filters"
            :key="entry.id"
            :aria-selected="filterNav.selected(entry.id)"
            class="adm-chat__filter"
            :data-active="filterNav.selected(entry.id) || undefined"
            role="tab"
            type="button"
            @click="filterNav.select(entry.id)"
          >
            {{ entry.label }}
            <em>{{ scope(entry.id).length }}</em>
          </button>
        </div>

        <EmTextField v-model="search" aria-label="Search conversations" class="adm-chat__search" placeholder="Search channels and people" />

        <ul class="adm-chat__conversations">
          <template v-for="[heading, list] in groups" :key="heading">
            <li class="adm-chat__group">{{ heading }}</li>

            <li v-for="conversation in list" :key="conversation.id">
              <button
                class="adm-chat__conversation"
                :data-active="conversationNav.selected(conversation.id) || undefined"
                type="button"
                @click="onConversation(conversation.id)"
              >
                <span class="adm-chat__avatar-wrap" :data-kind="conversation.kind">
                  <EmAvatar size="sm"><EmAvatarFallback>{{ conversation.initials }}</EmAvatarFallback></EmAvatar>
                  <span v-if="conversation.online" aria-hidden="true" class="adm-chat__online" />
                </span>

                <span class="adm-chat__conversation-body">
                  <span class="adm-chat__conversation-top">
                    <strong>{{ conversation.name }}</strong>
                    <span v-if="conversation.unread" aria-hidden="true" class="adm-chat__unread-count">{{ conversation.unread }}</span>
                  </span>

                  <span class="adm-chat__conversation-bottom">
                    <span class="adm-chat__conversation-preview">{{ conversation.preview }}</span>
                    <time>{{ conversation.time }}</time>
                  </span>
                </span>
              </button>
            </li>
          </template>

          <li v-if="filtered.length === 0" class="adm-chat__empty">No conversations match.</li>
        </ul>
      </section>

      <section aria-label="Conversation" class="adm-chat__thread">
        <template v-if="active">
          <header class="adm-chat__thread-head">
            <button aria-label="Back to conversations" class="adm-chat__back" type="button" @click="detail = false">
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
            </button>

            <span class="adm-chat__avatar-wrap" :data-kind="active.kind">
              <EmAvatar size="sm"><EmAvatarFallback>{{ active.initials }}</EmAvatarFallback></EmAvatar>
              <span v-if="active.online" aria-hidden="true" class="adm-chat__online" />
            </span>

            <div class="adm-chat__thread-who">
              <strong>{{ active.name }}</strong>
              <span class="adm-chat__thread-topic">{{ active.topic }}</span>
            </div>

            <EmTag class="adm-chat__thread-tag" :variant="active.online ? 'success' : 'neutral'">
              {{ active.online ? 'Active now' : 'Away' }}
            </EmTag>
          </header>

          <div ref="messages" class="adm-chat__messages">
            <p class="adm-chat__day">Today</p>

            <div v-for="message in active.messages" :key="message.id" class="adm-chat__bubble-row" :data-from="message.from">
              <EmAvatar v-if="message.from === 'them'" class="adm-chat__bubble-avatar" size="sm">
                <EmAvatarFallback>{{ message.initials }}</EmAvatarFallback>
              </EmAvatar>

              <span class="adm-chat__bubble-stack">
                <span class="adm-chat__bubble">{{ message.text }}</span>

                <!-- Timestamp lives under the bubble, not inside it. -->
                <span class="adm-chat__bubble-meta">
                  <span v-if="message.from === 'them'">{{ message.author }} ·</span>
                  {{ message.time }}
                </span>
              </span>
            </div>
          </div>

          <form class="adm-chat__composer" @submit.prevent="onSend">
            <EmTextField v-model="draft" aria-label="Message" class="adm-chat__composer-field" :placeholder="`Message ${active.name}`" />
            <!-- EmButton always renders type='button', so the click has to drive the submit. -->
            <EmButton :disabled="!draft.trim()" variant="primary" @click="onSend">Send</EmButton>
          </form>
        </template>

        <p v-else class="adm-chat__thread-empty">Select a conversation to start chatting.</p>
      </section>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-chat {
    display: grid;
    grid-template-columns: minmax(0, 312px) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  .adm-chat__list-pane,
  .adm-chat__thread {
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-chat__list-pane {
    padding: var(--emerald-spacing-m, 16px) var(--emerald-spacing-s, 12px);
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-chat__list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    padding: 0 4px;
  }

  .adm-chat__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .adm-chat__title-badge {
    padding: 2px var(--emerald-spacing-xs, 8px);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-size: 11px;
    font-weight: 700;
  }

  /* Segmented row above the search, borderless — the reference underlines a
     tab strip below it. */
  .adm-chat__filters {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--emerald-radius-l, 10px);
    background: var(--emerald-neutral-200, #f6f8fa);
    overflow-x: auto;
    overscroll-behavior-x: contain;
  }

  .adm-chat__filter {
    display: inline-flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 5px var(--emerald-spacing-xs, 8px);
    white-space: nowrap;
    border: none;
    border-radius: var(--emerald-radius-s, 6px);
    background: transparent;
    color: var(--emerald-on-surface-variant, #757e85);
    font: inherit;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    cursor: pointer;
  }

  .adm-chat__filter:hover {
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-chat__filter[data-active] {
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-primary-700, #027d4c);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-chat__filter em {
    font-style: normal;
    font-weight: 400;
    opacity: 0.7;
  }

  .adm-chat__filter:focus-visible,
  .adm-chat__conversation:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }

  .adm-chat__group {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-xs, 8px) 2px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .adm-chat__conversations {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
  }

  .adm-chat__conversation {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-xs, 8px);
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .adm-chat__conversation:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-chat__conversation[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-chat__avatar-wrap {
    position: relative;
    flex: none;
    display: inline-flex;
  }

  /* Channels read as squared tiles, people stay circular. */
  .adm-chat__avatar-wrap[data-kind='channel'] .emerald-avatar {
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-chat__online {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 8px;
    height: 8px;
    border: 2px solid var(--emerald-background, #fefefe);
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
  }

  .adm-chat__conversation-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .adm-chat__conversation-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-chat__conversation-top strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Preview and timestamp share the second line; the reference puts the time
     up top beside the name. */
  .adm-chat__conversation-bottom {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    min-width: 0;
  }

  .adm-chat__conversation-bottom time {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
  }

  .adm-chat__conversation-preview {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-chat__unread-count {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-on-primary, #fff);
    font-size: 11px;
    font-weight: 700;
  }

  .adm-chat__empty {
    padding: var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
    text-align: center;
  }

  .adm-chat__thread {
    gap: 0;
  }

  .adm-chat__thread-head {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-chat__thread-who {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .adm-chat__thread-tag {
    flex: none;
  }

  .adm-chat__back {
    display: none;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 32px;
    height: 32px;
    margin-left: -4px;
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: pointer;
  }

  .adm-chat__back:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-chat__thread-topic {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-chat__messages {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-m, 16px);
    overflow-y: auto;
  }

  .adm-chat__day {
    align-self: center;
    margin: 0;
    padding: 2px var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 11px;
    font-weight: 600;
  }

  .adm-chat__bubble-row {
    display: flex;
    align-items: flex-end;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-chat__bubble-row[data-from='me'] {
    justify-content: flex-end;
  }

  .adm-chat__bubble-avatar {
    flex: none;
    margin-bottom: 16px;
  }

  .adm-chat__bubble-stack {
    display: flex;
    flex-direction: column;
    gap: 3px;
    max-width: 62%;
  }

  .adm-chat__bubble-row[data-from='me'] .adm-chat__bubble-stack {
    align-items: flex-end;
  }

  /* Asymmetric corner points the bubble at its speaker. */
  .adm-chat__bubble {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-l, 10px) var(--emerald-radius-l, 10px) var(--emerald-radius-l, 10px) 2px;
    background: var(--emerald-background, #fefefe);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: 1.5;
  }

  .adm-chat__bubble-row[data-from='me'] .adm-chat__bubble {
    border-radius: var(--emerald-radius-l, 10px) var(--emerald-radius-l, 10px) 2px;
    border-color: var(--emerald-primary-300, #baedd0);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-chat__bubble-meta {
    padding: 0 2px;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 10px;
  }

  .adm-chat__composer {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0 var(--emerald-spacing-m, 16px) var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-xs, 8px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-chat__composer-field {
    flex: 1;
  }

  .adm-chat__thread-empty {
    margin: auto;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  /* Single column: the thread becomes a detail view the list pushes onto, so a
     tap always leads somewhere. */
  @media (max-width: 900px) {
    .adm-chat {
      grid-template-columns: minmax(0, 1fr);
      height: auto;
    }

    .adm-chat__thread {
      display: none;
    }

    .adm-chat[data-detail] .adm-chat__list-pane {
      display: none;
    }

    .adm-chat[data-detail] .adm-chat__thread {
      display: flex;
      height: calc(100vh - 160px);
      min-height: 480px;
    }

    .adm-chat[data-detail] .adm-chat__back {
      display: inline-flex;
    }

    .adm-chat__bubble-stack {
      max-width: 78%;
    }
  }
</style>
