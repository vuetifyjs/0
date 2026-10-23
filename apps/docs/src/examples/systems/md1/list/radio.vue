<script setup lang="ts">
  import { Md1List, Md1Radio } from '@paper/md1'
  import { shallowRef } from 'vue'

  const ringtone = shallowRef('beacon')
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1Radio.Group v-model="ringtone" aria-label="Ringtone">
      <Md1List class="md1-docs-list-fill">
        <Md1List.Item>
          <Md1List.Content>
            <Md1List.Primary>Andromeda</Md1List.Primary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Radio aria-label="Andromeda" value="andromeda" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Content>
            <Md1List.Primary>Beacon</Md1List.Primary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Radio aria-label="Beacon" value="beacon" />
          </Md1List.Action>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Content>
            <Md1List.Primary>Callisto</Md1List.Primary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Radio aria-label="Callisto" value="callisto" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </Md1Radio.Group>
  </div>
</template>

<style>
  /* A list sheet: the surface colour, the 2 dp radius and room for a handset column; its depth is the shipped md1-elevation-2 utility. */
  .md1-docs-list {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* The radio group stacks its children at their own width; the list spans the sheet so the radios reach the end column. */
  .md1-docs-list-fill {
    align-self: stretch;
  }
</style>
