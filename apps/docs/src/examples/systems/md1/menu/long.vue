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
        <Md1Button v-bind="attrs">{{ font }}</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item v-for="item in fonts" :key="item" :value="item">{{ item }}</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>
