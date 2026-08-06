<script setup lang="ts">
  import { BuModal, BuModalClose, BuModalContent } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="button is-primary" type="button" @click="open = true">
    Open modal
  </button>

  <BuModal v-model="open">
    <BuModalContent>
      <div class="box">
        <h3 class="title is-5">Bring your own JS</h3>

        <p>
          Bulma ships the <code>.modal</code> styles and stops there. Escape, focus
          return and the backdrop click come from Vuetify0.
        </p>
      </div>
    </BuModalContent>

    <BuModalClose />
  </BuModal>
</template>
