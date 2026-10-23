<script setup lang="ts">
  import { Md1Button, Md1List, Md1Snackbar } from '@paper/md1'
  import { ref, shallowRef } from 'vue'

  interface Conversation {
    id: number
    name: string
    preview: string
  }

  const conversations = ref<Conversation[]>([
    { id: 1, name: 'Ali Connors', preview: 'Brunch this weekend?' },
    { id: 2, name: 'Trevor Hansen', preview: 'Summer barbecue' },
    { id: 3, name: 'Sandra Adams', preview: 'Oui oui' },
    { id: 4, name: 'Britta Holt', preview: 'Birthday gift' },
    { id: 5, name: 'Jennifer Lee', preview: 'Recipe to try' },
    { id: 6, name: 'Scott Kim', preview: 'Giants game' },
  ])

  const open = shallowRef(false)
  const removed = shallowRef<{ item: Conversation, index: number }>()

  function onDelete (item: Conversation) {
    const index = conversations.value.indexOf(item)

    conversations.value.splice(index, 1)
    removed.value = { item, index }
    open.value = true
  }

  function onUndo () {
    if (!removed.value) return

    conversations.value.splice(removed.value.index, 0, removed.value.item)
    removed.value = undefined
  }

  // Scrolling the list is the unrelated action that ends the chance to undo.
  function onScroll () {
    open.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-confirm-undo">
    <div class="md1-docs-confirm-scroller" @scroll.passive="onScroll">
      <Md1List :lines="2">
        <Md1List.Item v-for="item in conversations" :key="item.id">
          <Md1List.Avatar>{{ item.name[0] }}</Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>{{ item.name }}</Md1List.Primary>

            <Md1List.Secondary>{{ item.preview }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Button :aria-label="`Delete conversation with ${item.name}`" class="md1-docs-confirm-action" icon="delete" @click="onDelete(item)" />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open" action="Undo" @action="onUndo">Conversation deleted</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-confirm-undo {
    max-width: 400px;
    background: var(--md1-surface, #FFFFFF);
  }

  /* A list's secondary action is an icon in the active icon ink, not an accent-coloured flat button. */
  .md1-docs-confirm-action.md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-confirm-scroller {
    height: 100%;
    overflow-y: auto;
  }
</style>
