<script setup lang="ts">
  import { Md1Divider, Md1Icon, Md1List } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List>
      <Md1List.Item>
        <Md1List.Avatar>
          <Md1Icon name="folder" />
        </Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Photos</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <Md1Divider />

    <Md1List :lines="2">
      <Md1List.Item>
        <Md1List.Avatar>
          <Md1Icon name="folder" />
        </Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Recipes</Md1List.Primary>

          <Md1List.Secondary>Jan 17, 2014</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <Md1Divider />

    <Md1List :lines="3">
      <Md1List.Item>
        <Md1List.Avatar>A</Md1List.Avatar>

        <Md1List.Content>
          <Md1List.Primary>Brunch this weekend?</Md1List.Primary>

          <Md1List.Secondary>Ali Connors: I'll be in your neighborhood doing errands this weekend. Do you want to meet for brunch, or later in the afternoon?</Md1List.Secondary>
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
