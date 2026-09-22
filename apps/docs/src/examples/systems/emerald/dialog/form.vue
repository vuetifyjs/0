<script setup lang="ts">
  import {
    EmButton,
    EmDialog,
    EmDialogActivator,
    EmDialogClose,
    EmDialogContent,
    EmDialogFooter,
    EmDialogTitle,
    EmTextField,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const name = shallowRef('Acme Design')
  const saved = shallowRef('')

  function onSave () {
    const next = name.value.trim()
    if (!next) return
    saved.value = next
    open.value = false
  }
</script>

<template>
  <div class="emerald-docs-row">
    <EmDialog v-model="open">
      <EmDialogActivator v-slot="{ attrs }" renderless>
        <EmButton v-bind="attrs" variant="secondary">Rename workspace</EmButton>
      </EmDialogActivator>

      <EmDialogContent>
        <EmDialogTitle>Rename workspace</EmDialogTitle>

        <EmTextField
          v-model="name"
          description="Visible to everyone in the workspace."
          label="Workspace name"
          placeholder="Acme Design"
        />

        <EmDialogFooter variant="one-button">
          <EmButton :disabled="!name.trim()" @click="onSave">Save</EmButton>
        </EmDialogFooter>

        <EmDialogClose />
      </EmDialogContent>
    </EmDialog>

    <span v-if="saved" class="emerald-docs-note" role="status">Renamed to {{ saved }}.</span>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }

  .emerald-docs-note {
    font-size: var(--emerald-text-b2-size, 14px);
    color: var(--emerald-on-surface-variant);
  }
</style>
