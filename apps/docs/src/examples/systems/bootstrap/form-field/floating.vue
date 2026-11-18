<script setup lang="ts">
  import { BFormControl, BFormField, BFormLabel } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const email = shallowRef('')
  const name = shallowRef('')
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <BFormField floating>
      <BFormLabel for="floatingEmail">Email address</BFormLabel>

      <BFormControl
        id="floatingEmail"
        v-model="email"
        placeholder="name@example.com"
        type="email"
      />
    </BFormField>

    <BFormField always floating>
      <BFormLabel for="floatingName">Name</BFormLabel>

      <BFormControl
        id="floatingName"
        v-model="name"
        placeholder="Ada Lovelace"
      />
    </BFormField>
  </div>
</template>
