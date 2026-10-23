<script setup lang="ts">
  import { QuCheckbox, QuIconToggle, QuList, QuSwitch } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const sync = shallowRef(true)
  const starred = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList>
      <QuList.Item>
        <QuList.Icon name="settings" />

        <QuList.Content>
          <QuList.Primary>Wi-Fi</QuList.Primary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="wifi" aria-label="Wi-Fi" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Icon name="settings" />

        <QuList.Content>
          <QuList.Primary>Bluetooth</QuList.Primary>
        </QuList.Content>

        <QuList.Action>
          <QuSwitch v-model="bluetooth" aria-label="Bluetooth" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Icon name="refresh" />

        <QuList.Content>
          <QuList.Primary>Auto-sync</QuList.Primary>
        </QuList.Content>

        <QuList.Action>
          <QuCheckbox v-model="sync" aria-label="Auto-sync" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Avatar>A</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Ali Connors</QuList.Primary>
        </QuList.Content>

        <QuList.Action>
          <QuIconToggle v-model="starred" aria-label="Star Ali Connors" icon="star-border" icon-on="star" />
        </QuList.Action>
      </QuList.Item>

      <QuList.Item>
        <QuList.Icon name="event" />

        <QuList.Content>
          <QuList.Primary>Team stand-up</QuList.Primary>
        </QuList.Content>

        <QuList.Action>15 min</QuList.Action>
      </QuList.Item>
    </QuList>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped quantum-elevation-2 utility. */
  .quantum-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
