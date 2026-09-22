<script setup lang="ts">
  import {
    EmButton,
    EmDialog,
    EmDialogClose,
    EmDialogContent,
    EmDialogDescription,
    EmDialogFooter,
    EmDialogTitle,
    EmRadio,
    EmRadioGroup,
  } from '@paper/emerald'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const open = shallowRef(true)
  const plan = shallowRef('pro')
</script>

<template>
  <EmeraldShell bare>
    <div class="em">
      <div aria-hidden="true" class="em-scrim" />

      <div class="em-toolbar">
        <p class="em-hint">Figma Modals example — dialog over shell chrome.</p>
        <EmButton size="sm" variant="secondary" @click="open = true">Open dialog</EmButton>
      </div>

      <EmDialog v-model="open">
        <EmDialogContent>
          <div class="em-dialog-head">
            <EmDialogTitle>Choose a plan</EmDialogTitle>
            <EmDialogClose />
          </div>

          <EmDialogDescription>
            Pick the option that best matches your team. You can change this later in Settings.
          </EmDialogDescription>

          <EmRadioGroup v-model="plan" class="em-options" mandatory name="plan">
            <EmRadio value="starter">Starter — free forever</EmRadio>
            <EmRadio value="pro">Pro — full commercial license</EmRadio>
            <EmRadio value="enterprise">Enterprise — SSO & SLA</EmRadio>
          </EmRadioGroup>

          <EmDialogFooter>
            <EmButton variant="tertiary" @click="open = false">Cancel</EmButton>
            <EmButton @click="open = false">Continue</EmButton>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>
    </div>
  </EmeraldShell>
</template>

<style>
  .em {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--ed-bg, #f6f8fa);
  }

  .em-scrim {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 32, 0.18);
    pointer-events: none;
  }

  .em-toolbar {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 24px clamp(1.25rem, 4vw, 3rem);
  }

  .em-hint {
    margin: 0;
    color: var(--ed-muted, #757e85);
    font-size: 14px;
  }

  .em-dialog-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .em-options {
    margin: 8px 0 4px;
  }
</style>
