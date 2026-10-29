<script lang="ts">
  import { Md1Button, Md1Chip, Md1Icon, Md1Menu, Md1ProgressLinear, Md1Snackbar, Md1TextField, Md1Tooltip } from '@paper/md1'

  // Framework
  import { useTimer } from '@vuetify/v0'

  import { assistant, contacts, files, messages, orders, profile } from './Md1Data'

  // Utilities
  import { nextTick, onMounted, onUnmounted, shallowRef, toRef, useTemplateRef } from 'vue'

  const suggestions = [
    'Summarize this week\'s orders',
    'How many unread messages do I have?',
    'What changed in files recently?',
  ]

  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  const fallback = 'I can summarize orders, files, contacts and your inbox. Try one of the suggestions below the thread.'

  /*
   * The reply being typed. Module state, not page state: the store's `busy`
   * survives navigation, so the text it owes must survive the page instance
   * that asked for it.
   */
  const owed = { text: '' }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Assistant' })

  const me = toRef(() => profile.me.value)
  const thread = toRef(() => assistant.thread.value)
  const busy = assistant.busy

  const draft = shallowRef('')
  const stubbed = shallowRef(false)

  const region = useTemplateRef<HTMLElement>('region')

  /** The canned agent, keyed loosely to the prompt and citing the live stores. */
  function respond (prompt: string): string {
    const asked = prompt.toLowerCase()

    if (asked.includes('order')) {
      const open = orders.all.value.filter(order => order.status === 'Processing').length
      const total = orders.all.value.reduce((sum, order) => sum + order.total, 0)

      return `You have ${orders.all.value.length} orders on the books worth ${money.format(total)}; ${open} are still processing.`
    }

    if (asked.includes('message') || asked.includes('inbox') || asked.includes('unread')) {
      const unread = messages.all.value.filter(message => message.unread).length

      return `You have ${unread} unread of ${messages.all.value.length} messages in the inbox.`
    }

    if (asked.includes('file')) {
      const latest = files.all.value.find(entry => entry.kind !== 'folder')

      return latest
        ? `${files.all.value.length} entries are synced. The newest file is "${latest.name}" (${latest.meta}).`
        : `${files.all.value.length} entries are synced.`
    }

    if (asked.includes('contact')) {
      const work = contacts.all.value.filter(contact => contact.label === 'Work').length

      return `You have ${contacts.all.value.length} contacts; ${work} are labelled Work.`
    }

    return fallback
  }

  /** Land the owed reply and release the composer; safe to call twice. */
  function settle () {
    if (!busy.value) return

    assistant.reply(owed.text || fallback)
    owed.text = ''
    busy.value = false
  }

  /*
   * A page instance that leaves mid-reply (navigation, or a dev-server update
   * replacing it) takes its timer with it; the reply lands now instead of never.
   */
  onUnmounted(settle)

  // A session stranded busy by an older page instance heals on arrival.
  settle()

  async function follow () {
    await nextTick()

    region.value?.scrollTo({ top: region.value.scrollHeight })
  }

  const timer = useTimer(() => {
    settle()
    follow()
  }, { duration: 1500 })

  function onSend () {
    const text = draft.value.trim()

    if (!text || busy.value) return

    assistant.send(text)
    draft.value = ''
    // The answer reads the stores as they are at ask time.
    owed.text = respond(text)
    busy.value = true
    timer.start()
    follow()
  }

  function onSuggest (text: string) {
    draft.value = text
  }

  onMounted(follow)
</script>

<template>
  <section class="md1-demo-assistant">
    <div class="md1-demo-assistant__sheet md1-elevation-2">
      <div
        v-if="thread.length > 0"
        ref="region"
        aria-label="Conversation"
        class="md1-demo-assistant__thread"
        role="log"
      >
        <div v-for="turn in thread" :key="turn.id" class="md1-demo-assistant__turn">
          <img
            v-if="turn.role === 'user' && me.avatar"
            alt=""
            class="md1-demo-assistant__face"
            :src="me.avatar"
          >

          <div
            v-else
            aria-hidden="true"
            class="md1-demo-assistant__face"
            :data-role="turn.role"
          >{{ turn.role === 'agent' ? 'Q' : me.name.charAt(0) }}</div>

          <div class="md1-demo-assistant__body">
            <p class="md1-demo-assistant__meta">{{ turn.role === 'agent' ? 'Quanta' : me.name }} · {{ turn.at }}</p>

            <p class="md1-demo-assistant__text">{{ turn.text }}</p>
          </div>
        </div>
      </div>

      <div v-else ref="region" class="md1-demo-assistant__empty">
        <Md1Icon class="md1-demo-assistant__art" name="help-outline" />

        <p class="md1-demo-assistant__tagline">Ask anything about your workspace — answers land here</p>
      </div>

      <!-- The strip holds its 4 dp whether or not the agent is typing, so nothing jumps. -->
      <div class="md1-demo-assistant__busy">
        <Md1ProgressLinear :active="busy" aria-label="The assistant is replying" />
      </div>

      <div class="md1-demo-assistant__chips">
        <Md1Chip
          v-for="suggestion in suggestions"
          :key="suggestion"
          @click="onSuggest(suggestion)"
        >
          {{ suggestion }}
        </Md1Chip>
      </div>

      <div class="md1-demo-assistant__composer">
        <Md1TextField
          v-model="draft"
          aria-label="Ask a question"
          class="md1-demo-assistant__field"
          multiline
          placeholder="Ask a question…"
          @keydown.enter.exact.prevent="onSend"
        />

        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs">Attach</Md1Button>
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item @select="stubbed = true">Upload from computer</Md1Menu.Item>

            <Md1Menu.Item @select="stubbed = true">Add from Files</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>

        <Md1Tooltip>
          <Md1Tooltip.Activator v-slot="{ attrs }">
            <Md1Button
              v-bind="attrs"
              aria-label="Send"
              :disabled="busy || draft.trim().length === 0"
              icon="send"
              @click="onSend"
            />
          </Md1Tooltip.Activator>

          <Md1Tooltip.Content>Send</Md1Tooltip.Content>
        </Md1Tooltip>
      </div>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="stubbed">Attachments are stubbed in this demo</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  /* The page owns its height so the thread scrolls inside it and the composer stays put. */
  .md1-demo-assistant {
    display: flex;
    flex-direction: column;
    max-width: 840px;
    height: calc(100dvh - var(--md1-increment, 56px) - 2 * var(--md1-keyline-margin, 16px));
    margin-inline: auto;
  }

  /* The bottom bar's seam is already cleared by the shell's main padding; the sheet just stops above it. */
  @media (width < 960px) {
    .md1-demo-assistant {
      height: calc(100dvh - var(--md1-increment, 56px) - 2 * var(--md1-keyline-margin, 16px) - var(--md1-demo-seam, 0px));
    }
  }

  .md1-demo-assistant__sheet {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-assistant__thread {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    min-height: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-demo-assistant__turn {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
  }

  /* The 40 dp avatar: the account picture, or an initial — Quanta's on the primary, the user's on Grey 400. */
  .md1-demo-assistant__face {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    background: #BDBDBD;
    color: #FFFFFF;
    font-size: var(--md1-type-subheading-size, 16px);
  }

  .md1-demo-assistant__face[data-role='agent'] {
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-demo-assistant__body {
    min-width: 0;
  }

  .md1-demo-assistant__meta {
    margin: 0 0 2px;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-assistant__text {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .md1-demo-assistant__empty {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  .md1-demo-assistant__art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-demo-assistant__tagline {
    max-width: 280px;
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-assistant__busy {
    height: 4px;
  }

  .md1-demo-assistant__chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) 0;
  }

  .md1-demo-assistant__composer {
    display: flex;
    gap: var(--md1-spacing-1, 8px);
    align-items: flex-end;
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-demo-assistant__field {
    flex: 1 1 auto;
    min-width: 0;
  }
</style>
