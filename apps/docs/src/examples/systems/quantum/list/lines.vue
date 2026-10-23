<script setup lang="ts">
  import { QuDivider, QuIcon, QuList } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList>
      <QuList.Item>
        <QuList.Avatar>
          <QuIcon name="folder" />
        </QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Photos</QuList.Primary>
        </QuList.Content>
      </QuList.Item>
    </QuList>

    <QuDivider />

    <QuList :lines="2">
      <QuList.Item>
        <QuList.Avatar>
          <QuIcon name="folder" />
        </QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Recipes</QuList.Primary>

          <QuList.Secondary>Jan 17, 2014</QuList.Secondary>
        </QuList.Content>
      </QuList.Item>
    </QuList>

    <QuDivider />

    <QuList :lines="3">
      <QuList.Item>
        <QuList.Avatar>A</QuList.Avatar>

        <QuList.Content>
          <QuList.Primary>Brunch this weekend?</QuList.Primary>

          <QuList.Secondary>Ali Connors: I'll be in your neighborhood doing errands this weekend. Do you want to meet for brunch, or later in the afternoon?</QuList.Secondary>
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
