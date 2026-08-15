<script setup lang="ts">
  import {
    EmButton,
    EmDialog,
    EmDialogActivator,
    EmDialogClose,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <EmDialog v-model="open">
    <EmDialogActivator v-slot="{ attrs }" renderless>
      <EmButton v-bind="attrs">Invite teammate</EmButton>
    </EmDialogActivator>

    <EmDialogContent>
      <EmDialogTitle>Invite a teammate</EmDialogTitle>

      <EmDialogDescription>
        They will get an email with a link to join this workspace.
      </EmDialogDescription>

      <EmDialogFooter>
        <EmButton variant="tertiary" @click="open = false">Cancel</EmButton>

        <EmButton @click="open = false">Send invite</EmButton>
      </EmDialogFooter>

      <EmDialogClose />
    </EmDialogContent>
  </EmDialog>
</template>
