<script lang="ts">
  // Framework
  import { Md1Button, Md1Chip, Md1Divider, Md1IconToggle, Md1TextField, Md1Tooltip } from '@paper/md1'

  // Context
  import { messages } from './Md1Data'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type { Message } from './Md1Data'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1InboxDetail' })

  const { message } = defineProps<{
    /** The open message from the messages store. */
    message: Message
  }>()

  const emit = defineEmits<{
    /** Archive this message; the page owns the removal and its Undo. */
    archive: []
    /** An attachment was pressed; the page raises the stub snackbar. */
    attach: []
    /** A reply was sent; the page raises the confirmation snackbar. */
    reply: []
  }>()

  const draft = shallowRef('')

  function onReply () {
    const text = draft.value.trim()

    if (!text) return

    messages.reply(message.id, text)
    draft.value = ''
    emit('reply')
  }
</script>

<template>
  <article class="md1-demo-inbox-detail">
    <header class="md1-demo-inbox-detail__head">
      <div aria-hidden="true" class="md1-demo-inbox-detail__face">{{ message.from.charAt(0) }}</div>

      <div class="md1-demo-inbox-detail__who">
        <h2 class="md1-demo-inbox-detail__from">{{ message.from }}</h2>

        <p class="md1-demo-inbox-detail__when">{{ message.day }} · {{ message.time }}</p>
      </div>

      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1IconToggle
            v-bind="attrs"
            :aria-label="`Star the message from ${message.from}`"
            icon="star-border"
            icon-on="star"
            :model-value="message.starred ?? false"
            @update:model-value="messages.star(message.id)"
          />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>{{ message.starred ? 'Unstar' : 'Star' }}</Md1Tooltip.Content>
      </Md1Tooltip>

      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1Button
            v-bind="attrs"
            :aria-label="`Archive the message from ${message.from}`"
            class="md1-demo-inbox-detail__act"
            icon="done"
            @click="emit('archive')"
          />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>Archive</Md1Tooltip.Content>
      </Md1Tooltip>
    </header>

    <Md1Divider />

    <div class="md1-demo-inbox-detail__page">
      <h3 class="md1-demo-inbox-detail__subject">{{ message.subject }}</h3>

      <p class="md1-demo-inbox-detail__body">{{ message.body }}</p>

      <div v-if="message.attachments?.length" class="md1-demo-inbox-detail__files">
        <Md1Chip
          v-for="name in message.attachments"
          :key="name"
          icon="file-download"
          @click="emit('attach')"
        >
          {{ name }}
        </Md1Chip>
      </div>

      <template v-if="message.replies?.length">
        <Md1Divider inset />

        <div v-for="(text, index) in message.replies" :key="index" class="md1-demo-inbox-detail__sent">
          <p class="md1-demo-inbox-detail__when">You replied</p>

          <p class="md1-demo-inbox-detail__body">{{ text }}</p>
        </div>
      </template>
    </div>

    <Md1Divider />

    <footer class="md1-demo-inbox-detail__foot">
      <Md1TextField
        v-model="draft"
        :aria-label="`Reply to ${message.from}`"
        class="md1-demo-inbox-detail__field"
        multiline
        placeholder="Reply…"
        @keydown.enter.exact.prevent="onReply"
      />

      <Md1Tooltip>
        <Md1Tooltip.Activator v-slot="{ attrs }">
          <Md1Button
            v-bind="attrs"
            aria-label="Send reply"
            :disabled="draft.trim().length === 0"
            icon="send"
            @click="onReply"
          />
        </Md1Tooltip.Activator>

        <Md1Tooltip.Content>Send</Md1Tooltip.Content>
      </Md1Tooltip>
    </footer>
  </article>
</template>

<style>
  .md1-demo-inbox-detail {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }

  .md1-demo-inbox-detail__head {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
  }

  /* The sender's 40 dp initials avatar: Grey 400 under white ink, like the list's. */
  .md1-demo-inbox-detail__face {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--md1-grey-400, #BDBDBD);
    color: var(--md1-white, #FFFFFF);
    font-size: var(--md1-type-subheading-size, 16px);
  }

  .md1-demo-inbox-detail__who {
    flex: 1 1 auto;
    min-width: 0;
  }

  .md1-demo-inbox-detail__from {
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: 500;
    line-height: var(--md1-type-subheading-leading, 24px);
  }

  .md1-demo-inbox-detail__when {
    margin: 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The archive action is an icon in the active icon ink, like a list's secondary action. */
  .md1-demo-inbox-detail__act.md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-inbox-detail__page {
    flex: 1 1 auto;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
  }

  .md1-demo-inbox-detail__subject {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: var(--md1-type-title-leading, 28px);
  }

  .md1-demo-inbox-detail__body {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .md1-demo-inbox-detail__files {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-1, 8px);
    margin-top: var(--md1-spacing-3, 24px);
  }

  .md1-demo-inbox-detail__sent {
    margin-top: var(--md1-spacing-2, 16px);
  }

  .md1-demo-inbox-detail__page > .md1-divider {
    margin-top: var(--md1-spacing-3, 24px);
  }

  .md1-demo-inbox-detail__foot {
    display: flex;
    gap: var(--md1-spacing-1, 8px);
    align-items: flex-end;
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-demo-inbox-detail__field {
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
