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
    EmTextarea,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSingle } from '@vuetify/v0'

  // Context
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  interface Folder {
    id: string
    label: string
    count: number
  }

  const folders: Folder[] = [
    { id: 'inbox', label: 'Inbox', count: 10 },
    { id: 'drafts', label: 'Drafts', count: 1 },
    { id: 'sent', label: 'Sent', count: 2 },
    { id: 'spam', label: 'Spam', count: 2 },
    { id: 'trash', label: 'Trash', count: 1 },
    { id: 'archive', label: 'Archive', count: 2 },
  ]

  interface MailLabel {
    id: string
    label: string
    count: number
  }

  const mailLabels: MailLabel[] = [
    { id: 'social', label: 'Social', count: 3 },
    { id: 'updates', label: 'Updates', count: 4 },
    { id: 'forums', label: 'Forums', count: 2 },
    { id: 'shopping', label: 'Shopping', count: 1 },
    { id: 'promotions', label: 'Promotions', count: 1 },
  ]

  interface Message {
    [key: string]: unknown
    id: string
    sender: string
    initials: string
    subject: string
    preview: string
    body: string
    time: string
    unread: boolean
  }

  const messages: Message[] = [
    { id: 'm1', sender: 'Sarah Johnson', initials: 'SJ', subject: 'Q4 Marketing Campaign Review', preview: 'Thanks for the feedback — I\'ll…', body: 'Thanks for the feedback — I\'ll incorporate your suggestions into the Q1 plan.\n\nLet\'s sync on Monday to finalize the deck.\n\nBest,\nSarah', time: '2 hours ago', unread: true },
    { id: 'm2', sender: 'Michael Chen', initials: 'MC', subject: 'Project Timeline Update', preview: 'Hello, just a quick update on the…', body: 'Hello, just a quick update on the timeline — we are on track for the Friday review.', time: '5 hours ago', unread: true },
    { id: 'm3', sender: 'Emma Wilson', initials: 'EW', subject: 'Re: Team Lunch Tomorrow', preview: 'Perfect — see you at 12:30 at the…', body: 'Perfect — see you at 12:30 at the usual spot.', time: 'Yesterday', unread: false },
    { id: 'm4', sender: 'David Park', initials: 'DP', subject: 'Code Review Request', preview: 'Hi, could you review my PR for the…', body: 'Hi, could you review my PR for the auth module when you get a chance?', time: 'Yesterday', unread: true },
    { id: 'm5', sender: 'Jessica Martinez', initials: 'JM', subject: 'Budget Approval Request', preview: 'Hi, I need approval for the additional…', body: 'Hi, I need approval for the additional design spend this quarter.', time: 'Aug 1', unread: false },
    { id: 'm6', sender: 'Rachel Green', initials: 'RG', subject: 'Team Building Event', preview: 'Save the date for our offsite next…', body: 'Save the date for our offsite next month — details to follow.', time: 'Jul 28', unread: false },
  ]

  const folderNav = createSingle({ mandatory: 'force' })
  for (const folder of folders) folderNav.register({ id: folder.id, value: folder })
  folderNav.select('inbox')

  const messageNav = createSingle({ mandatory: 'force' })
  for (const message of messages) messageNav.register({ id: message.id, value: message })
  messageNav.select(messages[0].id)

  const search = shallowRef('')
  const filter = createFilter<Message>({ keys: ['sender', 'subject'], mode: 'some' })
  const filtered = toRef(() => filter.apply(search.value, messages).items.value)

  const selected = toRef(() => messageNav.selectedValue.value as Message | undefined)

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
  <AdminShell>
    <div class="adm-mail" data-theme="emerald">
      <aside aria-label="Mailboxes" class="adm-mail__folders">
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

        <p class="adm-mail__nav-label">Mailboxes</p>

        <ul class="adm-mail__list">
          <li v-for="folder in folders" :key="folder.id">
            <button
              class="adm-mail__folder"
              :data-active="folderNav.selected(folder.id) || undefined"
              type="button"
              @click="folderNav.select(folder.id)"
            >
              <span>{{ folder.label }}</span>
              <em>{{ folder.count }}</em>
            </button>
          </li>
        </ul>

        <p class="adm-mail__nav-label">Labels</p>

        <ul class="adm-mail__list adm-mail__list--labels">
          <li v-for="label in mailLabels" :key="label.id">
            <span aria-hidden="true" class="adm-mail__dot" :data-tone="label.id" />
            <span class="adm-mail__label-name">{{ label.label }}</span>
            <em>{{ label.count }}</em>
          </li>
        </ul>
      </aside>

      <section aria-label="Messages" class="adm-mail__list-pane">
        <header class="adm-mail__list-head">
          <h1 class="adm-mail__title">{{ folders.find(f => folderNav.selected(f.id))?.label }}</h1>
        </header>

        <EmTextField v-model="search" aria-label="Search mail" class="adm-mail__search" placeholder="Search mail" />

        <ul class="adm-mail__messages">
          <li v-for="message in filtered" :key="message.id">
            <button
              class="adm-mail__message"
              :data-active="messageNav.selected(message.id) || undefined"
              type="button"
              @click="messageNav.select(message.id)"
            >
              <EmAvatar size="sm"><EmAvatarFallback>{{ message.initials }}</EmAvatarFallback></EmAvatar>

              <span class="adm-mail__message-body">
                <span class="adm-mail__message-top">
                  <strong>{{ message.sender }}</strong>
                  <time>{{ message.time }}</time>
                </span>

                <span class="adm-mail__message-subject" :data-unread="message.unread || undefined">{{ message.subject }}</span>
                <span class="adm-mail__message-preview">{{ message.preview }}</span>
              </span>

              <span v-if="message.unread" aria-hidden="true" class="adm-mail__unread-dot" />
            </button>
          </li>

          <li v-if="filtered.length === 0" class="adm-mail__empty">No messages match "{{ search }}"</li>
        </ul>
      </section>

      <section aria-label="Reading pane" class="adm-mail__reading">
        <template v-if="selected">
          <header class="adm-mail__reading-head">
            <div>
              <h2>{{ selected.subject }}</h2>

              <p>
                <strong>{{ selected.sender }}</strong>
                <span class="adm-mail__reading-time">{{ selected.time }}</span>
              </p>
            </div>

            <EmAvatar size="md"><EmAvatarFallback>{{ selected.initials }}</EmAvatarFallback></EmAvatar>
          </header>

          <p class="adm-mail__reading-body">{{ selected.body }}</p>

          <div class="adm-mail__reply">
            <EmTextarea aria-label="Reply" :placeholder="`Reply to ${selected.sender}…`" :rows="3" />
            <EmButton variant="primary">Send</EmButton>
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
  </AdminShell>
</template>

<style>
  .adm-mail {
    display: grid;
    grid-template-columns: 200px minmax(0, 360px) minmax(0, 1fr);
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
    height: calc(100vh - 140px);
    min-height: 560px;
  }

  .adm-mail__folders,
  .adm-mail__list-pane,
  .adm-mail__reading {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-mail__folders {
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-m, 16px);
    overflow-y: auto;
  }

  .adm-mail__compose {
    width: 100%;
    justify-content: center;
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

  .adm-mail__folder {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

  .adm-mail__folder:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-mail__folder[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-weight: 600;
  }

  .adm-mail__folder em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__list--labels {
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-mail__list--labels li {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: 4px var(--emerald-spacing-s, 12px);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-mail__label-name {
    flex: 1;
  }

  .adm-mail__list--labels em {
    font-style: normal;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--emerald-primary-500, #26c26d);
  }

  .adm-mail__dot[data-tone='updates'] { background: var(--emerald-secondary-600, #00b4dc); }
  .adm-mail__dot[data-tone='forums'] { background: var(--emerald-warning-500, #e08b00); }
  .adm-mail__dot[data-tone='shopping'] { background: var(--emerald-primary-700, #027d4c); }
  .adm-mail__dot[data-tone='promotions'] { background: var(--emerald-danger-500, #c61424); }

  .adm-mail__list-pane {
    padding: var(--emerald-spacing-m, 16px);
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-mail__list-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .adm-mail__title {
    margin: 0;
    font-size: var(--emerald-text-h4-size, 20px);
    font-weight: 700;
  }

  .adm-mail__search {
    width: 100%;
  }

  .adm-mail__messages {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-y: auto;
  }

  .adm-mail__message {
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

  .adm-mail__message:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-mail__message[data-active] {
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-mail__message-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    gap: 2px;
  }

  .adm-mail__message-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-mail__message-top time {
    flex: none;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__message-subject {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-mail__message-subject[data-unread] {
    color: var(--emerald-on-surface, #2b2d2e);
    font-weight: 600;
  }

  .adm-mail__message-preview {
    overflow: hidden;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .adm-mail__unread-dot {
    flex: none;
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: var(--emerald-primary-600, #1fae60);
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

  .adm-mail__reading-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-mail__reading-head h2 {
    margin: 0 0 4px;
    font-size: var(--emerald-text-h4-size, 20px);
  }

  .adm-mail__reading-head p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-mail__reading-time {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-mail__reading-body {
    margin: 0;
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: 1.6;
    white-space: pre-line;
  }

  .adm-mail__reply {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    margin-top: auto;
    padding-top: var(--emerald-spacing-m, 16px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-mail__reply .emerald-button {
    align-self: flex-end;
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

  @media (max-width: 1100px) {
    .adm-mail {
      grid-template-columns: 180px minmax(0, 1fr);
      height: auto;
    }

    .adm-mail__reading {
      display: none;
    }
  }

  @media (max-width: 720px) {
    .adm-mail {
      grid-template-columns: minmax(0, 1fr);
    }

    .adm-mail__folders {
      display: none;
    }
  }
</style>
