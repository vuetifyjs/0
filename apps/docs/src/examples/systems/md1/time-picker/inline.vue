<script setup lang="ts">
  import { Md1DropdownButton } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const hours = Array.from({ length: 12 }, (_, index) => String(index === 0 ? 12 : index))
  const minutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, '0'))

  const hour = shallowRef('9')
  const minute = shallowRef('30')
  const period = shallowRef('am')

  // The form still stores the picker's 24 hour HH:mm, whatever the controls show.
  const time = toRef(() => {
    const twelve = Number(hour.value) % 12
    const value = period.value === 'pm' ? twelve + 12 : twelve

    return `${String(value).padStart(2, '0')}:${minute.value}`
  })
</script>

<template>
  <form class="md1-docs-inline-time" @submit.prevent>
    <span id="md1-docs-inline-time-label" class="md1-docs-inline-time__label">Pickup time</span>

    <div aria-labelledby="md1-docs-inline-time-label" class="md1-docs-inline-time__row" role="group">
      <Md1DropdownButton v-model="hour" :aria-label="`Hour, ${hour}`" dense>
        <Md1DropdownButton.Item v-for="value in hours" :key="value" :value>{{ value }}</Md1DropdownButton.Item>
      </Md1DropdownButton>

      <span aria-hidden="true" class="md1-docs-inline-time__colon">:</span>

      <Md1DropdownButton v-model="minute" :aria-label="`Minute, ${minute}`" dense>
        <Md1DropdownButton.Item v-for="value in minutes" :key="value" :value>{{ value }}</Md1DropdownButton.Item>
      </Md1DropdownButton>

      <Md1DropdownButton v-model="period" :aria-label="`AM or PM, ${period.toUpperCase()}`" dense>
        <Md1DropdownButton.Item value="am">AM</Md1DropdownButton.Item>

        <Md1DropdownButton.Item value="pm">PM</Md1DropdownButton.Item>
      </Md1DropdownButton>
    </div>

    <span class="md1-docs-note" role="status">Stored: {{ time }}</span>
  </form>
</template>

<style>
  /*
   * A form row, not a dialog: the label above, the three compact controls on
   * one line, and the stored value under them.
   */
  .md1-docs-inline-time {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
    min-block-size: 200px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-inline-time__label {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-inline-time__row {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-inline-time__colon {
    font-size: var(--md1-type-subheading-size, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-note {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
