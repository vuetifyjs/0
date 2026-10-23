<script setup lang="ts">
  import { QuDialog, QuList, QuRadio } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const delays = ['After 30 seconds', 'After 1 minute', 'After 10 minutes', 'After 30 minutes']

  const open = shallowRef(false)
  const sleep = shallowRef<unknown>('After 10 minutes')
</script>

<template>
  <div class="quantum-docs-settings-sheet quantum-elevation-2">
    <QuList :lines="2">
      <QuList.Item aria-haspopup="dialog" @click="open = true">
        <QuList.Content>
          <QuList.Primary>Sleep</QuList.Primary>

          <QuList.Secondary>{{ sleep }} of inactivity</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>
    </QuList>

    <QuDialog v-slot="{ value, commit }" v-model="open" v-model:value="sleep" variant="confirmation">
      <QuDialog.Content>
        <QuDialog.Title>Sleep</QuDialog.Title>

        <QuRadio.Group aria-label="Sleep" :model-value="value" @update:model-value="commit">
          <QuRadio
            v-for="delay in delays"
            :key="delay"
            class="quantum-docs-settings-choice"
            :label="delay"
            :value="delay"
          />
        </QuRadio.Group>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm />
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>
  </div>
</template>

<style>
  /* A settings sheet: the surface colour, the 2 dp radius and a handset column. */
  .quantum-docs-settings-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* The dialog's radios sit on its 24 dp content keyline. */
  .quantum-docs-settings-choice {
    padding-inline: var(--quantum-spacing-3, 24px);
  }
</style>
