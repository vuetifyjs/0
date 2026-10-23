<script setup lang="ts">
  import { Md1Dialog, Md1List, Md1Radio } from '@paper/md1'
  import { shallowRef } from 'vue'

  const delays = ['After 30 seconds', 'After 1 minute', 'After 10 minutes', 'After 30 minutes']

  const open = shallowRef(false)
  const sleep = shallowRef<unknown>('After 10 minutes')
</script>

<template>
  <div class="md1-docs-settings-sheet md1-elevation-2">
    <Md1List :lines="2">
      <Md1List.Item aria-haspopup="dialog" @click="open = true">
        <Md1List.Content>
          <Md1List.Primary>Sleep</Md1List.Primary>

          <Md1List.Secondary>{{ sleep }} of inactivity</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <Md1Dialog v-slot="{ value, commit }" v-model="open" v-model:value="sleep" variant="confirmation">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Sleep</Md1Dialog.Title>

        <Md1Radio.Group aria-label="Sleep" :model-value="value" @update:model-value="commit">
          <Md1Radio
            v-for="delay in delays"
            :key="delay"
            class="md1-docs-settings-choice"
            :label="delay"
            :value="delay"
          />
        </Md1Radio.Group>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm />
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>
  </div>
</template>

<style>
  /* A settings sheet: the surface colour, the 2 dp radius and a handset column. */
  .md1-docs-settings-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The dialog's radios sit on its 24 dp content keyline. */
  .md1-docs-settings-choice {
    padding-inline: var(--md1-spacing-3, 24px);
  }
</style>
