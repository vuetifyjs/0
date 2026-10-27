<script setup lang="ts">
  import { Md1Button, Md1Divider, Md1FeatureDiscovery, Md1List, Md1NavigationDrawer, Md1Snackbar, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  type Step = 'idle' | 'prompt' | 'drawer' | 'settings' | 'done'

  const step = shallowRef<Step>('idle')
  const prompt = shallowRef(false)
  const drawer = shallowRef(false)
  const screen = shallowRef<'labs' | 'settings'>('labs')
  const backup = shallowRef(false)
  const toast = shallowRef(false)

  function onStart () {
    backup.value = false
    screen.value = 'labs'
    step.value = 'prompt'
    prompt.value = true
  }

  // Step 1, the tap target: the reader taps the promoted menu icon, and the drawer opens.
  function onMenu () {
    drawer.value = true

    if (step.value === 'prompt') step.value = 'drawer'
  }

  function onDismiss () {
    step.value = 'idle'
  }

  // Step 2, a ripple on Settings: the next tap in the flow.
  function onSettings () {
    drawer.value = false
    screen.value = 'settings'

    if (step.value === 'drawer') step.value = 'settings'
  }

  // Step 3, a ripple on the switch; turning it on finishes the flow with a toast.
  function onBackup (value: boolean | undefined) {
    backup.value = !!value

    if (value && step.value === 'settings') {
      step.value = 'done'
      toast.value = true
    }
  }

  // The toast's action returns the reader to where the tap target appeared.
  function onReturn () {
    screen.value = 'labs'
    step.value = 'idle'
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-guided">
    <Md1Toolbar variant="primary">
      <Md1FeatureDiscovery v-model="prompt" @dismiss="onDismiss">
        <Md1FeatureDiscovery.Activator>
          <Md1Toolbar.Nav aria-label="Open navigation" @click="onMenu" />
        </Md1FeatureDiscovery.Activator>

        <Md1FeatureDiscovery.Title>Just how you want it</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>Tap the menu icon to switch accounts, change settings and more.</Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>

      <Md1Toolbar.Title>{{ screen === 'settings' ? 'Settings' : 'Laboratory' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <div v-if="screen === 'settings'" class="md1-docs-guided-body">
      <Md1List aria-label="Backup" :lines="2">
        <Md1List.Item class="md1-docs-guided-row" :data-guide="step === 'settings' || undefined">
          <Md1List.Content>
            <Md1List.Primary>Automatic backup</Md1List.Primary>

            <Md1List.Secondary>{{ backup ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch aria-label="Automatic backup" :model-value="backup" @update:model-value="onBackup" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </div>

    <div v-else class="md1-docs-guided-body md1-docs-guided-start">
      <Md1Button :disabled="step !== 'idle' && step !== 'done'" variant="raised" @click="onStart">Start the guided flow</Md1Button>
    </div>

    <Md1NavigationDrawer v-model="drawer" aria-label="Laboratory">
      <Md1NavigationDrawer.Content>
        <Md1List :model-value="screen === 'settings' ? 'settings' : 'bundles'">
          <Md1List.Item value="bundles" @click="screen = 'labs'; drawer = false">
            <Md1List.Icon name="folder" />

            Bundles
          </Md1List.Item>

          <Md1List.Item value="public" @click="drawer = false">
            <Md1List.Icon name="language" />

            Public labs
          </Md1List.Item>
        </Md1List>

        <Md1Divider />

        <Md1List>
          <Md1List.Item class="md1-docs-guided-row" :data-guide="step === 'drawer' || undefined" value="settings" @click="onSettings">
            <Md1List.Icon name="settings" />

            Settings
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="toast" action="Back to labs" @action="onReturn">Automatic backup is on</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-screen.md1-docs-guided {
    display: flex;
    flex-direction: column;
    height: 440px;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-guided-body {
    flex: 1 1 auto;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-guided-start {
    display: grid;
    place-items: center;
    background: none;
  }

  /*
   * The guiding ripple: a circle in the tap target's colour that grows and
   * fades from the next control, over and over, until the reader takes the
   * step. It sits behind the row's content and never blocks the tap.
   */
  .md1-docs-guided-row[data-guide] {
    position: relative;
    isolation: isolate;
  }

  .md1-docs-guided-row[data-guide]::before {
    content: '';
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 24px;
    z-index: -1;
    width: 48px;
    height: 48px;
    margin-block-start: -24px;
    border-radius: 50%;
    background: var(--md1-primary, #3F51B5);
    pointer-events: none;
    animation: md1-docs-guided-ripple 1500ms var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) infinite;
  }

  /* In the drawer the next step is the whole row, so the ripple starts at its icon. */
  .md1-navigation-drawer .md1-docs-guided-row[data-guide]::before {
    inset-inline: 4px auto;
  }

  @keyframes md1-docs-guided-ripple {
    from {
      opacity: 0.4;
      transform: scale(0.5);
    }

    to {
      opacity: 0;
      transform: scale(2.5);
    }
  }

  /* Under reduced motion the ripple holds still as a tinted ring around the next control. */
  @media (prefers-reduced-motion: reduce) {
    .md1-docs-guided-row[data-guide]::before {
      opacity: 0.24;
      animation: none;
    }
  }
</style>
