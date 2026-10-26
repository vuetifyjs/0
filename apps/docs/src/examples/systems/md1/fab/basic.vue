<script setup lang="ts">
  import { Md1Button, Md1Fab, Md1Icon, Md1List, Md1Toolbar } from '@paper/md1'
  import { nextTick, ref, shallowRef, useTemplateRef } from 'vue'

  interface Message {
    id: number
    from: string
    subject: string
    draft?: boolean
  }

  const messages = ref<Message[]>([
    { id: 1, from: 'Ana Ribeiro', subject: 'Photos from Sintra' },
    { id: 2, from: 'Ben Okafor', subject: 'Lunch on Thursday?' },
    { id: 3, from: 'Chloe Martin', subject: 'Minutes from the planning call' },
    { id: 4, from: 'Dev Patel', subject: 'Your order has shipped' },
    { id: 5, from: 'Elena Rossi', subject: 'Book club: next pick' },
  ])

  const next = shallowRef(6)
  const scroller = useTemplateRef<HTMLElement>('scroller')

  async function onCompose () {
    messages.value.unshift({ id: next.value++, from: 'Draft', subject: 'No subject', draft: true })

    await nextTick()

    scroller.value?.scrollTo({ top: 0 })
  }

  function onDelete (id: number) {
    messages.value = messages.value.filter(message => message.id !== id)
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-usage">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>
    </Md1Toolbar>

    <div
      ref="scroller"
      aria-label="Inbox"
      class="md1-docs-fab-usage-scroller"
      role="region"
      tabindex="0"
    >
      <Md1List aria-label="Messages" :lines="2">
        <Md1List.Item v-for="message in messages" :key="message.id">
          <Md1List.Avatar>
            <Md1Icon v-if="message.draft" name="drafts" />

            <template v-else>{{ message.from.charAt(0) }}</template>
          </Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>{{ message.from }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action v-if="message.draft">
            <Md1Button aria-label="Delete draft" icon="delete" @click="onDelete(message.id)" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Fab aria-label="Compose" icon="edit" @click="onCompose" />
  </div>
</template>

<style>
  /* The toolbar holds its height; the messages scroll beneath it, inside the fixed screen. */
  .md1-docs-fab-usage {
    display: flex;
    flex-direction: column;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-fab-usage-scroller {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  /* Room under the last row for the 56 dp FAB and its margins, so no message stays hidden behind it. */
  .md1-docs-fab-usage-scroller > .md1-list {
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }
</style>
