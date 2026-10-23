<script setup lang="ts">
  import { QuList } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const folder = shallowRef('work')
  const open = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-list quantum-elevation-2">
    <QuList v-model="folder" aria-label="Folders">
      <QuList.Item value="inbox">
        <QuList.Icon name="inbox" />

        <QuList.Content>
          <QuList.Primary>Inbox</QuList.Primary>
        </QuList.Content>
      </QuList.Item>

      <QuList.Group v-model="open" icon="label" title="Labels">
        <QuList.Item value="work">
          <QuList.Content>
            <QuList.Primary>Work</QuList.Primary>
          </QuList.Content>
        </QuList.Item>

        <QuList.Item value="travel">
          <QuList.Content>
            <QuList.Primary>Travel</QuList.Primary>
          </QuList.Content>
        </QuList.Item>

        <QuList.Item value="receipts">
          <QuList.Content>
            <QuList.Primary>Receipts</QuList.Primary>
          </QuList.Content>
        </QuList.Item>
      </QuList.Group>

      <QuList.Item value="sent">
        <QuList.Icon name="send" />

        <QuList.Content>
          <QuList.Primary>Sent mail</QuList.Primary>
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
