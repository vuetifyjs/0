<script setup lang="ts">
  import { BuCheckbox } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const remember = shallowRef(false)
  const agree = shallowRef(false)
</script>

<template>
  <div class="checkboxes">
    <BuCheckbox v-model="remember">Remember me</BuCheckbox>

    <BuCheckbox v-model="agree">
      I agree to the <a href="#">terms and conditions</a>
    </BuCheckbox>
  </div>
</template>
