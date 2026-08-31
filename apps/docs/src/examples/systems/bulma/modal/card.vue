<script setup lang="ts">
  import { BuModal } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="button is-link" type="button" @click="open = true">
    Open card modal
  </button>

  <BuModal v-model="open">
    <BuModal.Card>
      <BuModal.Head>
        <BuModal.Title>Modal title</BuModal.Title>
        <BuModal.Delete />
      </BuModal.Head>

      <BuModal.Body>
        <p>
          Composing <code>BuModal.Card</code> renders the <code>.modal-card</code>
          variant: head, body and foot regions. Compose <code>BuModal.Delete</code>
          in the head for the card-head X.
        </p>
      </BuModal.Body>

      <BuModal.Foot>
        <div class="buttons">
          <button class="button is-success" type="button" @click="open = false">
            Save changes
          </button>

          <button class="button" type="button" @click="open = false">
            Cancel
          </button>
        </div>
      </BuModal.Foot>
    </BuModal.Card>
  </BuModal>
</template>
