<script setup lang="ts">
  import { Md1Stepper } from '@paper/md1'
  import { shallowRef } from 'vue'

  const step = shallowRef('policy')

  const steps = [
    {
      value: 'policy',
      label: 'Read the policy',
      body: [
        'Employees may work remotely up to three days a week once they have completed their probation period and their manager has agreed a schedule.',
        'Remote days are agreed a month ahead in the team calendar. Changes inside that month need the manager\'s approval and should be rare.',
        'Core hours are 10:00 to 15:00 in the employee\'s contracted time zone. Outside core hours, work when it suits the team and the task.',
        'The company provides a laptop, a monitor and a chair for the home office. Other equipment is reimbursed up to the yearly allowance.',
        'Customer data stays on company devices. Never print it, and never copy it to a personal account, drive or phone.',
        'Travel to the office on an in-office day is a commute and is not reimbursed. Travel to a client or an offsite is.',
      ],
    },
    {
      value: 'schedule',
      label: 'Pick your days',
      body: [
        'Choose up to three remote days. Your manager sees the choice in the team calendar and confirms it within a week.',
        'Days that clash with a standing team meeting are flagged so you can move the meeting or the day.',
      ],
    },
    {
      value: 'confirm',
      label: 'Confirm',
      body: [
        'Check the schedule and the equipment list, then send the request. You can change your days again next month.',
      ],
    },
  ]
</script>

<template>
  <div aria-label="Remote work request" class="md1-docs-stepper-sticky" role="region" tabindex="0">
    <Md1Stepper v-model="step">
      <Md1Stepper.Step
        v-for="item in steps"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <Md1Stepper.Content>
          <p v-for="(line, index) in item.body" :key="index" class="md1-docs-stepper-sticky__text">{{ line }}</p>

          <Md1Stepper.Actions />
        </Md1Stepper.Content>
      </Md1Stepper.Step>
    </Md1Stepper>
  </div>
</template>

<style>
  /*
   * The stepper scrolls inside a fixed-height frame, standing in for the page.
   * The header is a plain block in the stepper's column, so position: sticky
   * pins it to the top of whatever scrolls it; it takes the stepper's own fill
   * so the content passes under it, not through it.
   */
  .md1-docs-stepper-sticky {
    box-sizing: border-box;
    inline-size: 100%;
    max-inline-size: 720px;
    block-size: 360px;
    overflow-y: auto;
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  /* The frame's padding is outside the sticky area, so the offset cancels it and the bar pins flush with the frame's top. */
  .md1-docs-stepper-sticky .md1-stepper__header {
    position: sticky;
    inset-block-start: calc(-1 * var(--md1-spacing-1, 8px));
    z-index: 1;
    background: var(--md1-stepper, #FFFFFF);
  }

  .md1-docs-stepper-sticky__text {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }
</style>
