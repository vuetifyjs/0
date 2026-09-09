<script setup lang="ts">
  import {
    BuBreadcrumb,
    BuCheckbox,
    BuControl,
    BuDropdown,
    BuField,
    BuInput,
    BuLabel,
    BuMenu,
    BuModal,
    BuNavbar,
    BuNotification,
    BuNumberField,
    BuPagination,
    BuPanel,
    BuSelect,
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
</script>

<template>
  <BuNavbar v-model="nav">
    <BuNavbar.Brand :burger="false">
      <a class="navbar-item" href="#">
        <strong>Paper / Bulma</strong>
      </a>
    </BuNavbar.Brand>

    <BuNavbar.Menu>
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
    </BuNavbar.Menu>
  </BuNavbar>

  <section class="section">
    <BuBreadcrumb>
      <BuBreadcrumb.Item href="#">
        Paper
      </BuBreadcrumb.Item>

      <BuBreadcrumb.Item href="#">
        Bulma
      </BuBreadcrumb.Item>

      <BuBreadcrumb.Item current>
        Dashboard
      </BuBreadcrumb.Item>
    </BuBreadcrumb>

    <div class="columns">
      <div class="column is-one-quarter">
        <BuMenu v-model="section">
          <BuMenu.Label>General</BuMenu.Label>

          <BuMenu.List>
            <BuMenu.Item>
              <BuMenu.Link value="Dashboard">Dashboard</BuMenu.Link>
            </BuMenu.Item>

            <BuMenu.Item>
              <BuMenu.Link value="Customers">Customers</BuMenu.Link>
            </BuMenu.Item>
          </BuMenu.List>

          <BuMenu.Label>Transactions</BuMenu.Label>

          <BuMenu.List>
            <BuMenu.Item>
              <BuMenu.Link value="Payments">Payments</BuMenu.Link>
            </BuMenu.Item>

            <BuMenu.Item>
              <BuMenu.Link value="Transfers">Transfers</BuMenu.Link>
            </BuMenu.Item>

            <BuMenu.Item>
              <BuMenu.Link value="Balance">Balance</BuMenu.Link>
            </BuMenu.Item>
          </BuMenu.List>
        </BuMenu>
      </div>

      <div class="column">
        <BuNotification v-model="notice" color="info">
          <BuNotification.Delete />
          Bulma ships the classes. Escape, focus return, and the burger toggle
          come from Vuetify0.
        </BuNotification>

        <BuTabs v-model="tab">
          <BuTabs.List>
            <BuTabs.Tab value="repos">Repositories</BuTabs.Tab>
            <BuTabs.Tab value="settings">Settings</BuTabs.Tab>
          </BuTabs.List>

          <BuTabs.Panel value="repos">
            <div class="is-flex is-justify-content-space-between is-align-items-center mb-3 mt-4">
              <p class="title is-5 mb-0">{{ section }}</p>

              <BuDropdown menu right>
                <BuDropdown.Trigger v-slot="{ attrs }">
                  <button class="button is-small" type="button" v-bind="attrs">
                    <span>Actions</span>

                    <span class="icon is-small">
                      <i aria-hidden="true" class="fas fa-angle-down" />
                    </span>
                  </button>
                </BuDropdown.Trigger>

                <BuDropdown.Menu v-slot="{ close, item }">
                  <a class="dropdown-item" v-bind="item" @click="close(); modal = true">New repository</a>
                  <a class="dropdown-item" v-bind="item" @click="close">Clone</a>
                  <hr class="dropdown-divider">
                  <a class="dropdown-item" v-bind="item" @click="close">Settings</a>
                </BuDropdown.Menu>
              </BuDropdown>
            </div>

            <BuPanel v-model="repo">
              <BuPanel.Heading>Repositories</BuPanel.Heading>

              <BuPanel.Block value="bulma">
                <BuPanel.Icon icon="fas fa-book" />
                bulma
              </BuPanel.Block>

              <BuPanel.Block value="paper">
                <BuPanel.Icon icon="fas fa-book" />
                paper
              </BuPanel.Block>

              <BuPanel.Block value="v0">
                <BuPanel.Icon icon="fas fa-code-branch" />
                vuetify0
              </BuPanel.Block>
            </BuPanel>

            <BuPagination v-slot="{ items }" v-model="page" class="mt-4" :pages="4">
              <BuPagination.Prev />

              <BuPagination.Next />

              <BuPagination.List>
                <template v-for="(item, index) in items" :key="index">
                  <BuPagination.Item v-if="item.type === 'page'" :value="item.value" />

                  <BuPagination.Ellipsis v-else />
                </template>
              </BuPagination.List>
            </BuPagination>
          </BuTabs.Panel>

          <BuTabs.Panel value="settings">
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
                  <BuNumberField.Decrement />
                  <BuNumberField.Input expanded />
                  <BuNumberField.Increment />
                </BuNumberField>
              </BuField>

              <BuField>
                <BuControl>
                  <BuCheckbox v-model="privateRepo">Make this repository private</BuCheckbox>
                </BuControl>
              </BuField>
            </div>
          </BuTabs.Panel>
        </BuTabs>
      </div>
    </div>
  </section>

  <BuModal v-model="modal">
    <BuModal.Card>
      <BuModal.Head>
        <BuModal.Title>New repository</BuModal.Title>
        <BuModal.Delete />
      </BuModal.Head>

      <BuModal.Body>
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
      </BuModal.Body>

      <BuModal.Foot>
        <div class="buttons">
          <button class="button is-success" type="button" @click="modal = false">
            Create
          </button>

          <button class="button" type="button" @click="modal = false">
            Cancel
          </button>
        </div>
      </BuModal.Foot>
    </BuModal.Card>
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
