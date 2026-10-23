<script setup lang="ts">
  import { Md1Checkbox, Md1IconToggle, Md1List, Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
  const sync = shallowRef(true)
  const starred = shallowRef(false)
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List>
      <Md1List.Item>
        <Md1List.Icon name="settings" />

        <Md1List.Content>
          <Md1List.Primary>Wi-Fi</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="wifi" aria-label="Wi-Fi" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Icon name="settings" />

        <Md1List.Content>
          <Md1List.Primary>Bluetooth</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="bluetooth" aria-label="Bluetooth" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Icon name="refresh" />

        <Md1List.Content>
          <Md1List.Primary>Auto-sync</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Checkbox v-model="sync" aria-label="Auto-sync" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Avatar>A</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Ali Connors</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1IconToggle v-model="starred" aria-label="Star Ali Connors" icon="star-border" icon-on="star" />
        </Md1List.Action>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Icon name="event" />

        <Md1List.Content>
          <Md1List.Primary>Team stand-up</Md1List.Primary>
        </Md1List.Content>

        <Md1List.Action>15 min</Md1List.Action>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped md1-elevation-2 utility. */
  .md1-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
