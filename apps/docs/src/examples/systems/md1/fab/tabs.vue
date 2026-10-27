<script setup lang="ts">
  import { Md1Fab, Md1Tabs } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const ACTIONS = {
    call: { icon: 'phone', label: 'Open the dial pad' },
    add: { icon: 'person-add', label: 'Add a contact' },
  } as const

  const TABS = [
    { value: 'speed-dial', label: 'Speed dial', action: 'call', body: 'Mom, Alex and the office, one press away.' },
    { value: 'recents', label: 'Recents', action: 'call', body: 'Missed call from Jordan Lee, 10 minutes ago.' },
    { value: 'contacts', label: 'Contacts', action: 'add', body: '248 contacts, synced from your account.' },
  ] as const

  const tab = shallowRef<string>('speed-dial')

  // The FAB is keyed on its action, not the tab: a new action remounts it and plays the entrance; a shared one leaves it alone.
  const action = toRef(() => TABS.find(item => item.value === tab.value)?.action ?? 'call')
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen">
    <Md1Tabs v-model="tab">
      <Md1Tabs.List label="Phone">
        <Md1Tabs.Item v-for="item in TABS" :key="item.value" :label="item.label" :value="item.value" />
      </Md1Tabs.List>

      <Md1Tabs.Panel
        v-for="item in TABS"
        :key="item.value"
        class="md1-docs-fab-tab-panel"
        :value="item.value"
      >
        {{ item.body }}
      </Md1Tabs.Panel>
    </Md1Tabs>

    <Md1Fab
      :key="action"
      :aria-label="ACTIONS[action].label"
      :data-action="action"
      :icon="ACTIONS[action].icon"
    />
  </div>
</template>

<style>
  /* Each tab's screen: Body 1 in secondary ink under the bar, the FAB floating over it at the end keyline. */
  .md1-docs-fab-tab-panel {
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }
</style>
