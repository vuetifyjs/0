<script setup lang="ts">
  import { BuPanel } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const selected = shallowRef('bulma')
  const tab = shallowRef<string>()
</script>

<template>
  <BuPanel v-model="selected">
    <BuPanel.Heading>Repositories</BuPanel.Heading>

    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" placeholder="Search" type="text">

        <span class="icon is-left">
          <i aria-hidden="true" class="fas fa-search" />
        </span>
      </p>
    </div>

    <BuPanel.Tabs v-model="tab">
      <BuPanel.Tab value="All">All</BuPanel.Tab>
      <BuPanel.Tab value="Public">Public</BuPanel.Tab>
      <BuPanel.Tab value="Private">Private</BuPanel.Tab>
      <BuPanel.Tab value="Sources">Sources</BuPanel.Tab>
      <BuPanel.Tab value="Forks">Forks</BuPanel.Tab>
    </BuPanel.Tabs>

    <BuPanel.Block value="bulma">
      <BuPanel.Icon icon="fas fa-book" />
      bulma
    </BuPanel.Block>

    <BuPanel.Block value="marksheet">
      <BuPanel.Icon icon="fas fa-book" />
      marksheet
    </BuPanel.Block>

    <BuPanel.Block value="minireset.css">
      <BuPanel.Icon icon="fas fa-book" />
      minireset.css
    </BuPanel.Block>

    <BuPanel.Block value="jgthms.github.io">
      <BuPanel.Icon icon="fas fa-book" />
      jgthms.github.io
    </BuPanel.Block>

    <BuPanel.Block value="daniellowtw/infboard">
      <BuPanel.Icon icon="fas fa-code-branch" />
      daniellowtw/infboard
    </BuPanel.Block>

    <BuPanel.Block value="mojs">
      <BuPanel.Icon icon="fas fa-code-branch" />
      mojs
    </BuPanel.Block>

    <label class="panel-block">
      <input type="checkbox">
      remember me
    </label>

    <div class="panel-block">
      <button class="button is-link is-outlined is-fullwidth" type="button">
        Reset all filters
      </button>
    </div>
  </BuPanel>
</template>
