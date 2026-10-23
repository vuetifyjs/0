<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Open</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Subheader>Recent</Md1Menu.Subheader>

        <Md1Menu.Item>Budget.xlsx</Md1Menu.Item>

        <Md1Menu.Item>Roadmap.doc</Md1Menu.Item>

        <Md1Menu.Divider />

        <Md1Menu.Subheader>Shared with me</Md1Menu.Subheader>

        <Md1Menu.Item>Offsite plan</Md1Menu.Item>

        <Md1Menu.Item>Team photos</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>
