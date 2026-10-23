<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const ruler = shallowRef(true)
  const grid = shallowRef(false)
  const guides = shallowRef(true)
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">View</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.CheckItem v-model:checked="ruler">Show ruler</Md1Menu.CheckItem>

        <Md1Menu.CheckItem v-model:checked="grid">Show grid</Md1Menu.CheckItem>

        <Md1Menu.CheckItem v-model:checked="guides">Show guides</Md1Menu.CheckItem>
      </Md1Menu.Content>
    </Md1Menu>
  </div>
</template>
