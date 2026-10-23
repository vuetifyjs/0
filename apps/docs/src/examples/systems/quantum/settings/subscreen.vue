<script setup lang="ts">
  import { QuList, QuSwitch, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const screen = shallowRef<'settings' | 'languages'>('settings')
  const spell = shallowRef(true)
  const autofill = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-settings-screen">
    <template v-if="screen === 'settings'">
      <QuToolbar variant="primary">
        <QuToolbar.Nav aria-label="Home" icon="up" />

        <QuToolbar.Title>Settings</QuToolbar.Title>
      </QuToolbar>

      <div class="quantum-docs-settings-body">
        <QuList :lines="2">
          <QuList.Item inset>
            <QuList.Content>
              <QuList.Primary>Display</QuList.Primary>

              <QuList.Secondary>Adaptive brightness on</QuList.Secondary>
            </QuList.Content>
          </QuList.Item>

          <QuList.Item inset @click="screen = 'languages'">
            <QuList.Content>
              <QuList.Primary>Languages & input</QuList.Primary>

              <QuList.Secondary>English (United States)</QuList.Secondary>
            </QuList.Content>
          </QuList.Item>

          <QuList.Item inset>
            <QuList.Content>
              <QuList.Primary>Storage</QuList.Primary>

              <QuList.Secondary>12.4 GB of 32 GB used</QuList.Secondary>
            </QuList.Content>
          </QuList.Item>
        </QuList>
      </div>
    </template>

    <template v-else>
      <QuToolbar variant="primary">
        <QuToolbar.Nav aria-label="Settings" icon="up" @click="screen = 'settings'" />

        <QuToolbar.Title>Languages & input</QuToolbar.Title>
      </QuToolbar>

      <div class="quantum-docs-settings-body">
        <QuList :lines="2">
          <QuList.Item inset>
            <QuList.Content>
              <QuList.Primary>Languages</QuList.Primary>

              <QuList.Secondary>English (United States)</QuList.Secondary>
            </QuList.Content>
          </QuList.Item>

          <QuList.Item inset>
            <QuList.Content>
              <QuList.Primary>Spell checker</QuList.Primary>

              <QuList.Secondary>{{ spell ? 'On' : 'Off' }}</QuList.Secondary>
            </QuList.Content>

            <QuList.Action>
              <QuSwitch v-model="spell" aria-label="Spell checker" />
            </QuList.Action>
          </QuList.Item>

          <QuList.Item inset>
            <QuList.Content>
              <QuList.Primary>Autofill service</QuList.Primary>

              <QuList.Secondary>{{ autofill ? 'On' : 'Off' }}</QuList.Secondary>
            </QuList.Content>

            <QuList.Action>
              <QuSwitch v-model="autofill" aria-label="Autofill service" />
            </QuList.Action>
          </QuList.Item>
        </QuList>
      </div>
    </template>
  </div>
</template>

<style>
  /* A handset settings screen: the toolbar on top, the list scrolling on the surface under it. */
  .quantum-docs-settings-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-settings-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }
</style>
