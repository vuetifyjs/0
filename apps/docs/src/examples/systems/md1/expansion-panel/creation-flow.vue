<script setup lang="ts">
  import { Md1Button, Md1ExpansionPanel, Md1Radio, Md1TextField } from '@paper/md1'
  import { nextTick, ref, shallowRef, toRef, useTemplateRef } from 'vue'

  type Step = 'name' | 'goal' | 'budget'

  const ORDER: Step[] = ['name', 'goal', 'budget']

  const GOALS: Record<string, string> = {
    visits: 'Website visits',
    calls: 'Phone calls',
    store: 'Store visits',
  }

  const BUDGETS: Record<string, string> = {
    10: '$10 a day',
    25: '$25 a day',
    50: '$50 a day',
  }

  const panel = shallowRef<Step | undefined>('name')
  // What each step has committed, and what its open panel is editing.
  const saved = ref<Record<Step, string>>({ name: '', goal: '', budget: '' })
  const draft = ref<Record<Step, string>>({ name: 'Spring sale', goal: 'visits', budget: '25' })

  const summary = toRef(() => ({
    name: saved.value.name,
    goal: GOALS[saved.value.goal],
    budget: BUDGETS[saved.value.budget],
  }))

  const ready = toRef(() => ORDER.every(step => saved.value[step]))
  const flow = useTemplateRef<HTMLElement>('flow')

  function onCancel (step: Step) {
    draft.value[step] = saved.value[step] || draft.value[step]
    panel.value = undefined
  }

  // Save commits the step into its header, closes it and opens the next one the flow still needs.
  async function onSave (step: Step) {
    saved.value[step] = draft.value[step].trim()

    const index = ORDER.indexOf(step)
    const next = ORDER.slice(index + 1).find(later => !saved.value[later])

    panel.value = next

    await nextTick()

    // The Save button closed with its panel: hand focus to the step that opened, or to Publish at the end.
    const target = next
      ? flow.value?.querySelectorAll<HTMLElement>('.md1-expansion-panel__header')[ORDER.indexOf(next)]
      : flow.value?.querySelector<HTMLElement>('.md1-docs-flow-publish button')

    target?.focus()
  }
</script>

<template>
  <div ref="flow" class="md1-docs-flow">
    <Md1ExpansionPanel v-model="panel" class="md1-docs-panels">
      <Md1ExpansionPanel.Item value="name">
        <Md1ExpansionPanel.Header label="Campaign name" :secondary="summary.name ? undefined : 'Step 1'" :summary="summary.name" />

        <Md1ExpansionPanel.Content>
          <Md1TextField v-model="draft.name" helper="Only you see this name" label="Campaign name" />

          <Md1ExpansionPanel.Actions>
            <Md1Button @click="onCancel('name')">Cancel</Md1Button>

            <Md1Button :disabled="!draft.name.trim()" @click="onSave('name')">Save</Md1Button>
          </Md1ExpansionPanel.Actions>
        </Md1ExpansionPanel.Content>
      </Md1ExpansionPanel.Item>

      <Md1ExpansionPanel.Item value="goal">
        <Md1ExpansionPanel.Header label="Goal" :secondary="summary.goal ? undefined : 'Step 2'" :summary="summary.goal" />

        <Md1ExpansionPanel.Content>
          <Md1Radio.Group v-model="draft.goal" aria-label="Goal">
            <Md1Radio v-for="(label, value) in GOALS" :key="value" :label :value />
          </Md1Radio.Group>

          <Md1ExpansionPanel.Actions>
            <Md1Button @click="onCancel('goal')">Cancel</Md1Button>

            <Md1Button @click="onSave('goal')">Save</Md1Button>
          </Md1ExpansionPanel.Actions>
        </Md1ExpansionPanel.Content>
      </Md1ExpansionPanel.Item>

      <Md1ExpansionPanel.Item value="budget">
        <Md1ExpansionPanel.Header label="Daily budget" :secondary="summary.budget ? undefined : 'Step 3'" :summary="summary.budget" />

        <Md1ExpansionPanel.Content>
          <Md1Radio.Group v-model="draft.budget" aria-label="Daily budget">
            <Md1Radio v-for="(label, value) in BUDGETS" :key="value" :label :value />
          </Md1Radio.Group>

          <Md1ExpansionPanel.Actions>
            <Md1Button @click="onCancel('budget')">Cancel</Md1Button>

            <Md1Button @click="onSave('budget')">Save</Md1Button>
          </Md1ExpansionPanel.Actions>
        </Md1ExpansionPanel.Content>
      </Md1ExpansionPanel.Item>
    </Md1ExpansionPanel>

    <div class="md1-docs-flow-publish">
      <Md1Button :disabled="!ready" variant="raised">Publish campaign</Md1Button>
    </div>
  </div>
</template>

<style>
  .md1-docs-flow {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 640px;
  }

  .md1-docs-panels {
    width: 100%;
    max-width: 640px;
  }

  /* Publish sits after the flow, at its end: the step the saved panels lead to. */
  .md1-docs-flow-publish {
    display: flex;
    justify-content: flex-end;
  }
</style>
