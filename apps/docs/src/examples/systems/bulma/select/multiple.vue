<script setup lang="ts">
  import { BuControl, BuField, BuLabel, BuSelect } from '@paper/bulma'

  import { ref } from 'vue'

  const countries = ref<string[]>([])
</script>

<template>
  <BuField>
    <BuLabel>Countries</BuLabel>

    <BuControl>
      <BuSelect v-model="countries" multiple :rows="8">
        <option value="Argentina">Argentina</option>
        <option value="Bolivia">Bolivia</option>
        <option value="Brazil">Brazil</option>
        <option value="Chile">Chile</option>
        <option value="Colombia">Colombia</option>
        <option value="Ecuador">Ecuador</option>
        <option value="Guyana">Guyana</option>
        <option value="Paraguay">Paraguay</option>
        <option value="Peru">Peru</option>
        <option value="Suriname">Suriname</option>
        <option value="Uruguay">Uruguay</option>
        <option value="Venezuela">Venezuela</option>
      </BuSelect>
    </BuControl>
  </BuField>
</template>
