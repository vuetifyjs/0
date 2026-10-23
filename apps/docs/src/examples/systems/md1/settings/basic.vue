<script setup lang="ts">
  import { Md1List, Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const location = shallowRef(true)
</script>

<template>
  <div class="md1-docs-settings-sheet md1-elevation-2">
    <Md1List :lines="2">
      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Wi-Fi</Md1List.Primary>

          <Md1List.Secondary>{{ wifi ? 'On' : 'Off' }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="wifi" aria-label="Wi-Fi" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Bluetooth</Md1List.Primary>

          <Md1List.Secondary>{{ bluetooth ? 'On' : 'Off' }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="bluetooth" aria-label="Bluetooth" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Location</Md1List.Primary>

          <Md1List.Secondary>{{ location ? 'On' : 'Off' }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="location" aria-label="Location" />
        </Md1List.Action>
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
