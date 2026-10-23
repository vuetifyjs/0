<script setup lang="ts">
  import { Md1List, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const screen = shallowRef<'settings' | 'languages'>('settings')
  const spell = shallowRef(true)
  const autofill = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-settings-screen">
    <template v-if="screen === 'settings'">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Home" icon="up" />

        <Md1Toolbar.Title>Settings</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-settings-body">
        <Md1List :lines="2">
          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Display</Md1List.Primary>

              <Md1List.Secondary>Adaptive brightness on</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item inset @click="screen = 'languages'">
            <Md1List.Content>
              <Md1List.Primary>Languages & input</Md1List.Primary>

              <Md1List.Secondary>English (United States)</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Storage</Md1List.Primary>

              <Md1List.Secondary>12.4 GB of 32 GB used</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>
    </template>

    <template v-else>
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Settings" icon="up" @click="screen = 'settings'" />

        <Md1Toolbar.Title>Languages & input</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-settings-body">
        <Md1List :lines="2">
          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Languages</Md1List.Primary>

              <Md1List.Secondary>English (United States)</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Spell checker</Md1List.Primary>

              <Md1List.Secondary>{{ spell ? 'On' : 'Off' }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="spell" aria-label="Spell checker" />
            </Md1List.Action>
          </Md1List.Item>

          <Md1List.Item inset>
            <Md1List.Content>
              <Md1List.Primary>Autofill service</Md1List.Primary>

              <Md1List.Secondary>{{ autofill ? 'On' : 'Off' }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="autofill" aria-label="Autofill service" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </div>
    </template>
  </div>
</template>

<style>
  /* A handset settings screen: the toolbar on top, the list scrolling on the surface under it. */
  .md1-docs-settings-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-settings-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
</style>
