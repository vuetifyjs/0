<script setup lang="ts">
  import { Md1Divider, Md1List, Md1Subheader, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const nfc = shallowRef(true)
  const sound = shallowRef(true)
</script>

<template>
  <div class="md1-docs-screen md1-docs-settings-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav aria-label="Home" icon="up" />

      <Md1Toolbar.Title>Settings</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-settings-body">
      <Md1Subheader inset :sticky="false">Wireless and networks</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Wi-Fi</Md1List.Primary>

            <Md1List.Secondary>{{ wifi ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="wifi" aria-label="Wi-Fi" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Bluetooth</Md1List.Primary>

            <Md1List.Secondary>{{ bluetooth ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="bluetooth" aria-label="Bluetooth" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>NFC</Md1List.Primary>

            <Md1List.Secondary>Exchanges data on contact</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="nfc" aria-label="NFC" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>

      <Md1Divider />

      <Md1Subheader inset :sticky="false">Device</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Sound</Md1List.Primary>

            <Md1List.Secondary>{{ sound ? 'On' : 'Off' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch v-model="sound" aria-label="Sound" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item inset>
          <Md1List.Content>
            <Md1List.Primary>Sleep</Md1List.Primary>

            <Md1List.Secondary>After 10 minutes of inactivity</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>
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
