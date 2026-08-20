<script setup lang="ts">
  import {
    EmButton,
    EmDialog,
    EmDialogActivator,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const deleted = shallowRef(false)

  function onDelete () {
    deleted.value = true
    open.value = false
  }
</script>

<template>
  <div class="emerald-docs-row">
    <EmDialog v-model="open">
      <EmDialogActivator v-slot="{ attrs }" renderless>
        <EmButton v-bind="attrs" variant="destructive">Delete project</EmButton>
      </EmDialogActivator>

      <!-- No close affordance and no outside dismissal: the two buttons are
           the only ways out, so neither outcome can happen by accident. -->
      <EmDialogContent :close-on-click-outside="false">
        <EmDialogTitle>Delete this project?</EmDialogTitle>

        <EmDialogDescription>
          Every board, file and comment in it is removed. This cannot be undone.
        </EmDialogDescription>

        <EmDialogFooter>
          <EmButton variant="tertiary" @click="open = false">Keep project</EmButton>

          <EmButton variant="destructive" @click="onDelete">Delete</EmButton>
        </EmDialogFooter>
      </EmDialogContent>
    </EmDialog>

    <span v-if="deleted" class="emerald-docs-note" role="status">Project deleted.</span>
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
