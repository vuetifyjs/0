<script lang="ts">
  import { Md1Checkbox, Md1Dialog, Md1Fab, Md1Icon, Md1List, Md1Snackbar, Md1Subheader, Md1Tabs, Md1TextField, Md1Toolbar, Md1Tooltip, md1Breakpoints, Md1Button } from '@paper/md1'

  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Context
  import Md1InboxDetail from './Md1InboxDetail.vue'

  import { messages } from './Md1Data'

  // Utilities
  import { nextTick, ref, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { Message, Slot, Tab } from './Md1Data'

  const tabs: { value: Tab, label: string }[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'social', label: 'Social' },
    { value: 'updates', label: 'Updates' },
  ]

  const days = ['Today', 'Yesterday', 'Earlier'] as const

  const taglines: Record<Tab, string> = {
    primary: 'All caught up — new messages gather here',
    social: 'No social messages — mail from people you know gathers here',
    updates: 'No updates — receipts and notices gather here',
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Inbox' })

  const { width } = useBreakpoints()

  /** From 960 dp the inbox is the MD1-era two-pane web client; below it, a full-screen reading dialog. */
  const wide = toRef(() => width.value >= md1Breakpoints[960])

  const tab = shallowRef<Tab>('primary')

  function bucket (value: Tab) {
    return messages.all.value.filter(message => message.tab === value)
  }

  /** The tab's rows under their day subheaders, empty days dropped. */
  function grouped (value: Tab) {
    return days
      .map(day => ({ day, rows: bucket(value).filter(message => message.day === day) }))
      .filter(group => group.rows.length > 0)
  }

  function unread (value: Tab) {
    return bucket(value).filter(message => message.unread).length
  }

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

  // Reading: the open message, in the end pane or the full-screen dialog.
  const current = shallowRef<Message>()
  const reading = shallowRef(false)

  function onOpen (message: Message) {
    messages.read(message.id)
    current.value = message

    if (!wide.value) reading.value = true
  }

  // Selection mode: the chosen ids; any selection swaps the header to the contextual bar.
  const chosen = ref<number[]>([])
  const removed = shallowRef<Slot<Message>[]>()

  function onPick (message: Message) {
    const set = new Set(chosen.value)

    if (set.has(message.id)) set.delete(message.id)
    else set.add(message.id)

    chosen.value = [...set]
  }

  function drop (ids: number[], confirmation: string) {
    removed.value = messages.remove(ids)

    if (current.value && ids.includes(current.value.id)) {
      current.value = undefined
      reading.value = false
    }

    chosen.value = []
    notify(confirmation, true)
  }

  function onArchive () {
    drop(chosen.value, `${chosen.value.length} archived`)
  }

  function onDelete () {
    drop(chosen.value, `${chosen.value.length} deleted`)
  }

  function onRead () {
    for (const id of chosen.value) messages.read(id)

    chosen.value = []
    notify('Marked as read')
  }

  function onArchiveOne () {
    if (current.value) drop([current.value.id], 'Message archived')
  }

  function onUndo () {
    if (!removed.value) return

    messages.restore(removed.value)
    removed.value = undefined
  }

  // The compose draft
  const composing = shallowRef(false)
  const draft = shallowRef<unknown>()
  const to = shallowRef('')
  const subject = shallowRef('')
  const body = shallowRef('')

  /*
   * Every opening starts from a blank draft, committed model included: the
   * dialog reopens on its committed value, so a sent draft would otherwise
   * arrive with Send already enabled.
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
  <section class="md1-demo-inbox" @keydown.esc="chosen = []">
    <div class="md1-demo-inbox-layout">
      <div class="md1-demo-inbox-sheet md1-elevation-2">
        <Md1Tabs v-model="tab" class="md1-demo-inbox-tabs">
          <div class="md1-demo-inbox-head">
            <!-- dense: the 48 dp desktop bar, the tab bar's own height, so the swap is between equals. -->
            <Md1Toolbar v-if="chosen.length > 0" contextual dense>
              <Md1Toolbar.Contextual :count="chosen.length" @clear="chosen = []">
                <Md1Toolbar.Actions>
                  <Md1Tooltip>
                    <Md1Tooltip.Activator v-slot="{ attrs }">
                      <Md1Button v-bind="attrs" aria-label="Mark as read" icon="drafts" @click="onRead" />
                    </Md1Tooltip.Activator>

                    <Md1Tooltip.Content>Mark as read</Md1Tooltip.Content>
                  </Md1Tooltip>

                  <Md1Tooltip>
                    <Md1Tooltip.Activator v-slot="{ attrs }">
                      <Md1Button v-bind="attrs" aria-label="Archive" icon="done" @click="onArchive" />
                    </Md1Tooltip.Activator>

                    <Md1Tooltip.Content>Archive</Md1Tooltip.Content>
                  </Md1Tooltip>

                  <Md1Tooltip>
                    <Md1Tooltip.Activator v-slot="{ attrs }">
                      <Md1Button v-bind="attrs" aria-label="Delete" icon="delete" @click="onDelete" />
                    </Md1Tooltip.Activator>

                    <Md1Tooltip.Content>Delete</Md1Tooltip.Content>
                  </Md1Tooltip>
                </Md1Toolbar.Actions>
              </Md1Toolbar.Contextual>
            </Md1Toolbar>

            <!-- v-show, not v-if: unmounting the list would unregister the tabs and hide the open panel. -->
            <Md1Tabs.List v-show="chosen.length === 0" label="Inbox sections">
              <Md1Tabs.Item
                v-for="item in tabs"
                :key="item.value"
                :label="`${item.label} (${unread(item.value)})`"
                :value="item.value"
              />
            </Md1Tabs.List>
          </div>

          <!-- The swap container: panels slide inside it, out of flow and clipped, so a switch never stacks or scrolls the page. -->
          <div class="md1-demo-inbox-swap">
            <Md1Tabs.Panel
              v-for="item in tabs"
              :key="item.value"
              class="md1-demo-inbox-panel"
              :value="item.value"
            >
              <template v-if="bucket(item.value).length > 0">
                <template v-for="group in grouped(item.value)" :key="group.day">
                  <Md1Subheader inset :sticky="false">{{ group.day }}</Md1Subheader>

                  <Md1List :aria-label="`${group.day} messages`" :lines="2" :model-value="wide ? current?.id : undefined">
                    <Md1List.Item
                      v-for="message in group.rows"
                      :key="message.id"
                      :class="[
                        message.unread ? 'md1-demo-inbox-unread' : 'md1-demo-inbox-read',
                        { 'md1-demo-inbox-picked': chosen.includes(message.id) },
                      ]"
                      :value="message.id"
                      @click="onOpen(message)"
                    >
                      <Md1List.Avatar>{{ message.from.charAt(0) }}</Md1List.Avatar>

                      <Md1List.Content>
                        <Md1List.Primary>{{ message.from }}</Md1List.Primary>

                        <Md1List.Secondary>{{ message.subject }} — {{ message.preview }}</Md1List.Secondary>
                      </Md1List.Content>

                      <Md1List.Action>
                        <div class="md1-demo-inbox-meta">
                          <span class="md1-demo-inbox-time">{{ message.time }}</span>

                          <Md1Checkbox
                            :aria-label="`Select the message from ${message.from}`"
                            :model-value="chosen.includes(message.id)"
                            @update:model-value="onPick(message)"
                          />
                        </div>
                      </Md1List.Action>
                    </Md1List.Item>
                  </Md1List>
                </template>
              </template>

              <div v-else class="md1-demo-inbox-empty">
                <Md1Icon class="md1-demo-inbox-empty__art" name="inbox" />

                <p class="md1-demo-inbox-empty__tagline">{{ taglines[item.value] }}</p>
              </div>
            </Md1Tabs.Panel>
          </div>
        </Md1Tabs>
      </div>

      <aside v-if="wide" aria-label="Reading pane" class="md1-demo-inbox-pane md1-elevation-2">
        <Md1InboxDetail
          v-if="current"
          :message="current"
          @archive="onArchiveOne"
          @attach="notify('Attachments are stubbed in this demo')"
          @reply="notify('Reply sent')"
        />

        <div v-else class="md1-demo-inbox-empty">
          <Md1Icon class="md1-demo-inbox-empty__art" name="email" />

          <p class="md1-demo-inbox-empty__tagline">Select a message to read it</p>
        </div>
      </aside>
    </div>

    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Fab
          v-bind="attrs"
          aria-label="Compose"
          class="md1-demo-inbox-fab"
          icon="edit"
          @click="composing = true"
        />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Compose</Md1Tooltip.Content>
    </Md1Tooltip>

    <!-- Below 960 dp the open message reads in the full-screen dialog, the kind that saves nothing: an up arrow and no verb. -->
    <Md1Dialog v-model="reading" variant="full-screen">
      <Md1Dialog.Content>
        <div class="md1-demo-inbox-bar">
          <Md1Button aria-label="Back to the inbox" icon="arrow-back" @click="reading = false" />

          <Md1Dialog.Title>{{ current?.subject }}</Md1Dialog.Title>
        </div>

        <Md1InboxDetail
          v-if="current"
          :message="current"
          @archive="onArchiveOne"
          @attach="notify('Attachments are stubbed in this demo')"
          @reply="notify('Reply sent')"
        />
      </Md1Dialog.Content>
    </Md1Dialog>

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
  /* The page owns its height: each column scrolls inside it, so the window never moves on a tab change. */
  .md1-demo-inbox {
    display: flex;
    flex-direction: column;
    max-width: 840px;
    height: calc(100dvh - var(--md1-increment, 56px) - 2 * var(--md1-keyline-margin, 16px));
    margin-inline: auto;
  }

  @media (width < 960px) {
    .md1-demo-inbox {
      height: calc(100dvh - var(--md1-increment, 56px) - 2 * var(--md1-keyline-margin, 16px) - var(--md1-demo-seam, 0px));
    }
  }

  .md1-demo-inbox-layout {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  /* From 960 dp, the MD1-era web client: the list at the start, the reading pane at the end. */
  @media (min-width: 960px) {
    .md1-demo-inbox {
      max-width: 1280px;
    }

    .md1-demo-inbox-layout {
      display: grid;
      grid-template-columns: minmax(360px, 5fr) 7fr;
      gap: var(--md1-keyline-margin, 16px);
    }
  }

  .md1-demo-inbox-sheet {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-inbox-tabs {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
  }

  /* One 48 dp height for both states — the tab bar's, and the dense contextual bar's — so the swap moves nothing. */
  .md1-demo-inbox-head {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    justify-content: center;
    height: 48px;
  }

  /* The panels slide inside this box, clipped, never in the page's flow. */
  .md1-demo-inbox-swap {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: clip;
  }

  .md1-demo-inbox-panel {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Room under the last row for the 56 dp FAB and its margins, so no row hides behind it. */
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }

  .md1-demo-inbox-pane {
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* The reply footer must clear the fixed FAB, like the list's last row. */
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* An unread tile: the bolder ink of unread mail on the sender and its time, the secondary line at its full ink. */
  .md1-demo-inbox-unread .md1-list__primary,
  .md1-demo-inbox-unread .md1-demo-inbox-time {
    font-weight: 500;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* A read tile steps each line down one ink tier, so opening a message visibly quiets its row. */
  .md1-demo-inbox-read .md1-list__primary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-inbox-read .md1-list__secondary,
  .md1-demo-inbox-read .md1-demo-inbox-time {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* A chosen row carries the selection pattern's band, the data-table's checkbox-selection scrim. */
  .md1-demo-inbox-picked {
    background: var(--md1-list-selected, rgba(0, 0, 0, 0.07));
  }

  /* The end column stacks the time over the row's select checkbox. */
  .md1-demo-inbox-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .md1-demo-inbox-time {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The empty tab or pane: a 96 dp glyph in the disabled ink and a Subheading tagline. */
  .md1-demo-inbox-empty {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    height: 100%;
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

  /*
   * The reading dialog's app bar, the dialog docs' saved-immediately form: an
   * up arrow, the title on the keyline and no verb.
   */
  .md1-demo-inbox-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--md1-spacing-1, 8px) 0 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-demo-inbox-bar .md1-button[data-variant] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-demo-inbox-bar .md1-dialog__title {
    flex: 1 1 auto;
    padding: 0 0 0 20px;
    overflow: hidden;
    color: var(--md1-on-primary, #FFFFFF);
    text-overflow: ellipsis;
    white-space: nowrap;
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

  /* While the bottom bar shows, the fixed FAB clears its seam and still rises with the snackbar. */
  @media (width < 960px) {
    .md1-fab.md1-demo-inbox-fab {
      inset-block-end: calc(var(--md1-demo-seam, 0px) + var(--md1-keyline-margin, 16px) + var(--md1-snackbar-height, 0px));
    }
  }
</style>
