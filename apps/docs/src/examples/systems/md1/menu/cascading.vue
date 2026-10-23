<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu desktop>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" dense>Insert</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item icon="photo">Image</Md1Menu.Item>

        <Md1Menu.Item icon="link">Link</Md1Menu.Item>

        <Md1Menu.Sub icon="event" label="Date and time">
          <Md1Menu.Item>Today</Md1Menu.Item>

          <Md1Menu.Item>Tomorrow</Md1Menu.Item>

          <Md1Menu.Item>Current time</Md1Menu.Item>
        </Md1Menu.Sub>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
