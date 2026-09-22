<script setup lang="ts">
  import { BuTabs } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const tab = shallowRef('pictures')
</script>

<template>
  <BuTabs v-model="tab">
    <BuTabs.List>
      <BuTabs.Tab value="pictures">Pictures</BuTabs.Tab>

      <BuTabs.Tab value="music">Music</BuTabs.Tab>
    </BuTabs.List>

    <BuTabs.Panel value="pictures">
      <div class="content mt-4">
        <p>Pictures panel.</p>
      </div>
    </BuTabs.Panel>

    <BuTabs.Panel value="music">
      <div class="content mt-4">
        <p>Music panel.</p>
      </div>
    </BuTabs.Panel>
  </BuTabs>
</template>
