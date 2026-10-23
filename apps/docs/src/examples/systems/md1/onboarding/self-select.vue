<script setup lang="ts">
  import { Md1Button, Md1List } from '@paper/md1'

  import { ref, shallowRef } from 'vue'

  const topics = [
    { id: 'science', label: 'Science', icon: 'language' },
    { id: 'travel', label: 'Travel', icon: 'place' },
    { id: 'food', label: 'Food and drink', icon: 'favorite' },
    { id: 'music', label: 'Music', icon: 'play-arrow' },
    { id: 'sport', label: 'Sport', icon: 'star' },
    { id: 'books', label: 'Books', icon: 'bookmark' },
  ] as const

  const picked = ref<string[]>(['travel'])
  const sent = shallowRef(false)
</script>

<template>
  <div class="md1-docs-onboarding-stack">
    <div class="md1-docs-self-select-screen">
      <div class="md1-docs-self-select-intro">
        <h3 class="md1-docs-self-select-headline md1-type-headline">What do you like to read about?</h3>

        <p class="md1-docs-self-select-subhead">Your front page starts with these topics</p>
      </div>

      <Md1List v-model="picked" aria-label="Topics" select="multiple">
        <Md1List.Item v-for="topic in topics" :key="topic.id" :value="topic.id">
          <Md1List.Icon :name="topic.icon" />

          <Md1List.Content>
            <Md1List.Primary>{{ topic.label }}</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <div class="md1-docs-self-select-actions">
        <Md1Button variant="raised" @click="sent = true">Next</Md1Button>
      </div>
    </div>

    <span v-if="sent" class="md1-docs-onboarding-note" role="status">Following {{ picked.length }} {{ picked.length === 1 ? 'topic' : 'topics' }}</span>
  </div>
</template>

<style>
  .md1-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A handset screen on the surface colour: one self-select screen, fewer than ten choices. */
  .md1-docs-self-select-screen {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-self-select-intro {
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-self-select-headline {
    margin: 0;
  }

  .md1-docs-self-select-subhead {
    margin: var(--md1-spacing-1, 8px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The action that leaves the screen sits at the end edge, 16 dp in. */
  .md1-docs-self-select-actions {
    display: flex;
    justify-content: flex-end;
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-onboarding-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
