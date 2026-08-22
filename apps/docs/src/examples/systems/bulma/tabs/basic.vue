<script setup lang="ts">
  import { BuTab, BuTabList, BuTabPanel, BuTabs } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const tab = shallowRef('pictures')
</script>

<template>
  <BuTabs v-model="tab">
    <BuTabList>
      <BuTab value="pictures">Pictures</BuTab>

      <BuTab value="music">Music</BuTab>
    </BuTabList>

    <BuTabPanel value="pictures">
      <div class="content mt-4">
        <p>Pictures panel.</p>
      </div>
    </BuTabPanel>

    <BuTabPanel value="music">
      <div class="content mt-4">
        <p>Music panel.</p>
      </div>
    </BuTabPanel>
  </BuTabs>
</template>
