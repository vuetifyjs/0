<script setup lang="ts">
  import { Md1List, Md1Toolbar } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const messages = [
    { id: 'brunch', from: 'Ali Connors', subject: 'Brunch this weekend?', body: 'I will be in your neighborhood doing errands this weekend. Do you want to grab brunch?' },
    { id: 'summer', from: 'Jennifer', subject: 'Summer BBQ', body: 'Wish I could come, but I am out of town this weekend.' },
    { id: 'oui', from: 'Sandra Adams', subject: 'Oui oui', body: 'Do you have Paris recommendations? Have you ever been?' },
  ]

  const current = shallowRef<string>()

  const message = toRef(() => messages.find(item => item.id === current.value))
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav v-if="message" aria-label="Inbox" icon="up" @click="current = undefined" />

      <Md1Toolbar.Nav v-else />

      <Md1Toolbar.Title>{{ message ? message.subject : 'Inbox' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <Transition mode="out-in" name="md1-docs-nav-child">
      <article v-if="message" :key="message.id" class="md1-docs-nav-detail">
        <div class="md1-docs-nav-paper md1-elevation-2">
          <p class="md1-docs-nav-from">{{ message.from }}</p>

          <p class="md1-docs-nav-body">{{ message.body }}</p>
        </div>
      </article>

      <div v-else class="md1-docs-nav-sheet">
        <Md1List :lines="2">
          <Md1List.Item v-for="item in messages" :key="item.id" @click="current = item.id">
            <Md1List.Avatar>{{ item.from[0] }}</Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ item.subject }}</Md1List.Primary>

              <Md1List.Secondary>{{ item.from }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>
    </Transition>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .md1-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-sheet {
    background: var(--md1-surface, #FFFFFF);
  }

  /* The child screen: a raised sheet that the parent-to-child transition expands into place. */
  .md1-docs-nav-detail {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .md1-docs-nav-paper {
    flex: 1 1 auto;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-nav-from {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-nav-body {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Parent to child: the touched surface lifts and expands from its origin on the standard curve. */
  .md1-docs-nav-child-enter-active,
  .md1-docs-nav-child-leave-active {
    transition:
      opacity var(--md1-duration-enter, 225ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-enter, 225ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    transform-origin: top center;
  }

  .md1-docs-nav-child-enter-from,
  .md1-docs-nav-child-leave-to {
    opacity: 0;
    transform: scaleY(0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-nav-child-enter-active,
    .md1-docs-nav-child-leave-active {
      transition: none;
    }
  }
</style>
