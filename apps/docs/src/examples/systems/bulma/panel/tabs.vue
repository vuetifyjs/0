<script setup lang="ts">
  import {
    BuPanel,
    BuPanelBlock,
    BuPanelHeading,
    BuPanelIcon,
    BuPanelTab,
    BuPanelTabs,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const selected = shallowRef('bulma')
  const tab = shallowRef<string>()
</script>

<template>
  <BuPanel v-model="selected">
    <BuPanelHeading>Repositories</BuPanelHeading>

    <div class="panel-block">
      <p class="control has-icons-left">
        <input class="input" placeholder="Search" type="text">

        <span class="icon is-left">
          <i aria-hidden="true" class="fas fa-search" />
        </span>
      </p>
    </div>

    <BuPanelTabs v-model="tab">
      <BuPanelTab value="All">All</BuPanelTab>
      <BuPanelTab value="Public">Public</BuPanelTab>
      <BuPanelTab value="Private">Private</BuPanelTab>
      <BuPanelTab value="Sources">Sources</BuPanelTab>
      <BuPanelTab value="Forks">Forks</BuPanelTab>
    </BuPanelTabs>

    <BuPanelBlock value="bulma">
      <BuPanelIcon icon="fas fa-book" />
      bulma
    </BuPanelBlock>

    <BuPanelBlock value="marksheet">
      <BuPanelIcon icon="fas fa-book" />
      marksheet
    </BuPanelBlock>

    <BuPanelBlock value="minireset.css">
      <BuPanelIcon icon="fas fa-book" />
      minireset.css
    </BuPanelBlock>

    <BuPanelBlock value="jgthms.github.io">
      <BuPanelIcon icon="fas fa-book" />
      jgthms.github.io
    </BuPanelBlock>

    <BuPanelBlock value="daniellowtw/infboard">
      <BuPanelIcon icon="fas fa-code-branch" />
      daniellowtw/infboard
    </BuPanelBlock>

    <BuPanelBlock value="mojs">
      <BuPanelIcon icon="fas fa-code-branch" />
      mojs
    </BuPanelBlock>

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
