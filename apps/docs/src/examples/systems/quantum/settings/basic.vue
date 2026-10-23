<script setup lang="ts">
  import { QuList, QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const location = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-settings-sheet quantum-elevation-2">
    <QuList :lines="2">
      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Wi-Fi</QuList.Primary>

          <QuList.Secondary>{{ wifi ? 'On' : 'Off' }}</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="wifi" aria-label="Wi-Fi" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Bluetooth</QuList.Primary>

          <QuList.Secondary>{{ bluetooth ? 'On' : 'Off' }}</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="bluetooth" aria-label="Bluetooth" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Location</QuList.Primary>

          <QuList.Secondary>{{ location ? 'On' : 'Off' }}</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="location" aria-label="Location" />
        </QuList.Action>
      </QuList.Item>
    </QuList>
  </div>
</template>

<style>
  /* A settings sheet: the surface colour, the 2 dp radius and a handset column. */
  .quantum-docs-settings-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
