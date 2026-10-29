<script lang="ts">
  import { Md1Button, Md1Dialog, Md1Divider, Md1ExpansionPanel, Md1Icon, Md1List, Md1Radio, Md1SearchBar, Md1Snackbar, Md1Subheader, Md1TextField } from '@paper/md1'

  // Framework
  import { createFilter, isString } from '@vuetify/v0'

  // Utilities
  import { shallowRef, watch } from 'vue'

  type Topic = {
    title: string
    lede: string
    body: string[]
  }

  const topics: Topic[] = [
    {
      title: 'Get started with your dashboard',
      lede: 'One place for your inbox, orders and files',
      body: [
        'The overview page gathers the numbers that change during the day: storage, bandwidth, sessions and errors, with the week\'s traffic drawn underneath.',
        'The navigation drawer reaches every area. On a phone it slides over the content; on a desktop it stays open beside it.',
      ],
    },
    {
      title: 'Archive and restore messages',
      lede: 'The inbox keeps archived mail out of sight, not gone',
      body: [
        'Press the check on a message to archive it. A confirmation appears along the bottom edge with an Undo action for a few seconds.',
        'Undo puts the message back exactly where it was. Once the confirmation leaves, the message stays archived.',
      ],
    },
    {
      title: 'Track an order',
      lede: 'Every order carries its state in the list',
      body: [
        'The orders page lists each order with its current state. Open one to see the items, the shipping address and the dates it moved.',
        'Orders you place from the dashboard appear at the top of the list at once.',
      ],
    },
    {
      title: 'Manage synced files',
      lede: 'Files follow you between devices',
      body: [
        'The files page shows everything synced to your account. Each row carries the size and when it last changed.',
        'Remove a file from one device and it stays in your account until you delete it everywhere.',
      ],
    },
    {
      title: 'Change your sync frequency',
      lede: 'Trade freshness for battery',
      body: [
        'Settings holds the sync frequency under Data & storage. Choose a longer interval to save battery, or Manual only to sync when you ask.',
        'A manual sync always runs at once, whatever the frequency.',
      ],
    },
    {
      title: 'Keep your data on Wi-Fi',
      lede: 'Large downloads can wait for a better connection',
      body: [
        'Turn on Download over Wi-Fi only in Settings and large files queue until a Wi-Fi connection returns.',
        'Queued downloads start on their own; there is nothing to press.',
      ],
    },
  ]

  type Question = {
    value: string
    label: string
    answer: string
  }

  const questions: Question[] = [
    {
      value: 'offline',
      label: 'Does the dashboard work offline?',
      answer: 'Pages you have opened keep working and your changes queue locally. Everything syncs the next time a connection returns.',
    },
    {
      value: 'devices',
      label: 'How many devices can I sign in on?',
      answer: 'As many as you like. Settings and contacts follow your account, and each device keeps its own theme.',
    },
    {
      value: 'storage',
      label: 'What counts against my storage?',
      answer: 'Synced files and mail attachments. Archived messages and orders are bookkeeping and take no meaningful space.',
    },
    {
      value: 'delete',
      label: 'Can I delete my account?',
      answer: 'Yes. Clearing local data removes this device\'s copy; deleting the account removes everything synced to it after a two-week grace period.',
    },
  ]

  const categories = ['Problem', 'Suggestion', 'Praise']

  function text (value: unknown) {
    return isString(value) ? value : ''
  }

  /** The topic search, on v0's createFilter — the same engine the store's cross-page search uses. */
  const engine = createFilter<Topic>({ keys: ['title', 'lede'] })
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Help' })

  // Search over the popular topics
  const query = shallowRef('')

  const found = engine.apply(query, () => topics).items

  // The article dialog
  const reading = shallowRef(false)
  const article = shallowRef<Topic>()

  function onRead (topic: Topic) {
    article.value = topic
    reading.value = true
  }

  // The FAQ panels
  const panel = shallowRef<string>()

  // The feedback dialog
  const feedbacking = shallowRef(false)
  const comment = shallowRef<unknown>()
  const category = shallowRef('Problem')
  const sent = shallowRef(false)

  /*
   * Every opening starts from a blank form, committed model included: the
   * dialog reopens on its committed value, so sent feedback would otherwise
   * arrive with Send already enabled.
   */
  watch(feedbacking, value => {
    if (!value) return

    comment.value = undefined
    category.value = 'Problem'
  })

  function onFeedback () {
    sent.value = true
  }
</script>

<template>
  <section class="md1-demo-help">
    <div class="md1-demo-help-search">
      <Md1SearchBar v-model="query" placeholder="Search help">
        <Md1SearchBar.Item v-for="topic in topics" :key="topic.title" :value="topic.title" />

        <Md1SearchBar.Empty v-slot="{ query: missed }">No help topics match "{{ missed }}"</Md1SearchBar.Empty>
      </Md1SearchBar>
    </div>

    <div class="md1-demo-help-sheet md1-elevation-2">
      <Md1Subheader inset :sticky="false">Popular topics</Md1Subheader>

      <Md1List v-if="found.length > 0" aria-label="Popular topics">
        <Md1List.Item
          v-for="topic in found"
          :key="topic.title"
          aria-haspopup="dialog"
          @click="onRead(topic)"
        >
          {{ topic.title }}

          <Md1List.Action>
            <Md1Icon class="md1-demo-help-chevron" name="chevron-right" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>

      <p v-else class="md1-demo-help-none" role="status">No topics match your search</p>

      <Md1Divider />

      <Md1Subheader inset :sticky="false">Frequently asked</Md1Subheader>

      <div class="md1-demo-help-faq">
        <Md1ExpansionPanel v-model="panel">
          <Md1ExpansionPanel.Item v-for="question in questions" :key="question.value" :value="question.value">
            <Md1ExpansionPanel.Header :label="question.label" />

            <Md1ExpansionPanel.Content>
              {{ question.answer }}
            </Md1ExpansionPanel.Content>
          </Md1ExpansionPanel.Item>
        </Md1ExpansionPanel>
      </div>

      <Md1Divider />

      <div class="md1-demo-help-foot">
        <Md1Button @click="feedbacking = true">Send feedback</Md1Button>

        <p class="md1-demo-help-version">Version 1.0.0 · Material Design 1 demo</p>
      </div>
    </div>

    <Md1Dialog v-model="reading" variant="simple">
      <Md1Dialog.Content>
        <Md1Dialog.Title>{{ article?.title }}</Md1Dialog.Title>

        <Md1Dialog.Text>
          <div v-if="article" class="md1-demo-help-article">
            <p class="md1-demo-help-lede">{{ article.lede }}</p>

            <p v-for="line in article.body" :key="line" class="md1-demo-help-line">{{ line }}</p>
          </div>
        </Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Close</Md1Dialog.Cancel>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Dialog v-slot="{ value, commit }" v-model="feedbacking" v-model:value="comment" variant="confirmation">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Send feedback</Md1Dialog.Title>

        <Md1Radio.Group v-model="category" aria-label="Category" class="md1-demo-help-category">
          <Md1Radio v-for="item in categories" :key="item" :label="item" :value="item" />
        </Md1Radio.Group>

        <div class="md1-demo-help-form">
          <Md1TextField
            helper="Don't include passwords or other personal details"
            label="Describe your issue or share an idea"
            :model-value="text(value)"
            multiline
            @update:model-value="commit"
          />
        </div>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm :disabled="text(value).trim().length === 0" @confirm="onFeedback">Send</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="sent">Feedback sent</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-help {
    max-width: 840px;
    margin-inline: auto;
  }

  .md1-demo-help-sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The search bar sits on the page background above the sheet, so its 2 dp sheet reads as raised. */
  .md1-demo-help-search {
    margin-bottom: var(--md1-keyline-margin, 16px);
  }

  .md1-demo-help-chevron {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-help-none {
    margin: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px) var(--md1-spacing-3, 24px);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-help-faq {
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-3, 24px);
  }

  .md1-demo-help-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  /* The version line at the foot, in Caption at the secondary ink. */
  .md1-demo-help-version {
    margin: 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-help-article {
    width: 380px;
    max-width: 100%;
  }

  .md1-demo-help-lede {
    margin: 0 0 var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-help-line {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-demo-help-line:last-child {
    margin-bottom: 0;
  }

  /* The dialog's radios and field sit on its 24 dp content keyline. */
  .md1-demo-help-category {
    padding: 0 var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px);
  }

  .md1-demo-help-form {
    box-sizing: border-box;
    width: 400px;
    max-width: 100%;
    padding: 0 var(--md1-spacing-3, 24px);
  }
</style>
