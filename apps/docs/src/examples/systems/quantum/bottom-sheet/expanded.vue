<script setup lang="ts">
  import { QuBottomSheet, QuButton } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const expanded = shallowRef(false)

  const contacts = ['Ali Connors', 'Alex Nelson', 'Sandra Adams', 'Trevor Hansen', 'Britta Holt', 'Jennifer Lee', 'Mia Wong', 'Kai Svensson', 'Nadia Ruiz', 'Omar Haddad', 'Priya Nair', 'Lena Fischer']
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-sheet-screen">
    <div class="quantum-docs-sheet-bar">
      <QuBottomSheet v-slot="{ expand, isExpanded }" v-model:expanded="expanded">
        <QuBottomSheet.Activator v-slot="{ attrs }">
          <QuButton v-bind="attrs" variant="raised">Send to</QuButton>
        </QuBottomSheet.Activator>

        <QuBottomSheet.Title>Send to</QuBottomSheet.Title>

        <QuBottomSheet.Item
          v-for="contact in contacts"
          :key="contact"
          icon="account-circle"
        >
          {{ contact }}
        </QuBottomSheet.Item>

        <QuButton v-if="!isExpanded" footer @click="expand">Show all contacts</QuButton>
      </QuBottomSheet>

      <span class="quantum-docs-note">{{ expanded ? 'Expanded' : 'Initial height' }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-sheet-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-sheet-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
