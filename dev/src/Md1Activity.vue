<script setup lang="ts">
  // Components
  import { Md1Button, Md1IconToggle, Md1List, Md1ProgressLinear, Md1Subheader, Md1Tooltip } from '@paper/md1'

  // Framework
  import { useTimer } from '@vuetify/v0'

  // Context
  import { activity } from './Md1Data'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const days = ['Today', 'Yesterday', 'Earlier'] as const

  const groups = toRef(() => days
    .map(day => ({ day, rows: activity.all.value.filter(entry => entry.day === day) }))
    .filter(group => group.rows.length > 0),
  )

  const unread = toRef(() => activity.all.value.filter(entry => entry.unread).length)

  const loading = shallowRef(false)

  const timer = useTimer(() => {
    activity.more()
    loading.value = false
  }, { duration: 900 })

  function onMore () {
    loading.value = true
    timer.start()
  }
</script>

<template>
  <section class="md1-demo-activity">
    <div class="md1-demo-activity__bar">
      <span class="md1-demo-activity__count" role="status">
        {{ unread > 0 ? `${unread} unread` : 'All caught up' }}
      </span>

      <Md1Button :disabled="unread === 0" @click="activity.allRead()">Mark all read</Md1Button>
    </div>

    <div class="md1-demo-activity__sheet md1-elevation-2">
      <template v-for="group in groups" :key="group.day">
        <Md1Subheader>{{ group.day }}</Md1Subheader>

        <Md1List :aria-label="`${group.day} activity`" :lines="2">
          <Md1List.Item
            v-for="entry in group.rows"
            :key="entry.id"
            :class="{ 'md1-demo-activity-unread': entry.unread }"
          >
            <Md1List.Avatar>{{ entry.actor.charAt(0) }}</Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ entry.action }}</Md1List.Primary>

              <Md1List.Secondary>{{ entry.detail }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <div class="md1-demo-activity__meta">
                <span class="md1-demo-activity__time">{{ entry.time }}</span>

                <Md1Tooltip>
                  <Md1Tooltip.Activator v-slot="{ attrs }">
                    <Md1IconToggle
                      v-bind="attrs"
                      :aria-label="`Star the update from ${entry.actor}`"
                      icon="star-border"
                      icon-on="star"
                      :model-value="entry.starred"
                      @update:model-value="activity.star(entry.id)"
                    />
                  </Md1Tooltip.Activator>

                  <Md1Tooltip.Content>{{ entry.starred ? 'Unstar' : 'Star' }}</Md1Tooltip.Content>
                </Md1Tooltip>
              </div>
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </template>

      <div class="md1-demo-activity__foot">
        <div class="md1-demo-activity__strip">
          <Md1ProgressLinear :active="loading" aria-label="Loading older activity" />
        </div>

        <div class="md1-demo-activity__more">
          <Md1Button :disabled="loading || activity.exhausted.value" @click="onMore">
            {{ activity.exhausted.value ? 'No more activity' : 'Show more' }}
          </Md1Button>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
  .md1-demo-activity {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 840px;
    margin-inline: auto;
  }

  /* The feed's own header row: the unread count at the start, the sweep action at the end. */
  .md1-demo-activity__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-1, 8px);
    min-height: 36px;
  }

  .md1-demo-activity__count {
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-activity__sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* An unread row: the bolder ink of unread mail, on the action line and its time. */
  .md1-demo-activity-unread .md1-list__primary,
  .md1-demo-activity-unread .md1-demo-activity__time {
    font-weight: 500;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The end column stacks the timestamp over the row's star. */
  .md1-demo-activity__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .md1-demo-activity__time {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-activity__foot {
    padding-bottom: var(--md1-spacing-1, 8px);
  }

  /* The strip reserves the bar's 4 dp while inactive (the bar itself mounts on demand), so Show more never moves. */
  .md1-demo-activity__strip {
    min-height: 4px;
  }

  .md1-demo-activity__more {
    display: flex;
    justify-content: center;
    padding: var(--md1-spacing-1, 8px);
  }
</style>
