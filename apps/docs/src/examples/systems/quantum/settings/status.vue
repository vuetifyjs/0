<script setup lang="ts">
  import { QuCheckbox, QuList, QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const airplane = shallowRef(false)
  const vibrate = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-settings-sheet quantum-elevation-2">
    <QuList :lines="2">
      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Airplane mode</QuList.Primary>

          <QuList.Secondary>{{ airplane ? 'On' : 'Off' }}</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="airplane" aria-label="Airplane mode" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Vibrate on tap</QuList.Primary>

          <QuList.Secondary>Plays a short vibration on every key press</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <QuCheckbox v-model="vibrate" aria-label="Vibrate on tap" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Hotspot & tethering</QuList.Primary>

          <QuList.Secondary>Hotspot off</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Sleep</QuList.Primary>

          <QuList.Secondary>After 10 minutes of inactivity</QuList.Secondary>
        </QuList.Content>
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
