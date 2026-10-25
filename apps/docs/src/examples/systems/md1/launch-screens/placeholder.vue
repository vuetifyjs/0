<script setup lang="ts">
  import { Md1Button, Md1List, Md1Toolbar } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { onMounted, shallowRef } from 'vue'

  const MAIL = [
    { id: 'brunch', subject: 'Brunch this weekend?', from: 'Ali Connors' },
    { id: 'summer', subject: 'Summer BBQ', from: 'Trevor Hansen' },
    { id: 'oui', subject: 'Oui oui', from: 'Sandra Adams' },
    { id: 'birthday', subject: 'Birthday gift', from: 'Trevor Hansen' },
  ]

  // The structure is on screen from the first frame; the content follows once the app has loaded.
  const loaded = shallowRef(false)

  const load = useTimer(() => {
    loaded.value = true
  }, { duration: 1500 })

  function onLaunch () {
    loaded.value = false
    load.start()
  }

  onMounted(onLaunch)
</script>

<template>
  <div class="md1-docs-launch">
    <div :aria-busy="!loaded || undefined" class="md1-docs-screen md1-docs-launch-screen">
      <Md1Toolbar variant="primary">
        <template v-if="loaded">
          <Md1Toolbar.Nav aria-label="Open navigation" />

          <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

          <Md1Toolbar.Actions>
            <Md1Button aria-label="Search" icon="search" />
          </Md1Toolbar.Actions>
        </template>
      </Md1Toolbar>

      <Md1List v-if="loaded" aria-label="Inbox" :lines="2">
        <Md1List.Item v-for="message in MAIL" :key="message.id" href="#">
          <Md1List.Content>
            <Md1List.Primary>{{ message.subject }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.from }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Button :disabled="!loaded" variant="raised" @click="onLaunch">Launch again</Md1Button>
  </div>
</template>

<style>
  .md1-docs-launch {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  /* The content area is the theme's surface, blank until the content arrives. */
  .md1-docs-launch-screen {
    width: 100%;
    max-width: 360px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-surface, #FFFFFF);
  }
</style>
