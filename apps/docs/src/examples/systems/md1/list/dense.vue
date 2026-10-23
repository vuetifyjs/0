<script setup lang="ts">
  import { Md1List } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List dense :lines="2">
      <Md1List.Item>
        <Md1List.Icon name="folder" />

        <Md1List.Content>
          <Md1List.Primary>Quarterly report</Md1List.Primary>

          <Md1List.Secondary>Edited yesterday</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Icon name="folder" />

        <Md1List.Content>
          <Md1List.Primary>Roadmap</Md1List.Primary>

          <Md1List.Secondary>Edited Mar 2</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Icon name="folder" />

        <Md1List.Content>
          <Md1List.Primary>Budget</Md1List.Primary>

          <Md1List.Secondary>Edited Feb 14</Md1List.Secondary>
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
