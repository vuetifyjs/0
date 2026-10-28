<script setup lang="ts">
  // Components
  import { Md1Button, Md1IconToggle, Md1List, Md1ProgressLinear, Md1Subheader } from '@paper/md1'

  // Framework
  import { useTimer } from '@vuetify/v0'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  interface Entry {
    id: number
    actor: string
    action: string
    detail: string
    time: string
    day: 'Today' | 'Yesterday' | 'Earlier'
    unread: boolean
    starred: boolean
  }

  const feed = ref<Entry[]>([
    { id: 1, actor: 'Ana Ribeiro', action: 'Ana Ribeiro placed order 4126', detail: '3 items · 182.40', time: '9:41 AM', day: 'Today', unread: true, starred: false },
    { id: 2, actor: 'Ben Okafor', action: 'Ben Okafor commented on order 4121', detail: '"Can this ship a day earlier?"', time: '8:15 AM', day: 'Today', unread: true, starred: true },
    { id: 3, actor: 'Grace Mbeki', action: 'Grace Mbeki cancelled order 4120', detail: 'Refund issued to the original card', time: '7:02 AM', day: 'Today', unread: true, starred: false },
    { id: 4, actor: 'Chen Wei', action: 'Chen Wei updated the delivery address', detail: 'Order 4124 · now 4 Harbour Lane', time: '4:38 PM', day: 'Yesterday', unread: false, starred: false },
    { id: 5, actor: 'Elif Demir', action: 'Elif Demir paid invoice 221', detail: '221.90 · bank transfer', time: '1:20 PM', day: 'Yesterday', unread: false, starred: true },
    { id: 6, actor: 'Hana Suzuki', action: 'Hana Suzuki asked about gift wrap', detail: '"Is ribbon an option for order 4119?"', time: '10:04 AM', day: 'Yesterday', unread: false, starred: false },
    { id: 7, actor: 'Franco Rossi', action: 'Franco Rossi placed order 4121', detail: '8 items · 540.00', time: 'Oct 21', day: 'Earlier', unread: false, starred: false },
    { id: 8, actor: 'Jade Nguyen', action: 'Jade Nguyen left a 5-star review', detail: '"Fast shipping, beautiful packaging."', time: 'Oct 17', day: 'Earlier', unread: false, starred: false },
  ])

  /** The next page of the feed, loaded behind Show more after a short fake delay. */
  const older: Entry[] = [
    { id: 9, actor: 'Igor Volkov', action: 'Igor Volkov placed order 4118', detail: '2 items · 77.60', time: 'Oct 18', day: 'Earlier', unread: false, starred: false },
    { id: 10, actor: 'Dana Petrov', action: 'Dana Petrov updated their phone number', detail: 'Account details changed', time: 'Oct 16', day: 'Earlier', unread: false, starred: false },
    { id: 11, actor: 'Uma Patel', action: 'Uma Patel placed order 4106', detail: '2 items · 102.30', time: 'Oct 6', day: 'Earlier', unread: false, starred: false },
  ]

  const days = ['Today', 'Yesterday', 'Earlier'] as const

  const groups = toRef(() => days
    .map(day => ({ day, rows: feed.value.filter(entry => entry.day === day) }))
    .filter(group => group.rows.length > 0),
  )

  const unread = toRef(() => feed.value.filter(entry => entry.unread).length)

  function onRead () {
    for (const entry of feed.value) entry.unread = false
  }

  const loading = shallowRef(false)
  const spent = shallowRef(false)

  const timer = useTimer(() => {
    feed.value = [...feed.value, ...older]
    loading.value = false
    spent.value = true
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

      <Md1Button :disabled="unread === 0" @click="onRead">Mark all read</Md1Button>
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

                <Md1IconToggle
                  v-model="entry.starred"
                  :aria-label="`Star the update from ${entry.actor}`"
                  icon="star-border"
                  icon-on="star"
                />
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
          <Md1Button :disabled="loading || spent" @click="onMore">
            {{ spent ? 'No more activity' : 'Show more' }}
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
