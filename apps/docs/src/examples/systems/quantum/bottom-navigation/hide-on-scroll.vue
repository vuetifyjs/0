<script setup lang="ts">
  import { QuBottomNavigation } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const view = shallowRef('inbox')

  const messages = Array.from({ length: 24 }, (_, index) => `Message ${index + 1}: scroll down to hide the bar, up to bring it back.`)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-bottom-nav-screen">
    <div class="quantum-docs-bottom-nav-scroller">
      <p v-for="message in messages" :key="message" class="quantum-docs-bottom-nav-view">
        {{ message }}
      </p>
    </div>

    <QuBottomNavigation v-model="view" aria-label="Mail" hide-on-scroll>
      <QuBottomNavigation.Action icon="inbox" label="Inbox" value="inbox" />

      <QuBottomNavigation.Action icon="send" label="Sent" value="sent" />

      <QuBottomNavigation.Action icon="drafts" label="Drafts" value="drafts" />
    </QuBottomNavigation>
  </div>
</template>

<style>
  .quantum-docs-bottom-nav-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-bottom-nav-scroller {
    height: 100%;
    overflow-y: auto;
    padding-block-end: 56px;
    box-sizing: border-box;
  }

  .quantum-docs-bottom-nav-view {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
