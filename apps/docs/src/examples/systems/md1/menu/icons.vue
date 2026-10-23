<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Document</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item icon="visibility">Preview</Md1Menu.Item>

        <Md1Menu.Item icon="share" info="Ctrl+S">Share</Md1Menu.Item>

        <Md1Menu.Item icon="link" info="Ctrl+L">Get link</Md1Menu.Item>

        <Md1Menu.Item icon="edit">Rename</Md1Menu.Item>

        <Md1Menu.Item icon="delete" info="Delete">Remove</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>
