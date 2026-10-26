<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const fonts = [
    'Arial',
    'Book Antiqua',
    'Calibri',
    'Cambria',
    'Comic Sans',
    'Courier New',
    'Garamond',
    'Georgia',
    'Helvetica',
    'Lato',
    'Merriweather',
    'Open Sans',
    'Palatino',
    'Roboto',
    'Roboto Mono',
    'Tahoma',
    'Times New Roman',
    'Trebuchet',
    'Verdana',
  ]

  const font = shallowRef<unknown>('Roboto')
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu v-model:selected="font">
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" class="md1-docs-menu-font">{{ font }}</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item v-for="item in fonts" :key="item" :value="item">{{ item }}</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>

<style>
  /*
   * As wide as the button is with the longest font name, Times New Roman, so
   * choosing a shorter one never narrows the button and moves it under the
   * pointer.
   */
  .md1-button.md1-docs-menu-font {
    min-inline-size: 168px;
  }
</style>
