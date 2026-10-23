<script setup lang="ts">
  import { QuDivider, QuList, QuSubheader, QuSwitch, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const nfc = shallowRef(true)
  const sound = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-settings-screen">
    <QuToolbar variant="primary">
      <QuToolbar.Nav aria-label="Home" icon="up" />

      <QuToolbar.Title>Settings</QuToolbar.Title>
    </QuToolbar>

    <div class="quantum-docs-settings-body">
      <QuSubheader inset :sticky="false">Wireless and networks</QuSubheader>

      <QuList :lines="2">
        <QuList.Item inset>
          <QuList.Content>
            <QuList.Primary>Wi-Fi</QuList.Primary>

            <QuList.Secondary>{{ wifi ? 'On' : 'Off' }}</QuList.Secondary>
          </QuList.Content>

          <QuList.Action>
            <QuSwitch v-model="wifi" aria-label="Wi-Fi" />
          </QuList.Action>
        </QuList.Item>

        <QuList.Item inset>
          <QuList.Content>
            <QuList.Primary>Bluetooth</QuList.Primary>

            <QuList.Secondary>{{ bluetooth ? 'On' : 'Off' }}</QuList.Secondary>
          </QuList.Content>

          <QuList.Action>
            <QuSwitch v-model="bluetooth" aria-label="Bluetooth" />
          </QuList.Action>
        </QuList.Item>

        <QuList.Item inset>
          <QuList.Content>
            <QuList.Primary>NFC</QuList.Primary>

            <QuList.Secondary>Exchanges data on contact</QuList.Secondary>
          </QuList.Content>

          <QuList.Action>
            <QuSwitch v-model="nfc" aria-label="NFC" />
          </QuList.Action>
        </QuList.Item>
      </QuList>

      <QuDivider />

      <QuSubheader inset :sticky="false">Device</QuSubheader>

      <QuList :lines="2">
        <QuList.Item inset>
          <QuList.Content>
            <QuList.Primary>Sound</QuList.Primary>

            <QuList.Secondary>{{ sound ? 'On' : 'Off' }}</QuList.Secondary>
          </QuList.Content>

          <QuList.Action>
            <QuSwitch v-model="sound" aria-label="Sound" />
          </QuList.Action>
        </QuList.Item>

        <QuList.Item inset>
          <QuList.Content>
            <QuList.Primary>Sleep</QuList.Primary>

            <QuList.Secondary>After 10 minutes of inactivity</QuList.Secondary>
          </QuList.Content>
        </QuList.Item>
      </QuList>
    </div>
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
