<script setup lang="ts">
  import { QuList, QuNavigationDrawer, QuToolbar, quantumBreakpoints } from '@paper/quantum'
  import { useBreakpoints } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

  const { width } = useBreakpoints()

  // The recommended mapping: temporary on handsets, persistent on tablets, permanent on desktop.
  const type = toRef(() => {
    if (width.value < quantumBreakpoints[600]) return 'temporary'
    if (width.value < quantumBreakpoints[1280]) return 'persistent'

    return 'permanent'
  })

  const open = shallowRef(false)
  const page = shallowRef('inbox')

  // A drawer that changes type starts closed, so a handset never opens on a scrim.
  watch(type, () => {
    open.value = false
  })
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
    <QuNavigationDrawer v-model="open" :type>
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Item value="inbox">
            <QuList.Icon name="inbox" />

            Inbox
          </QuList.Item>

          <QuList.Item value="starred">
            <QuList.Icon name="star" />

            Starred
          </QuList.Item>

          <QuList.Item value="sent">
            <QuList.Icon name="send" />

            Sent mail
          </QuList.Item>

          <QuList.Item value="drafts">
            <QuList.Icon name="drafts" />

            Drafts
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-drawer-column">
      <QuToolbar variant="primary">
        <QuToolbar.Nav v-if="type !== 'permanent'" aria-label="Navigation" :open @click="open = !open" />

        <QuToolbar.Title>Mail</QuToolbar.Title>
      </QuToolbar>

      <p class="quantum-docs-drawer-text" role="status">{{ width }} px wide: a {{ type }} drawer.</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-drawer-screen {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-docs-drawer-text {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
