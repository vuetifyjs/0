<script setup lang="ts">
  import { EmButton, EmDialog } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const sent = shallowRef(false)

  function onSend () {
    sent.value = true
    open.value = false
  }
</script>

<template>
  <div class="emerald-docs-row">
    <EmDialog v-model="open">
      <EmDialog.Activator v-slot="{ attrs }" renderless>
        <EmButton v-bind="attrs">Invite teammate</EmButton>
      </EmDialog.Activator>

      <EmDialog.Content>
        <EmDialog.Title>Invite a teammate</EmDialog.Title>

        <EmDialog.Description>
          They will get an email with a link to join this workspace.
        </EmDialog.Description>

        <EmDialog.Footer>
          <EmButton variant="tertiary" @click="open = false">Cancel</EmButton>

          <EmButton @click="onSend">Send invite</EmButton>
        </EmDialog.Footer>

        <EmDialog.Close />
      </EmDialog.Content>
    </EmDialog>

    <span v-if="sent" class="emerald-docs-note" role="status">Invite sent.</span>
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
