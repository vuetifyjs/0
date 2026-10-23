<script setup lang="ts">
  import { Md1BottomSheet, Md1Button } from '@paper/md1'
  import { shallowRef } from 'vue'

  const expanded = shallowRef(false)

  const contacts = ['Ali Connors', 'Alex Nelson', 'Sandra Adams', 'Trevor Hansen', 'Britta Holt', 'Jennifer Lee', 'Mia Wong', 'Kai Svensson', 'Nadia Ruiz', 'Omar Haddad', 'Priya Nair', 'Lena Fischer']
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-bar">
      <Md1BottomSheet v-slot="{ expand, isExpanded }" v-model:expanded="expanded">
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <Md1Button v-bind="attrs" variant="raised">Send to</Md1Button>
        </Md1BottomSheet.Activator>

        <Md1BottomSheet.Title>Send to</Md1BottomSheet.Title>

        <Md1BottomSheet.Item
          v-for="contact in contacts"
          :key="contact"
          icon="account-circle"
        >
          {{ contact }}
        </Md1BottomSheet.Item>

        <Md1Button v-if="!isExpanded" footer @click="expand">Show all contacts</Md1Button>
      </Md1BottomSheet>

      <span class="md1-docs-note">{{ expanded ? 'Expanded' : 'Initial height' }}</span>
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
