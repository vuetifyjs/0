<script setup lang="ts">
  import { QuList, QuRadio } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const ringtone = shallowRef('beacon')
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuRadio.Group v-model="ringtone" aria-label="Ringtone">
      <QuList class="quantum-docs-list-fill">
        <QuList.Item>
          <QuList.Content>
            <QuList.Primary>Andromeda</QuList.Primary>
          </QuList.Content>

          <QuList.Action>
            <QuRadio aria-label="Andromeda" value="andromeda" />
          </QuList.Action>
        </QuList.Item>

        <QuList.Item>
          <QuList.Content>
            <QuList.Primary>Beacon</QuList.Primary>
          </QuList.Content>

          <QuList.Action>
            <QuRadio aria-label="Beacon" value="beacon" />
          </QuList.Action>
        </QuList.Item>

        <QuList.Item>
          <QuList.Content>
            <QuList.Primary>Callisto</QuList.Primary>
          </QuList.Content>

          <QuList.Action>
            <QuRadio aria-label="Callisto" value="callisto" />
          </QuList.Action>
        </QuList.Item>
      </QuList>
    </QuRadio.Group>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped quantum-elevation-2 utility. */
  .quantum-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* The radio group stacks its children at their own width; the list spans the sheet so the radios reach the end column. */
  .quantum-docs-list-fill {
    align-self: stretch;
  }
</style>
