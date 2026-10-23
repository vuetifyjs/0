<script setup lang="ts">
  import { QuList } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const recipients = shallowRef<string[]>(['sandra'])
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList v-model="recipients" aria-label="Recipients" :lines="2" select="multiple">
      <QuList.Item value="ali">
        <QuList.Avatar>A</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Ali Connors</QuList.Primary>

          <QuList.Secondary>ali@example.com</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item value="sandra">
        <QuList.Avatar>S</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Sandra Adams</QuList.Primary>

          <QuList.Secondary>sandra@example.com</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item value="trevor">
        <QuList.Avatar>T</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Trevor Hansen</QuList.Primary>

          <QuList.Secondary>trevor@example.com</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>
    </QuList>
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
</style>
