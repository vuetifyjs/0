<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const sizes = ['Small', 'Medium', 'Large', 'Extra large']

  const size = shallowRef<unknown>('Medium')
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu v-model:selected="size">
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" class="md1-docs-menu-size">Text size: {{ size }}</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item v-for="item in sizes" :key="item" :value="item">{{ item }}</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>

<style>
  /*
   * As wide as the button is with the longest size, Extra large, so
   * choosing a shorter one never narrows the button and moves it under the
   * pointer.
   */
  .md1-button.md1-docs-menu-size {
    min-inline-size: 208px;
  }
</style>
