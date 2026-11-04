<script setup lang="ts">
  import {
    BAlert,
    BBadge,
    BBreadcrumb,
    BButton,
    BCard,
    BCheck,
    BClose,
    BCol,
    BContainer,
    BDialog,
    BFormControl,
    BFormField,
    BFormLabel,
    BListGroup,
    BNavbar,
    BPagination,
    BProgress,
    BRow,
    BSwitch,
    BTabs,
  } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const modal = shallowRef(false)
  const notice = shallowRef(true)
  const tab = shallowRef('repos')
  const page = shallowRef(1)
  const section = shallowRef('Dashboard')
  const name = shallowRef('paper-bootstrap')
  const visibility = shallowRef('public')
  const coverage = shallowRef(72)
  const privateRepo = shallowRef(false)
  const watching = shallowRef(true)
</script>

<template>
  <BNavbar class="bg-1" expand>
    <BContainer fluid>
      <BNavbar.Brand href="#">Paper / Bootstrap</BNavbar.Brand>

      <BNavbar.Nav class="me-auto">
        <li class="nav-item">
          <a aria-current="page" class="nav-link active" href="#">Dashboard</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="#">Documentation</a>
        </li>
      </BNavbar.Nav>

      <BButton theme="primary" variant="solid" @click="modal = true">
        New repository
      </BButton>
    </BContainer>
  </BNavbar>

  <BContainer class="py-4">
    <div class="d-flex flex-column gap-5">
      <BBreadcrumb>
        <BBreadcrumb.Item>
          <BBreadcrumb.Link href="#">Paper</BBreadcrumb.Link>
        </BBreadcrumb.Item>

        <BBreadcrumb.Divider>/</BBreadcrumb.Divider>

        <BBreadcrumb.Item>
          <BBreadcrumb.Link href="#">Bootstrap</BBreadcrumb.Link>
        </BBreadcrumb.Item>

        <BBreadcrumb.Divider>/</BBreadcrumb.Divider>

        <BBreadcrumb.Item current>
          <BBreadcrumb.Link active href="#">Dashboard</BBreadcrumb.Link>
        </BBreadcrumb.Item>
      </BBreadcrumb>

      <BRow class="gy-5">
        <BCol :sm="4" :span="12">
          <BCard>
            <BCard.Body>
              <BListGroup v-model="section" as="div" selectable>
                <BListGroup.Item action value="Dashboard">Dashboard</BListGroup.Item>
                <BListGroup.Item action value="Customers">Customers</BListGroup.Item>
                <BListGroup.Item action value="Payments">Payments</BListGroup.Item>
                <BListGroup.Item action value="Transfers">Transfers</BListGroup.Item>
              </BListGroup>
            </BCard.Body>
          </BCard>
        </BCol>

        <BCol :sm="8" :span="12">
          <div class="d-flex flex-column gap-5">
            <BAlert
              v-model="notice"
              class="d-flex align-items-center mb-0"
              theme="info"
            >
              <p class="mb-0">
                One check failed. Review the fields below before you publish.
              </p>

              <BClose class="ms-auto" @click="notice = false" />
            </BAlert>

            <BCard>
              <BCard.Body>
                <BTabs v-model="tab">
                  <BTabs.List>
                    <BTabs.Item value="repos">Repositories</BTabs.Item>
                    <BTabs.Item value="settings">Settings</BTabs.Item>
                  </BTabs.List>

                  <BTabs.Content>
                    <BTabs.Panel value="repos">
                      <div class="d-flex flex-column gap-4 mt-5">
                        <div class="d-flex align-items-center justify-content-between">
                          <p class="h5 mb-0">{{ section }}</p>

                          <BBadge theme="primary">v6</BBadge>
                        </div>

                        <BListGroup>
                          <BListGroup.Item class="d-flex justify-content-between align-items-center">
                            bootstrap
                            <BBadge theme="primary" variant="subtle">main</BBadge>
                          </BListGroup.Item>

                          <BListGroup.Item class="d-flex justify-content-between align-items-center">
                            paper
                            <BBadge theme="secondary" variant="subtle">docs</BBadge>
                          </BListGroup.Item>

                          <BListGroup.Item class="d-flex justify-content-between align-items-center">
                            vuetify0
                            <BBadge theme="secondary" variant="subtle">headless</BBadge>
                          </BListGroup.Item>
                        </BListGroup>

                        <BProgress
                          v-model="coverage"
                          label="Catalog coverage"
                        />

                        <BPagination
                          v-model="page"
                          class="mb-0"
                          label="Repository pages"
                          :total="3"
                        >
                          <BPagination.Prev>Previous</BPagination.Prev>
                          <BPagination.Item :value="1">1</BPagination.Item>
                          <BPagination.Item :value="2">2</BPagination.Item>
                          <BPagination.Item :value="3">3</BPagination.Item>
                          <BPagination.Next>Next</BPagination.Next>
                        </BPagination>
                      </div>
                    </BTabs.Panel>

                    <BTabs.Panel value="settings">
                      <div class="d-flex flex-column gap-4 mt-5">
                        <BFormField>
                          <BFormLabel for="overview-name">Repository name</BFormLabel>

                          <BFormControl id="overview-name" v-model="name" />
                        </BFormField>

                        <BFormField>
                          <BFormLabel for="overview-visibility">Visibility</BFormLabel>

                          <BFormControl id="overview-visibility" v-model="visibility" as="select">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="internal">Internal</option>
                          </BFormControl>
                        </BFormField>

                        <div class="form-field">
                          <BCheck id="overview-private" v-model="privateRepo" />
                          <label for="overview-private">Make this repository private</label>
                        </div>

                        <div class="form-field">
                          <BSwitch id="overview-watching" v-model="watching" />
                          <label for="overview-watching">Watch this repository</label>
                        </div>
                      </div>
                    </BTabs.Panel>
                  </BTabs.Content>
                </BTabs>
              </BCard.Body>
            </BCard>
          </div>
        </BCol>
      </BRow>
    </div>
  </BContainer>

  <BDialog v-model="modal">
    <BDialog.Header>
      <BDialog.Title>New repository</BDialog.Title>
      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body>
      <BFormField>
        <BFormLabel for="overview-dialog-name">Name</BFormLabel>

        <BFormControl
          id="overview-dialog-name"
          v-model="name"
          placeholder="my-project"
        />
      </BFormField>
    </BDialog.Body>

    <BDialog.Footer>
      <BButton theme="primary" variant="solid" @click="modal = false">
        Create
      </BButton>

      <BButton variant="outline" @click="modal = false">
        Cancel
      </BButton>
    </BDialog.Footer>
  </BDialog>
</template>
