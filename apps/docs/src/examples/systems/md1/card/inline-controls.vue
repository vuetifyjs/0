<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Divider, Md1List, Md1Slider, Md1Tabs } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const hours = [
    { label: '8 AM', temperature: 14, wind: 6, humidity: 82, condition: 'Foggy' },
    { label: '11 AM', temperature: 19, wind: 12, humidity: 61, condition: 'Partly cloudy' },
    { label: '2 PM', temperature: 23, wind: 23, humidity: 48, condition: 'Mostly sunny' },
    { label: '5 PM', temperature: 21, wind: 18, humidity: 52, condition: 'Mostly sunny' },
    { label: '8 PM', temperature: 16, wind: 8, humidity: 76, condition: 'Mostly cloudy' },
  ]

  const days = [
    { name: 'Tuesday', high: 24, low: 12 },
    { name: 'Wednesday', high: 22, low: 14 },
    { name: 'Thursday', high: 25, low: 15 },
  ]

  const hour = shallowRef(2)
  const current = toRef(() => hours[hour.value] ?? hours[0]!)

  const range = shallowRef('day')

  const ranges = [
    { value: 'day', label: 'Day', open: '536.65', high: '541.06', low: '536.12', change: '+2.29 (0.43%)' },
    { value: 'week', label: 'Week', open: '529.40', high: '543.90', low: '527.00', change: '+11.08 (2.09%)' },
    { value: 'month', label: 'Month', open: '512.15', high: '548.30', low: '505.70', change: '+28.33 (5.53%)' },
  ]
</script>

<template>
  <div class="md1-docs-cards md1-docs-cards-start">
    <Md1Card>
      <Md1Card.Title>San Francisco</Md1Card.Title>

      <Md1Card.Subtitle>Mon, {{ current.label }}, {{ current.condition }}</Md1Card.Subtitle>

      <div class="md1-docs-card-weather">
        <span class="md1-type-display-2">{{ current.temperature }}°C</span>

        <span class="md1-docs-card-weather-detail md1-type-body-1">Wind {{ current.wind }} km/h · Humidity {{ current.humidity }}%</span>
      </div>

      <Md1Card.Actions>
        <div class="md1-docs-card-control">
          <Md1Slider
            v-model="hour"
            discrete
            label="Time of day"
            :max="hours.length - 1"
          />

          <div aria-hidden="true" class="md1-docs-card-ticks md1-type-caption">
            <span v-for="item in hours" :key="item.label">{{ item.label }}</span>
          </div>
        </div>
      </Md1Card.Actions>

      <Md1List aria-label="Forecast">
        <Md1List.Item v-for="day in days" :key="day.name">
          <Md1List.Content>
            <Md1List.Primary>{{ day.name }}</Md1List.Primary>
          </Md1List.Content>

          <Md1List.Action>{{ day.high }}° / {{ day.low }}°</Md1List.Action>
        </Md1List.Item>
      </Md1List>

      <Md1Divider />

      <Md1Card.Actions>
        <Md1Button>Full report</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <Md1Card>
      <Md1Card.Title>Google Inc</Md1Card.Title>

      <Md1Card.Subtitle>NASDAQ: GOOG</Md1Card.Subtitle>

      <div class="md1-docs-card-tabs">
        <Md1Tabs v-model="range">
          <Md1Tabs.List label="Price range">
            <Md1Tabs.Item
              v-for="item in ranges"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </Md1Tabs.List>

          <Md1Tabs.Panel
            v-for="item in ranges"
            :key="item.value"
            class="md1-docs-card-quote"
            :value="item.value"
          >
            <span class="md1-type-display-1">540.48</span>

            <span class="md1-docs-card-quote-change md1-type-body-2">{{ item.change }}</span>

            <span class="md1-docs-card-quote-range md1-type-body-1">Open {{ item.open }} · High {{ item.high }} · Low {{ item.low }}</span>
          </Md1Tabs.Panel>
        </Md1Tabs>
      </div>
    </Md1Card>
  </div>
</template>

<style>
  .md1-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  /* Cards of different heights keep their own height in the row. */
  .md1-docs-cards-start {
    align-items: start;
  }

  /* The primary content the control changes: the reading for the chosen hour, on the content keyline. */
  .md1-docs-card-weather {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: 0 var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-card-weather-detail,
  .md1-docs-card-quote-range {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The slider spans the action area, its stops labelled underneath. */
  .md1-docs-card-control {
    flex: 1;
    min-width: 0;
    padding: 0 var(--md1-spacing-1, 8px);
  }

  .md1-docs-card-ticks {
    display: flex;
    justify-content: space-between;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * Three fixed tabs share the card's width. The 160 dp desktop column minimum
   * and 24 dp desktop padding are set for an app bar; inside a 344 dp card they
   * would page the tabs behind arrows, so the card keeps the mobile 72 dp and 12 dp.
   */
  .md1-docs-card-tabs .md1-tabs[data-fixed] .md1-tabs__list {
    grid-auto-columns: minmax(72px, 1fr);
  }

  .md1-docs-card-tabs .md1-tabs__item {
    min-width: 72px;
    padding: 0 12px;
  }

  .md1-docs-card-quote {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px) var(--md1-spacing-3, 24px);
  }

  .md1-docs-card-quote-change {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
