<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmButton,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSingle } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  interface ChatMessage {
    id: string
    from: 'me' | 'them'
    text: string
    time: string
  }

  interface Conversation {
    [key: string]: unknown
    id: string
    name: string
    initials: string
    preview: string
    time: string
    unread: number
    online: boolean
    pinned: boolean
    messages: ChatMessage[]
  }

  const conversations: Conversation[] = [
    {
      id: 'c1', name: 'Product Team', initials: 'PT', preview: 'Let us lock scope in tomorrow standup', time: 'Jun 11', unread: 3, online: true, pinned: true,
      messages: [
        { id: 'm1', from: 'them', text: 'Let us lock scope in tomorrow standup.', time: '9:02 AM' },
        { id: 'm2', from: 'me', text: 'Sounds good, I will bring the updated roadmap.', time: '9:05 AM' },
      ],
    },
    {
      id: 'c2', name: 'Sarah Johnson', initials: 'SJ', preview: 'Can we present this to leadership on…', time: 'Jun 11', unread: 2, online: true, pinned: true,
      messages: [
        { id: 'm1', from: 'them', text: 'Can we present this to leadership on Thursday?', time: '8:41 AM' },
        { id: 'm2', from: 'me', text: 'Yes, I will have the deck ready by Wednesday.', time: '8:44 AM' },
      ],
    },
    {
      id: 'c3', name: 'Leadership', initials: 'LD', preview: 'Please keep the product section to 10 m…', time: 'Jun 6', unread: 0, online: false, pinned: true,
      messages: [
        { id: 'm1', from: 'them', text: 'Please keep the product section to 10 minutes.', time: 'Jun 6' },
      ],
    },
    {
      id: 'c4', name: 'Sales & Marketing', initials: 'SM', preview: 'Prospect confirmed Thursday 2 PM — cal…', time: 'Jun 11', unread: 1, online: true, pinned: false,
      messages: [
        { id: 'm1', from: 'them', text: 'Prospect confirmed Thursday 2 PM — calendar invite sent.', time: '7:15 AM' },
      ],
    },
    {
      id: 'c5', name: 'Jessica Martinez', initials: 'JM', preview: 'Can you confirm the headcount assumpti…', time: 'Jun 11', unread: 1, online: false, pinned: false,
      messages: [
        { id: 'm1', from: 'them', text: 'Can you confirm the headcount assumptions for Q4?', time: '6:52 AM' },
      ],
    },
    {
      id: 'c6', name: 'Lisa Nguyen', initials: 'LN', preview: 'Team offsite survey closes tomorrow — re…', time: 'Jun 11', unread: 2, online: true, pinned: false,
      messages: [
        { id: 'm1', from: 'them', text: 'Team offsite survey closes tomorrow — reminder sent.', time: '6:10 AM' },
      ],
    },
  ]

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'groups', label: 'Groups' },
    { id: 'favourites', label: 'Favourites' },
  ] as const

  const tabNav = createSingle({ mandatory: 'force' })
  for (const tab of tabs) tabNav.register({ id: tab.id, value: tab })
  tabNav.select('all')

  const search = shallowRef('')
  const filter = createFilter<Conversation>({ keys: ['name'], mode: 'some' })

  const scoped = toRef(() => {
    if (tabNav.selected('unread')) return conversations.filter(c => c.unread > 0)
    if (tabNav.selected('favourites')) return conversations.filter(c => c.pinned)
    return conversations
  })

  const filtered = toRef(() => filter.apply(search.value, scoped.value).items.value)

  const conversationNav = createSingle({ mandatory: 'force' })
  for (const conversation of conversations) conversationNav.register({ id: conversation.id, value: conversation })
  conversationNav.select(conversations[0].id)

  const active = toRef(() => conversationNav.selectedValue.value as Conversation | undefined)

  const draft = shallowRef('')

  function onSend () {
    const conversation = active.value
    if (!conversation || !draft.value.trim()) return
    conversation.messages.push({ id: `m${conversation.messages.length + 1}`, from: 'me', text: draft.value.trim(), time: 'Now' })
    draft.value = ''
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-chat" data-theme="emerald">
      <section aria-label="Conversations" class="adm-chat__list-pane">
        <header class="adm-chat__list-head">
          <h1 class="adm-chat__title">Chats</h1>
        </header>

        <EmTextField v-model="search" aria-label="Search conversations" class="adm-chat__search" placeholder="Search conversations…" />

        <div class="adm-chat__tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :aria-selected="tabNav.selected(tab.id)"
            class="adm-chat__tab"
            :data-active="tabNav.selected(tab.id) || undefined"
            role="tab"
            type="button"
            @click="tabNav.select(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <ul class="adm-chat__conversations">
          <li v-for="conversation in filtered" :key="conversation.id">
            <button
              class="adm-chat__conversation"
              :data-active="conversationNav.selected(conversation.id) || undefined"
              type="button"
              @click="conversationNav.select(conversation.id)"
            >
              <span class="adm-chat__avatar-wrap">
                <EmAvatar size="sm"><EmAvatarFallback>{{ conversation.initials }}</EmAvatarFallback></EmAvatar>
                <span v-if="conversation.online" aria-hidden="true" class="adm-chat__online" />
              </span>

              <span class="adm-chat__conversation-body">
                <span class="adm-chat__conversation-top">
                  <strong>{{ conversation.name }}</strong>
                  <time>{{ conversation.time }}</time>
                </span>

                <span class="adm-chat__conversation-preview">{{ conversation.preview }}</span>
              </span>

              <span v-if="conversation.unread" aria-hidden="true" class="adm-chat__unread-count">{{ conversation.unread }}</span>
            </button>
          </li>

          <li v-if="filtered.length === 0" class="adm-chat__empty">No conversations match.</li>
        </ul>
      </section>

      <section aria-label="Conversation" class="adm-chat__thread">
        <template v-if="active">
          <header class="adm-chat__thread-head">
            <span class="adm-chat__avatar-wrap">
              <EmAvatar size="sm"><EmAvatarFallback>{{ active.initials }}</EmAvatarFallback></EmAvatar>
              <span v-if="active.online" aria-hidden="true" class="adm-chat__online" />
            </span>

            <div>
              <strong>{{ active.name }}</strong>
              <span class="adm-chat__thread-status">{{ active.online ? 'Online' : 'Offline' }}</span>
            </div>
          </header>

          <div class="adm-chat__messages">
            <div v-for="message in active.messages" :key="message.id" class="adm-chat__bubble-row" :data-from="message.from">
              <span class="adm-chat__bubble">
                {{ message.text }}
                <em>{{ message.time }}</em>
              </span>
            </div>
          </div>

          <form class="adm-chat__composer" @submit.prevent="onSend">
            <EmTextField v-model="draft" aria-label="Message" class="adm-chat__composer-field" placeholder="Type a message…" />
            <EmButton type="submit" variant="primary">Send</EmButton>
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
    grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
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
    padding: var(--emerald-spacing-m, 16px);
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-chat__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
  }

  .adm-chat__search {
    width: 100%;
  }

  .adm-chat__tabs {
    display: flex;
    gap: 4px;
    padding-bottom: var(--emerald-spacing-xs, 8px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-chat__tab {
    padding: 4px var(--emerald-spacing-s, 12px);
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface-variant, #757e85);
    font: inherit;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    cursor: pointer;
  }

  .adm-chat__tab:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-chat__tab[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
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
    align-items: flex-start;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    padding: var(--emerald-spacing-s, 12px);
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
    align-items: baseline;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-chat__conversation-top time {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
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
    padding: var(--emerald-spacing-m, 16px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-chat__thread-head strong {
    display: block;
  }

  .adm-chat__thread-status {
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

  .adm-chat__bubble-row {
    display: flex;
  }

  .adm-chat__bubble-row[data-from='me'] {
    justify-content: flex-end;
  }

  .adm-chat__bubble {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 70%;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-chat__bubble-row[data-from='me'] .adm-chat__bubble {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-chat__bubble em {
    align-self: flex-end;
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: 10px;
  }

  .adm-chat__composer {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-m, 16px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-chat__composer-field {
    flex: 1;
  }

  .adm-chat__thread-empty {
    margin: auto;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  @media (max-width: 900px) {
    .adm-chat {
      grid-template-columns: minmax(0, 1fr);
      height: auto;
    }

    .adm-chat__thread {
      display: none;
    }
  }
</style>
