<script setup lang="ts">
  import { QuList, QuToolbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-nav-screen">
    <QuToolbar variant="primary">
      <QuToolbar.Nav v-if="message" aria-label="Inbox" icon="up" @click="current = undefined" />

      <QuToolbar.Nav v-else />

      <QuToolbar.Title>{{ message ? message.subject : 'Inbox' }}</QuToolbar.Title>
    </QuToolbar>

    <Transition mode="out-in" name="quantum-docs-nav-child">
      <article v-if="message" :key="message.id" class="quantum-docs-nav-detail">
        <div class="quantum-docs-nav-paper quantum-elevation-2">
          <p class="quantum-docs-nav-from">{{ message.from }}</p>

          <p class="quantum-docs-nav-body">{{ message.body }}</p>
        </div>
      </article>

      <div v-else class="quantum-docs-nav-sheet">
        <QuList :lines="2">
          <QuList.Item v-for="item in messages" :key="item.id" @click="current = item.id">
            <QuList.Avatar>{{ item.from[0] }}</QuList.Avatar>

            <QuList.Content>
              <QuList.Primary>{{ item.subject }}</QuList.Primary>

              <QuList.Secondary>{{ item.from }}</QuList.Secondary>
            </QuList.Content>
          </QuList.Item>
        </QuList>
      </div>
    </Transition>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .quantum-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-sheet {
    background: var(--quantum-surface, #FFFFFF);
  }

  /* The child screen: a raised sheet that the parent-to-child transition expands into place. */
  .quantum-docs-nav-detail {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .quantum-docs-nav-paper {
    flex: 1 1 auto;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-docs-nav-from {
    margin: 0 0 var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    line-height: var(--quantum-type-body-2-leading, 24px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-nav-body {
    margin: 0;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Parent to child: the touched surface lifts and expands from its origin on the standard curve. */
  .quantum-docs-nav-child-enter-active,
  .quantum-docs-nav-child-leave-active {
    transition:
      opacity var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    transform-origin: top center;
  }

  .quantum-docs-nav-child-enter-from,
  .quantum-docs-nav-child-leave-to {
    opacity: 0;
    transform: scaleY(0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-nav-child-enter-active,
    .quantum-docs-nav-child-leave-active {
      transition: none;
    }
  }
</style>
