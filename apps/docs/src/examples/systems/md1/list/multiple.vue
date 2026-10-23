<script setup lang="ts">
  import { Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const recipients = shallowRef<string[]>(['sandra'])
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List v-model="recipients" aria-label="Recipients" :lines="2" select="multiple">
      <Md1List.Item value="ali">
        <Md1List.Avatar>A</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Ali Connors</Md1List.Primary>

          <Md1List.Secondary>ali@example.com</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item value="sandra">
        <Md1List.Avatar>S</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Sandra Adams</Md1List.Primary>

          <Md1List.Secondary>sandra@example.com</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item value="trevor">
        <Md1List.Avatar>T</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Trevor Hansen</Md1List.Primary>

          <Md1List.Secondary>trevor@example.com</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>
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
</style>
