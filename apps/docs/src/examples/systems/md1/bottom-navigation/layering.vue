<script setup lang="ts">
  import { Md1BottomNavigation, Md1BottomSheet, Md1Button, Md1Snackbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const view = shallowRef('music')
  const archived = shallowRef(false)
  const shared = shallowRef('')
</script>

<template>
  <div class="md1-docs-screen md1-docs-bottom-nav-layers">
    <div class="md1-docs-bottom-nav-layers-actions">
      <Md1Button variant="raised" @click="archived = true">Archive</Md1Button>

      <Md1BottomSheet>
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" variant="raised">Share</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1BottomSheet.Item icon="email" @click="shared = 'Email'">Email</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="link" @click="shared = 'Copy link'">Copy link</Md1BottomSheet.Item>

        <Md1BottomSheet.Item icon="send" @click="shared = 'Message'">Message</Md1BottomSheet.Item>
      </Md1BottomSheet>

      <span v-if="shared" class="md1-docs-note" role="status">Shared by {{ shared }}</span>
    </div>

    <Md1Snackbar.Portal class="md1-docs-bottom-nav-snackbars" :teleport="false">
      <Md1Snackbar v-model="archived" action="Undo">Archived</Md1Snackbar>
    </Md1Snackbar.Portal>

    <Md1BottomNavigation v-model="view" aria-label="Library">
      <Md1BottomNavigation.Action icon="play" label="Movies" value="movies" />

      <Md1BottomNavigation.Action icon="mic" label="Music" value="music" />

      <Md1BottomNavigation.Action icon="bookmark" label="Books" value="books" />

      <Md1BottomNavigation.Action icon="event" label="News" value="news" />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  .md1-docs-bottom-nav-layers {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bottom-nav-layers-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }

  /*
   * The queue stands on top of the 56 dp bar. The package already stacks
   * snackbars behind the bottom navigation, so one slides up from behind the
   * bar rather than over it.
   */
  .md1-docs-bottom-nav-snackbars {
    bottom: 56px;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
