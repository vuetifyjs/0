<script lang="ts">
  // Framework
  import { Md1Button, Md1Dialog, Md1Fab, Md1Icon, Md1List, Md1Snackbar, Md1TextField } from '@paper/md1'

  // Utilities
  import { nextTick, ref, shallowRef, watch } from 'vue'

  type Message = {
    id: number
    from: string
    subject: string
    time: string
    unread?: boolean
  }

  const seed: Message[] = [
    { id: 1, from: 'Ana Ribeiro', subject: 'Photos from Sintra', time: '9:14 AM', unread: true },
    { id: 2, from: 'Ben Okafor', subject: 'Lunch on Thursday?', time: '8:47 AM', unread: true },
    { id: 3, from: 'Chloe Martin', subject: 'Minutes from the planning call', time: '7:32 AM' },
    { id: 4, from: 'Dev Patel', subject: 'Your order has shipped', time: 'Yesterday' },
    { id: 5, from: 'Elena Rossi', subject: 'Book club: next pick', time: 'Yesterday', unread: true },
    { id: 6, from: 'Farid Haddad', subject: 'Quarterly numbers, first pass', time: 'Yesterday' },
    { id: 7, from: 'Greta Lindqvist', subject: 'Hiking on Saturday?', time: 'Friday' },
    { id: 8, from: 'Hugo Alves', subject: 'Draft of the press note', time: 'Friday' },
    { id: 9, from: 'Imani Said', subject: 'New apartment photos', time: 'Thursday' },
    { id: 10, from: 'Jonas Weber', subject: 'The recipe you asked about', time: 'Thursday' },
  ]
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Inbox' })

  const messages = ref<Message[]>([...seed])
  const removed = shallowRef<{ item: Message, index: number }>()

  /*
   * One snackbar for the whole page. A new note closes the bar for a tick so
   * consecutive confirmations enter one at a time (snackbars page), each with
   * a fresh timeout.
   */
  const open = shallowRef(false)
  const note = shallowRef('')
  const undoable = shallowRef(false)

  async function notify (message: string, undo = false) {
    if (open.value) {
      open.value = false

      await nextTick()
    }

    note.value = message
    undoable.value = undo
    open.value = true
  }

  function onArchive (item: Message) {
    const index = messages.value.indexOf(item)

    messages.value.splice(index, 1)
    removed.value = { item, index }
    notify('Message archived', true)
  }

  function onUndo () {
    if (!removed.value) return

    messages.value.splice(removed.value.index, 0, removed.value.item)
    removed.value = undefined
  }

  // The compose draft
  const composing = shallowRef(false)
  const draft = shallowRef<unknown>()
  const to = shallowRef('')
  const subject = shallowRef('')
  const body = shallowRef('')

  /*
   * Every opening starts from a blank draft. The dialog reopens on its
   * committed value — a confirmed Send writes the draft there — so the
   * committed model is blanked along with the fields, or Send would arrive
   * enabled on the next opening.
   */
  watch(composing, value => {
    if (!value) return

    draft.value = undefined
    to.value = ''
    subject.value = ''
    body.value = ''
  })

  /**
   * The confirmation dialog holds a choice until OK, and the draft is that
   * choice: Send stays disabled until a field has text. The field being typed
   * in passes its event value, because its ref may settle after the commit.
   */
  function drafted (...parts: string[]) {
    return parts.some(part => part.trim().length > 0) || undefined
  }

  function onSend () {
    notify('Message sent')
  }
</script>

<template>
  <section class="md1-demo-inbox">
    <div v-if="messages.length > 0" class="md1-demo-inbox-sheet md1-elevation-2">
      <Md1List aria-label="Messages" :lines="2">
        <Md1List.Item
          v-for="message in messages"
          :key="message.id"
          :class="{ 'md1-demo-inbox-unread': message.unread }"
        >
          <Md1List.Avatar>{{ message.from.charAt(0) }}</Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>{{ message.from }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <div class="md1-demo-inbox-meta">
              <span class="md1-demo-inbox-time">{{ message.time }}</span>

              <Md1Button
                :aria-label="`Archive message from ${message.from}`"
                class="md1-demo-inbox-archive"
                icon="done"
                @click="onArchive(message)"
              />
            </div>
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </div>

    <div v-else class="md1-demo-inbox-empty">
      <Md1Icon class="md1-demo-inbox-empty__art" name="inbox" />

      <p class="md1-demo-inbox-empty__tagline">All caught up — new messages gather here</p>
    </div>

    <Md1Fab aria-label="Compose" icon="edit" @click="composing = true" />

    <Md1Dialog v-slot="{ commit }" v-model="composing" v-model:value="draft" variant="confirmation">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Compose</Md1Dialog.Title>

        <div class="md1-demo-inbox-compose">
          <Md1TextField
            v-model="to"
            label="To"
            @update:model-value="value => commit(drafted(value, subject, body))"
          />

          <Md1TextField
            v-model="subject"
            label="Subject"
            @update:model-value="value => commit(drafted(to, value, body))"
          />

          <Md1TextField
            v-model="body"
            label="Message"
            multiline
            @update:model-value="value => commit(drafted(to, subject, value))"
          />
        </div>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Discard</Md1Dialog.Cancel>

          <Md1Dialog.Confirm @confirm="onSend">Send</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" :action="undoable ? 'Undo' : undefined" @action="onUndo">{{ note }}</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-inbox {
    max-width: 840px;
    margin-inline: auto;
    /* Room under the list for the 56 dp FAB and its margins, so no row hides behind it. */
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }

  .md1-demo-inbox-sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* An unread tile: the bolder ink of unread mail, on the sender and its time. */
  .md1-demo-inbox-unread .md1-list__primary,
  .md1-demo-inbox-unread .md1-demo-inbox-time {
    font-weight: 500;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The end column stacks the secondary info over the row's one action. */
  .md1-demo-inbox-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  /* Secondary info in the end column: Caption at the secondary ink (lists: controls). */
  .md1-demo-inbox-time {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* A list's secondary action is an icon in the active icon ink, not an accent-coloured flat button. */
  .md1-demo-inbox-archive.md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* The empty state belongs to the screen: a 96 dp glyph in the disabled ink and a Subheading tagline. */
  .md1-demo-inbox-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 60dvh;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  .md1-demo-inbox-empty__art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-demo-inbox-empty__tagline {
    max-width: 280px;
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The compose fields sit on the dialog's 24 dp content keyline. */
  .md1-demo-inbox-compose {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    width: 400px;
    max-width: 100%;
    padding: 0 var(--md1-spacing-3, 24px);
  }
</style>
