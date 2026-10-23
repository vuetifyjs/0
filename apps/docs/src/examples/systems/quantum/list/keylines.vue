<script setup lang="ts">
  import { QuDivider, QuList, QuSubheader } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuSubheader>Recent chats</QuSubheader>

    <QuList>
      <QuList.Item>
        <QuList.Avatar>A</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Ali Connors</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item>
        <QuList.Avatar>S</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Sandra Adams</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item inset>
        <QuList.Content>
          <QuList.Primary>Trevor Hansen</QuList.Primary>
        </QuList.Content>
      </QuList.Item>
    </QuList>

    <QuDivider inset />

    <QuSubheader inset>Previous chats</QuSubheader>

    <QuList>
      <QuList.Item inset>
        <QuList.Content>
          <QuList.Primary>Britta Holt</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item inset>
        <QuList.Content>
          <QuList.Primary>Jennifer Lee</QuList.Primary>
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
