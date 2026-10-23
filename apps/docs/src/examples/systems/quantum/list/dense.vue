<script setup lang="ts">
  import { QuList } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList dense :lines="2">
      <QuList.Item>
        <QuList.Icon name="folder" />

        <QuList.Content>
          <QuList.Primary>Quarterly report</QuList.Primary>

          <QuList.Secondary>Edited yesterday</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item>
        <QuList.Icon name="folder" />

        <QuList.Content>
          <QuList.Primary>Roadmap</QuList.Primary>

          <QuList.Secondary>Edited Mar 2</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item>
        <QuList.Icon name="folder" />

        <QuList.Content>
          <QuList.Primary>Budget</QuList.Primary>

          <QuList.Secondary>Edited Feb 14</QuList.Secondary>
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
