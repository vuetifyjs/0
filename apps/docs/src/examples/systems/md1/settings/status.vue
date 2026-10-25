<script setup lang="ts">
  import { Md1Checkbox, Md1List, Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const airplane = shallowRef(false)
  const vibrate = shallowRef(true)
  const nfc = shallowRef(false)
</script>

<template>
  <div class="md1-docs-settings-sheet md1-elevation-2">
    <Md1List :lines="2">
      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Airplane mode</Md1List.Primary>

          <Md1List.Secondary>{{ airplane ? 'On' : 'Off' }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="airplane" aria-label="Airplane mode" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Vibrate on tap</Md1List.Primary>

          <Md1List.Secondary>Plays a short vibration on every key press</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Checkbox v-model="vibrate" aria-label="Vibrate on tap" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Hotspot & tethering</Md1List.Primary>

          <Md1List.Secondary>Hotspot off</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item :lines="3">
        <Md1List.Content>
          <Md1List.Primary>NFC</Md1List.Primary>

          <Md1List.Secondary>Allow data exchange when the phone touches another device</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="nfc" aria-label="NFC" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Sleep</Md1List.Primary>

          <Md1List.Secondary>After 10 minutes of inactivity</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A settings sheet: the surface colour, the 2 dp radius and a handset column. */
  .md1-docs-settings-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
