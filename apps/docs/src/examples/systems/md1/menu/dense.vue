<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu dense>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Sort by</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item>Name</Md1Menu.Item>

        <Md1Menu.Item>Date modified</Md1Menu.Item>

        <Md1Menu.Item>Size</Md1Menu.Item>

        <Md1Menu.Item>Type</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>
