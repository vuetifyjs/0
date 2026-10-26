<script setup lang="ts">
  import {
    Md1Button,
    Md1Card,
    Md1Checkbox,
    Md1Chip,
    Md1Dialog,
    Md1IconToggle,
    Md1List,
    Md1Menu,
    Md1Slider,
    Md1Snackbar,
    Md1Switch,
    Md1Tabs,
    Md1TextField,
    Md1Toolbar,
  } from '@paper/md1'

  import type { Md1IconName } from '@paper/md1'

  import { ref, shallowRef, toRef } from 'vue'

  interface Stop {
    icon: Md1IconName
    primary: string
    secondary: string
  }

  interface Trip {
    title: string
    subtitle: string
    stops: Stop[]
  }

  const TRIPS: Record<string, Trip> = {
    upcoming: {
      title: 'Lisbon',
      subtitle: 'Fri 14 to Sun 16 June',
      stops: [
        { icon: 'schedule', primary: 'TAP 1350 to Lisbon', secondary: 'Departs 7:45 AM, gate B12' },
        { icon: 'home', primary: 'Casa do Largo', secondary: 'Check in after 2:00 PM' },
        { icon: 'event', primary: 'Dinner in Alfama', secondary: 'Table for two at 8:30 PM' },
      ],
    },
    saved: {
      title: 'Porto',
      subtitle: 'Saved for September',
      stops: [
        { icon: 'schedule', primary: 'Alfa Pendular to Porto', secondary: 'Three hours from Santa Apolónia' },
        { icon: 'home', primary: 'Ribeira guest house', secondary: 'Two nights, river view' },
        { icon: 'star', primary: 'Port cellars in Gaia', secondary: 'Tasting at 5:00 PM' },
      ],
    },
    past: {
      title: 'Sintra',
      subtitle: 'Saturday 4 May',
      stops: [
        { icon: 'near-me', primary: 'Rossio to Sintra', secondary: 'Forty minutes each way' },
        { icon: 'place', primary: 'Pena Palace', secondary: 'Gardens and terraces' },
        { icon: 'photo', primary: 'Lunch at Tascantiga', secondary: 'Petiscos on the hill' },
      ],
    },
  }

  const SUGGESTIONS = ['Lisbon', 'Porto', 'Madeira']

  const tab = shallowRef('upcoming')
  const destination = shallowRef('Lisbon')
  const budget = shallowRef(60)
  const alerts = shallowRef(true)
  const seat = shallowRef(false)
  const favorites = ref<Record<string, boolean>>({ upcoming: false, saved: true, past: false })
  const snackbar = shallowRef(false)
  const message = shallowRef('')

  const trip = toRef(() => TRIPS[tab.value] ?? TRIPS.upcoming!)

  function notify (text: string) {
    message.value = text
    snackbar.value = true
  }

  function onFavorite (value?: boolean) {
    notify(value ? `${trip.value.title} added to favourites` : `${trip.value.title} removed from favourites`)
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-overview-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Trips</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" @click="notify('Search opened')" />

        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item @select="notify('Settings opened')">Settings</Md1Menu.Item>

            <Md1Menu.Item @select="notify('Help opened')">Help</Md1Menu.Item>

            <Md1Menu.Item @select="notify('Thanks for the feedback')">Send feedback</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>

      <Md1Toolbar.Extension>
        <Md1Tabs v-model="tab">
          <Md1Tabs.List label="Trips">
            <Md1Tabs.Item label="Next" value="upcoming" />

            <Md1Tabs.Item label="Saved" value="saved" />

            <Md1Tabs.Item label="Past" value="past" />
          </Md1Tabs.List>
        </Md1Tabs>
      </Md1Toolbar.Extension>
    </Md1Toolbar>

    <div class="md1-docs-overview-content">
      <Md1Card>
        <div class="md1-docs-overview-heading">
          <Md1Card.Title>{{ trip.title }}</Md1Card.Title>

          <Md1Card.Subtitle>{{ trip.subtitle }}</Md1Card.Subtitle>

          <Md1IconToggle
            v-model="favorites[tab]"
            aria-label="Favourite"
            class="md1-docs-overview-favorite"
            icon="favorite-border"
            icon-on="favorite"
            @update:model-value="onFavorite"
          />
        </div>

        <Md1List aria-label="Itinerary">
          <Md1List.Item v-for="stop in trip.stops" :key="stop.primary">
            <Md1List.Icon :name="stop.icon" />

            <Md1List.Content>
              <Md1List.Primary>{{ stop.primary }}</Md1List.Primary>

              <Md1List.Secondary>{{ stop.secondary }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>

        <Md1Card.Actions>
          <Md1Dialog>
            <Md1Dialog.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs">Cancel</Md1Button>
            </Md1Dialog.Activator>

            <Md1Dialog.Content>
              <Md1Dialog.Text>Cancel your trip to {{ trip.title }}?</Md1Dialog.Text>

              <Md1Dialog.Actions>
                <Md1Dialog.Cancel>Keep</Md1Dialog.Cancel>

                <Md1Dialog.Confirm @confirm="notify('Trip cancelled')">Cancel trip</Md1Dialog.Confirm>
              </Md1Dialog.Actions>
            </Md1Dialog.Content>
          </Md1Dialog>

          <Md1Button variant="raised" @click="notify('Boarding pass ready')">Check in</Md1Button>
        </Md1Card.Actions>
      </Md1Card>

      <Md1Card>
        <Md1Card.Title>Trip preferences</Md1Card.Title>

        <div class="md1-docs-overview-form">
          <Md1TextField v-model="destination" helper="City or region" label="Destination" />

          <div class="md1-docs-overview-chips">
            <Md1Chip
              v-for="place in SUGGESTIONS"
              :key="place"
              icon="place"
              @click="destination = place"
            >
              {{ place }}
            </Md1Chip>
          </div>

          <div>
            <Md1Slider v-model="budget" label="Budget" />

            <p class="md1-docs-readout md1-docs-overview-caption">Budget up to €{{ budget * 10 }}</p>
          </div>

          <Md1Switch v-model="alerts" label="Price alerts" />

          <Md1Checkbox v-model="seat" label="Window seat" />
        </div>

        <Md1Card.Actions align="end">
          <Md1Button @click="notify(`Saved: ${destination || 'anywhere'}, budget ${budget}`)">Save</Md1Button>
        </Md1Card.Actions>
      </Md1Card>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="snackbar" action="Undo">{{ message }}</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  /* The overview is a whole screen: it grows with its content, and the snackbar pins to its bottom edge. */
  .md1-docs-screen.md1-docs-overview-screen {
    height: auto;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-overview-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    align-items: start;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
  }

  /* The trip heading: title and subtitle on the keyline, the favourite toggle at the end edge beside the title. */
  .md1-docs-overview-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .md1-docs-overview-heading > :not(.md1-docs-overview-favorite) {
    grid-column: 1;
  }

  .md1-docs-overview-favorite {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: start;
    margin: var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px) 0 0;
  }

  .md1-docs-overview-form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px);
  }

  /* The slider's caption: start aligned under the track, in the secondary ink. */
  .md1-docs-overview-caption {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-overview-form .md1-docs-overview-caption {
    text-align: start;
  }

  .md1-docs-overview-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
