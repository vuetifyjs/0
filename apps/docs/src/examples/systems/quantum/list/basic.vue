<script setup lang="ts">
  import { QuList } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const folder = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList v-model="folder" aria-label="Mail folders">
      <QuList.Item value="inbox">
        <QuList.Icon name="inbox" />

        <QuList.Content>
          <QuList.Primary>Inbox</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item value="starred">
        <QuList.Icon name="star" />

        <QuList.Content>
          <QuList.Primary>Starred</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item value="sent">
        <QuList.Icon name="send" />

        <QuList.Content>
          <QuList.Primary>Sent mail</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Item value="drafts">
        <QuList.Icon name="drafts" />

        <QuList.Content>
          <QuList.Primary>Drafts</QuList.Primary>
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
