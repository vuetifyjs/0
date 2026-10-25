<script setup lang="ts">
  import { Md1ProgressLinear, Md1Ripple } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const THREADS = [
    { id: 'brunch', title: 'Brunch this weekend?', preview: 'Ali Connors: I’ll be in your neighbourhood doing errands', reply: 'Sounds good. 11 at the corner café?' },
    { id: 'bbq', title: 'Summer BBQ', preview: 'to Alex, Scott, Jennifer: Wish I could come, but I’m out of town', reply: 'Next time for sure. Save me a burger.' },
    { id: 'paris', title: 'Oui oui', preview: 'Sandra Adams: Do you have Paris recommendations?', reply: 'The Marais on a Sunday morning, before the crowds.' },
  ]

  const open = shallowRef<string>()
  const loading = shallowRef(false)

  const loaded = useTimer(() => {
    loading.value = false
  }, { duration: 1500 })

  function onThread (id: string) {
    if (open.value === id) {
      open.value = undefined
      loaded.stop()
      loading.value = false
      return
    }

    open.value = id
    loading.value = true
    loaded.start()
  }
</script>

<template>
  <div class="md1-docs-threads">
    <div
      v-for="thread in THREADS"
      :key="thread.id"
      class="md1-docs-thread"
      :data-open="open === thread.id || undefined"
    >
      <button
        :aria-expanded="open === thread.id"
        class="md1-docs-thread-head"
        type="button"
        @click="onThread(thread.id)"
      >
        <Md1Ripple />

        <span class="md1-docs-thread-title md1-type-subheading">{{ thread.title }}</span>

        <span v-if="open !== thread.id" class="md1-docs-thread-preview md1-type-body-1">{{ thread.preview }}</span>
      </button>

      <div v-if="open === thread.id" class="md1-docs-thread-body">
        <Md1ProgressLinear :active="loading" aria-label="Loading the conversation" class="md1-docs-thread-progress" />

        <p v-if="!loading" class="md1-docs-thread-text md1-type-body-1">{{ thread.preview }}</p>

        <p v-if="!loading" class="md1-docs-thread-text md1-type-body-1">{{ thread.reply }}</p>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-threads {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    padding: var(--md1-spacing-1, 8px) 0;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* A row is a 72 dp two-line tile on the list's 2 dp sheet; the open thread lifts out of it as a card at 8 dp with 16 dp above and below. */
  .md1-docs-thread {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    box-shadow: none;
    transition:
      margin var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-thread[data-open] {
    margin: var(--md1-spacing-2, 16px) 0;
    border-bottom-color: transparent;
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-thread-head {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 72px;
    padding: 0 var(--md1-spacing-2, 16px);
    overflow: hidden;
    border: 0;
    color: inherit;
    text-align: start;
    background: transparent;
    cursor: pointer;
  }

  .md1-docs-thread-head:focus-visible {
    outline: none;
    background: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-thread[data-open] .md1-docs-thread-head {
    min-height: 64px;
  }

  .md1-docs-thread[data-open] .md1-docs-thread-title {
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
  }

  .md1-docs-thread-preview {
    overflow: hidden;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .md1-docs-thread-body {
    position: relative;
    min-height: 4px;
    padding: 0 var(--md1-spacing-2, 16px);
  }

  /* The indicator runs along the card's edge under its header while the thread loads. */
  .md1-docs-thread-progress {
    position: absolute;
    inset-inline: 0;
    top: 0;
  }

  .md1-docs-thread-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px) 0;
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }
</style>
