<script setup lang="ts">
  import { Md1BottomNavigation } from '@paper/md1'
  import { shallowRef } from 'vue'

  const view = shallowRef('inbox')

  const messages = Array.from({ length: 24 }, (_, index) => `Message ${index + 1}: scroll down to hide the bar, up to bring it back.`)
</script>

<template>
  <div class="md1-docs-screen md1-docs-bottom-nav-screen">
    <div class="md1-docs-bottom-nav-scroller">
      <p v-for="message in messages" :key="message" class="md1-docs-bottom-nav-view">
        {{ message }}
      </p>
    </div>

    <Md1BottomNavigation v-model="view" aria-label="Mail" hide-on-scroll>
      <Md1BottomNavigation.Action icon="inbox" label="Inbox" value="inbox" />

      <Md1BottomNavigation.Action icon="send" label="Sent" value="sent" />

      <Md1BottomNavigation.Action icon="drafts" label="Drafts" value="drafts" />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  .md1-docs-bottom-nav-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bottom-nav-scroller {
    height: 100%;
    overflow-y: auto;
    padding-block-end: 56px;
    box-sizing: border-box;
  }

  .md1-docs-bottom-nav-view {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
