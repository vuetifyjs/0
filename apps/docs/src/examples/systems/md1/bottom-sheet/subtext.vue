<script setup lang="ts">
  import { Md1BottomSheet, Md1Button, Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const albums = [
    { id: 'caribbean', title: 'Caribbean vacation', when: 'August 13 – 22' },
    { id: 'beach', title: 'Pablo at the beach house', when: 'July 19 – 24' },
    { id: 'joeys', title: 'July 4th weekend at Joey\'s', when: 'July 4, 2015' },
    { id: 'birthday', title: 'Meg\'s birthday', when: 'June 29, 2015' },
  ]

  const added = shallowRef('')
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-bar">
      <Md1BottomSheet v-slot="{ close }">
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" variant="raised">Add to album</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1List aria-label="Albums" :lines="2">
          <Md1List.Item
            v-for="album in albums"
            :key="album.id"
            @click="added = album.title; close()"
          >
            <Md1List.Avatar :src="`https://picsum.photos/seed/md1-album-${album.id}/80/80`" />

            <Md1List.Content>
              <Md1List.Primary>{{ album.title }}</Md1List.Primary>

              <Md1List.Secondary>{{ album.when }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </Md1BottomSheet>

      <span v-if="added" class="md1-docs-note" role="status">Added to {{ added }}</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-sheet-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-sheet-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
