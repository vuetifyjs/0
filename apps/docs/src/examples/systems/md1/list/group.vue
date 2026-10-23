<script setup lang="ts">
  import { Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const folder = shallowRef('work')
  const open = shallowRef(true)
</script>

<template>
  <div class="md1-docs-list md1-elevation-2">
    <Md1List v-model="folder" aria-label="Folders">
      <Md1List.Item value="inbox">
        <Md1List.Icon name="inbox" />

        <Md1List.Content>
          <Md1List.Primary>Inbox</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>

      <Md1List.Group v-model="open" icon="label" title="Labels">
        <Md1List.Item value="work">
          <Md1List.Content>
            <Md1List.Primary>Work</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item value="travel">
          <Md1List.Content>
            <Md1List.Primary>Travel</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item value="receipts">
          <Md1List.Content>
            <Md1List.Primary>Receipts</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List.Group>

      <Md1List.Item value="sent">
        <Md1List.Icon name="send" />

        <Md1List.Content>
          <Md1List.Primary>Sent mail</Md1List.Primary>
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
