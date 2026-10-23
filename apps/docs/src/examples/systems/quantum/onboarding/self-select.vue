<script setup lang="ts">
  import { QuButton, QuList } from '@paper/quantum'

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
  <div class="quantum-docs-onboarding-stack">
    <div class="quantum-docs-self-select-screen">
      <div class="quantum-docs-self-select-intro">
        <h3 class="quantum-docs-self-select-headline quantum-type-headline">What do you like to read about?</h3>

        <p class="quantum-docs-self-select-subhead">Your front page starts with these topics</p>
      </div>

      <QuList v-model="picked" aria-label="Topics" select="multiple">
        <QuList.Item v-for="topic in topics" :key="topic.id" :value="topic.id">
          <QuList.Icon :name="topic.icon" />

          <QuList.Content>
            <QuList.Primary>{{ topic.label }}</QuList.Primary>
          </QuList.Content>
        </QuList.Item>
      </QuList>

      <div class="quantum-docs-self-select-actions">
        <QuButton variant="raised" @click="sent = true">Next</QuButton>
      </div>
    </div>

    <span v-if="sent" class="quantum-docs-onboarding-note" role="status">Following {{ picked.length }} {{ picked.length === 1 ? 'topic' : 'topics' }}</span>
  </div>
</template>

<style>
  .quantum-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A handset screen on the surface colour: one self-select screen, fewer than ten choices. */
  .quantum-docs-self-select-screen {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-self-select-intro {
    padding: var(--quantum-spacing-3, 24px) var(--quantum-keyline-margin, 16px) var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-self-select-headline {
    margin: 0;
  }

  .quantum-docs-self-select-subhead {
    margin: var(--quantum-spacing-1, 8px) 0 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The action that leaves the screen sits at the end edge, 16 dp in. */
  .quantum-docs-self-select-actions {
    display: flex;
    justify-content: flex-end;
    padding: var(--quantum-spacing-1, 8px) var(--quantum-keyline-margin, 16px) var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-onboarding-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
