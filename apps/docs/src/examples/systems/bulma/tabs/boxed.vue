<script setup lang="ts">
  import { BuTab, BuTabList, BuTabPanel, BuTabs } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const tab = shallowRef('pictures')
</script>

<template>
  <BuTabs v-model="tab">
    <BuTabList boxed>
      <BuTab value="pictures">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-image" /></span>
        <span>Pictures</span>
      </BuTab>

      <BuTab value="music">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-music" /></span>
        <span>Music</span>
      </BuTab>

      <BuTab value="videos">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-film" /></span>
        <span>Videos</span>
      </BuTab>
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

    <BuTabPanel value="videos">
      <div class="content mt-4">
        <p>Videos panel.</p>
      </div>
    </BuTabPanel>
  </BuTabs>
</template>
