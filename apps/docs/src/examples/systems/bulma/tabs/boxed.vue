<script setup lang="ts">
  import { BuTabs } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const tab = shallowRef('pictures')
</script>

<template>
  <BuTabs v-model="tab">
    <BuTabs.List boxed>
      <BuTabs.Tab value="pictures">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-image" /></span>
        <span>Pictures</span>
      </BuTabs.Tab>

      <BuTabs.Tab value="music">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-music" /></span>
        <span>Music</span>
      </BuTabs.Tab>

      <BuTabs.Tab value="videos">
        <span class="icon is-small"><i aria-hidden="true" class="fas fa-film" /></span>
        <span>Videos</span>
      </BuTabs.Tab>
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

    <BuTabs.Panel value="videos">
      <div class="content mt-4">
        <p>Videos panel.</p>
      </div>
    </BuTabs.Panel>
  </BuTabs>
</template>
