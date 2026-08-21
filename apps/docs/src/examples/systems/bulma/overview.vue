<script setup lang="ts">
  import {
    BuBreadcrumb,
    BuCheckbox,
    BuControl,
    BuDropdown,
    BuDropdownMenu,
    BuDropdownTrigger,
    BuField,
    BuInput,
    BuLabel,
    BuMenu,
    BuModal,
    BuModalBody,
    BuModalCard,
    BuModalFoot,
    BuModalHead,
    BuModalTitle,
    BuNavbar,
    BuNavbarBrand,
    BuNavbarMenu,
    BuNotification,
    BuNumberField,
    BuNumberFieldDecrement,
    BuNumberFieldIncrement,
    BuNumberFieldInput,
    BuPagination,
    BuPanel,
    BuPanelBlock,
    BuPanelHeading,
    BuPanelIcon,
    BuSelect,
    BuTab,
    BuTabList,
    BuTabPanel,
    BuTabs,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const nav = shallowRef(false)
  const modal = shallowRef(false)
  const notice = shallowRef(true)
  const tab = shallowRef('repos')
  const page = shallowRef(1)
  const section = shallowRef('Dashboard')
  const repo = shallowRef('bulma')
  const name = shallowRef('paper-bulma')
  const visibility = shallowRef('public')
  const watchers = shallowRef<number | null>(3)
  const privateRepo = shallowRef(false)

  const crumbs = [
    { text: 'Paper', href: '#' },
    { text: 'Bulma', href: '#' },
    { text: 'Dashboard' },
  ]

  const menu = [
    {
      label: 'General',
      items: [
        { label: 'Dashboard' },
        { label: 'Customers' },
      ],
    },
    {
      label: 'Transactions',
      items: [
        { label: 'Payments' },
        { label: 'Transfers' },
        { label: 'Balance' },
      ],
    },
  ]
</script>

<template>
  <BuNavbar v-model="nav">
    <BuNavbarBrand :burger="false">
      <a class="navbar-item" href="#">
        <strong>Paper / Bulma</strong>
      </a>
    </BuNavbarBrand>

    <BuNavbarMenu>
      <div class="navbar-start">
        <a class="navbar-item">Dashboard</a>
        <a class="navbar-item">Documentation</a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <button class="button is-primary" type="button" @click="modal = true">
              <strong>New repository</strong>
            </button>
          </div>
        </div>
      </div>
    </BuNavbarMenu>
  </BuNavbar>

  <section class="section">
    <BuBreadcrumb :items="crumbs" />

    <div class="columns">
      <div class="column is-one-quarter">
        <BuMenu v-model="section" :items="menu" />
      </div>

      <div class="column">
        <BuNotification v-model="notice" color="info">
          Bulma ships the classes. Escape, focus return, and the burger toggle
          come from Vuetify0.
        </BuNotification>

        <BuTabs v-model="tab">
          <BuTabList>
            <BuTab value="repos">Repositories</BuTab>
            <BuTab value="settings">Settings</BuTab>
          </BuTabList>

          <BuTabPanel value="repos">
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-3 mt-4">
              <p class="title is-5 mb-0">{{ section }}</p>

              <BuDropdown menu right>
                <BuDropdownTrigger v-slot="{ attrs }">
                  <button class="button is-small" type="button" v-bind="attrs">
                    <span>Actions</span>

                    <span class="icon is-small">
                      <i aria-hidden="true" class="fas fa-angle-down" />
                    </span>
                  </button>
                </BuDropdownTrigger>

                <BuDropdownMenu v-slot="{ close, item }">
                  <a class="dropdown-item" v-bind="item" @click="close(); modal = true">New repository</a>
                  <a class="dropdown-item" v-bind="item" @click="close">Clone</a>
                  <hr class="dropdown-divider">
                  <a class="dropdown-item" v-bind="item" @click="close">Settings</a>
                </BuDropdownMenu>
              </BuDropdown>
            </div>

            <BuPanel v-model="repo">
              <BuPanelHeading>Repositories</BuPanelHeading>

              <BuPanelBlock value="bulma">
                <BuPanelIcon icon="fas fa-book" />
                bulma
              </BuPanelBlock>

              <BuPanelBlock value="paper">
                <BuPanelIcon icon="fas fa-book" />
                paper
              </BuPanelBlock>

              <BuPanelBlock value="v0">
                <BuPanelIcon icon="fas fa-code-branch" />
                vuetify0
              </BuPanelBlock>
            </BuPanel>

            <BuPagination v-model="page" class="mt-4" :pages="4" />
          </BuTabPanel>

          <BuTabPanel value="settings">
            <div class="mt-4">
              <BuField>
                <BuLabel>Repository name</BuLabel>

                <BuControl>
                  <BuInput v-model="name" />
                </BuControl>
              </BuField>

              <BuField>
                <BuLabel>Visibility</BuLabel>

                <BuControl>
                  <BuSelect v-model="visibility">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="internal">Internal</option>
                  </BuSelect>
                </BuControl>
              </BuField>

              <BuField>
                <BuLabel>Watchers</BuLabel>

                <BuNumberField v-model="watchers" :max="99" :min="0">
                  <BuNumberFieldDecrement />
                  <BuNumberFieldInput expanded />
                  <BuNumberFieldIncrement />
                </BuNumberField>
              </BuField>

              <BuField>
                <BuControl>
                  <BuCheckbox v-model="privateRepo">Make this repository private</BuCheckbox>
                </BuControl>
              </BuField>
            </div>
          </BuTabPanel>
        </BuTabs>
      </div>
    </div>
  </section>

  <BuModal v-model="modal">
    <BuModalCard>
      <BuModalHead>
        <BuModalTitle>New repository</BuModalTitle>
      </BuModalHead>

      <BuModalBody>
        <BuField>
          <BuLabel>Name</BuLabel>

          <BuControl>
            <BuInput v-model="name" placeholder="my-project" />
          </BuControl>
        </BuField>

        <BuField>
          <BuLabel>Visibility</BuLabel>

          <BuControl>
            <BuSelect v-model="visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </BuSelect>
          </BuControl>
        </BuField>
      </BuModalBody>

      <BuModalFoot>
        <div class="buttons">
          <button class="button is-success" type="button" @click="modal = false">
            Create
          </button>

          <button class="button" type="button" @click="modal = false">
            Cancel
          </button>
        </div>
      </BuModalFoot>
    </BuModalCard>
  </BuModal>
</template>

<style>
  /* The docs iframe is always below Bulma's 1024px navbar breakpoint, so the
     burger/drawer path would be the only one that ever runs. Force the desktop
     navbar so this reads as a dashboard, not a phone menu. */
  .navbar-menu,
  .navbar-start,
  .navbar-end {
    align-items: stretch;
    display: flex;
  }

  .navbar-menu {
    flex-grow: 1;
  }

  .navbar-start {
    margin-inline-end: auto;
  }

  .navbar-end {
    margin-inline-start: auto;
  }

  .navbar-item {
    align-items: center;
    display: flex;
  }
</style>
