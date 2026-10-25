<script setup lang="ts">
  import { Md1Button, Md1List } from '@paper/md1'
  import { useMediaQuery } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const messages = [
    { id: 'brunch', from: 'Ali Connors', subject: 'Brunch this weekend?', body: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?' },
    { id: 'summer', from: 'Trevor Hansen', subject: 'Summer BBQ', body: 'Wish I could come, but I\'m out of town this weekend.' },
    { id: 'oui', from: 'Sandra Adams', subject: 'Oui oui', body: 'Do you have Paris recommendations? Have you ever been?' },
  ]

  // Over 600 dp a layout shows two levels of hierarchy, summary and detail; under it, one.
  const query = useMediaQuery('(min-width: 600px)')
  const wide = toRef(() => query.matches.value)

  const current = shallowRef<string>()
  const open = toRef(() => messages.find(message => message.id === current.value))
  const shown = toRef(() => wide.value ? (open.value ?? messages[0]) : open.value)
</script>

<template>
  <div class="md1-docs-divide md1-elevation-2" :data-wide="wide || undefined">
    <div v-if="wide || !shown" class="md1-docs-divide-list">
      <Md1List v-model="current" :lines="2">
        <Md1List.Item v-for="message in messages" :key="message.id" :value="message.id">
          <Md1List.Content>
            <Md1List.Primary>{{ message.from }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <article v-if="shown" class="md1-docs-divide-detail">
      <Md1Button v-if="!wide" icon="arrow-back" aria-label="Back to inbox" @click="current = undefined" />

      <h3 class="md1-type-title">{{ shown.subject }}</h3>

      <p class="md1-type-body-1 md1-docs-divide-from">{{ shown.from }}</p>

      <p class="md1-type-body-1">{{ shown.body }}</p>
    </article>
  </div>
</template>

<style>
  /* One sheet: the list alone on a handset, list and detail divided from 600 dp. */
  .md1-docs-divide {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: calc(4 * var(--md1-increment, 56px));
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-divide-list {
    flex: 1 1 auto;
  }

  /* Divided: the list keeps five increments and a 1 dp divider seam stands between the panes. */
  .md1-docs-divide[data-wide] .md1-docs-divide-list {
    flex: 0 0 calc(5 * var(--md1-increment, 64px));
    border-inline-end: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-divide-detail {
    flex: 1 1 auto;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
  }

  .md1-docs-divide-detail > h3,
  .md1-docs-divide-detail > p {
    margin: 0 0 var(--md1-spacing-1, 8px);
  }

  .md1-docs-divide-from {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
