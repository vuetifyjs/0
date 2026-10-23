<script setup lang="ts">
  import { QuButton, QuList, QuSnackbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-confirm-undo">
    <div class="quantum-docs-confirm-scroller" @scroll.passive="onScroll">
      <QuList :lines="2">
        <QuList.Item v-for="item in conversations" :key="item.id">
          <QuList.Avatar>{{ item.name[0] }}</QuList.Avatar>

          <QuList.Content>
            <QuList.Primary>{{ item.name }}</QuList.Primary>

            <QuList.Secondary>{{ item.preview }}</QuList.Secondary>
          </QuList.Content>

          <QuList.Action>
            <QuButton :aria-label="`Delete conversation with ${item.name}`" class="quantum-docs-confirm-action" icon="delete" @click="onDelete(item)" />
          </QuList.Action>
        </QuList.Item>
      </QuList>
    </div>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open" action="Undo" @action="onUndo">Conversation deleted</QuSnackbar>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-confirm-undo {
    max-width: 400px;
    background: var(--quantum-surface, #FFFFFF);
  }

  /* A list's secondary action is an icon in the active icon ink, not an accent-coloured flat button. */
  .quantum-docs-confirm-action.quantum-button[data-solo]:not([data-disabled]) {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-confirm-scroller {
    height: 100%;
    overflow-y: auto;
  }
</style>
