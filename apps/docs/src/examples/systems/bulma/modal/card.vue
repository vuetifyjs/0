<script setup lang="ts">
  import { BuModal, BuModalBody, BuModalCard, BuModalDelete, BuModalFoot, BuModalHead, BuModalTitle } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="button is-link" type="button" @click="open = true">
    Open card modal
  </button>

  <BuModal v-model="open">
    <BuModalCard>
      <BuModalHead>
        <BuModalTitle>Modal title</BuModalTitle>
        <BuModalDelete />
      </BuModalHead>

      <BuModalBody>
        <p>
          Composing <code>BuModalCard</code> renders the <code>.modal-card</code>
          variant: head, body and foot regions. Compose <code>BuModalDelete</code>
          in the head for the card-head X.
        </p>
      </BuModalBody>

      <BuModalFoot>
        <div class="buttons">
          <button class="button is-success" type="button" @click="open = false">
            Save changes
          </button>

          <button class="button" type="button" @click="open = false">
            Cancel
          </button>
        </div>
      </BuModalFoot>
    </BuModalCard>
  </BuModal>
</template>
