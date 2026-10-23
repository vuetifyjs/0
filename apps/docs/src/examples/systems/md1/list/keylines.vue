<script setup lang="ts">
  import { Md1Divider, Md1List, Md1Subheader } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1Subheader>Recent chats</Md1Subheader>

    <Md1List>
      <Md1List.Item>
        <Md1List.Avatar>A</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Ali Connors</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item>
        <Md1List.Avatar>S</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Sandra Adams</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item inset>
        <Md1List.Content>
          <Md1List.Primary>Trevor Hansen</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <Md1Divider inset />

    <Md1Subheader inset>Previous chats</Md1Subheader>

    <Md1List>
      <Md1List.Item inset>
        <Md1List.Content>
          <Md1List.Primary>Britta Holt</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Item inset>
        <Md1List.Content>
          <Md1List.Primary>Jennifer Lee</Md1List.Primary>
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
