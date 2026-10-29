<script lang="ts">
  import { Md1Icon, Md1List, Md1Subheader } from '@paper/md1'

  // Framework
  import { isString } from '@vuetify/v0'

  import { search } from './Md1Data'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Search' })

  const route = useRoute()
  const router = useRouter()

  const query = toRef(() => isString(route.query.q) ? route.query.q : '')
  const groups = search(query)
  const count = toRef(() => groups.value.reduce((total, group) => total + group.hits.length, 0))

  function open (to: string) {
    router.push(to)
  }

  /** A hit's rendered href, through the router so a non-root base holds. */
  function href (to: string) {
    return router.resolve(to).href
  }
</script>

<template>
  <section class="md1-demo-results">
    <template v-if="query">
      <p class="md1-demo-results__count" role="status">
        {{ count === 1 ? '1 result' : `${count} results` }} for &ldquo;{{ query }}&rdquo;
      </p>

      <div v-if="groups.length > 0" class="md1-demo-results__sheet md1-elevation-2">
        <template v-for="group in groups" :key="group.label">
          <Md1Subheader>{{ group.label }}</Md1Subheader>

          <Md1List :lines="2">
            <Md1List.Item
              v-for="hit in group.hits"
              :key="hit.id"
              :href="href(hit.to)"
              :value="hit.id"
              @click.prevent="open(hit.to)"
            >
              <Md1List.Icon :name="group.icon" />

              <Md1List.Content>
                <Md1List.Primary>{{ hit.title }}</Md1List.Primary>

                <Md1List.Secondary>{{ hit.detail }}</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>
        </template>
      </div>

      <div v-else class="md1-demo-results__empty">
        <Md1Icon aria-hidden="true" class="md1-demo-results__art" name="search" />

        <p class="md1-demo-results__tagline">Nothing matches &ldquo;{{ query }}&rdquo;</p>

        <p class="md1-demo-results__text">Check the spelling, or try a shorter word.</p>
      </div>
    </template>

    <div v-else class="md1-demo-results__empty">
      <Md1Icon aria-hidden="true" class="md1-demo-results__art" name="search" />

      <p class="md1-demo-results__tagline">Search your workspace</p>

      <p class="md1-demo-results__text">The search icon in the toolbar covers messages, contacts, orders, files and activity.</p>
    </div>
  </section>
</template>

<style>
  .md1-demo-results {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 720px;
  }

  .md1-demo-results__count {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-results__sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    padding-bottom: var(--md1-spacing-1, 8px);
  }

  /* The empty-states pattern: the state belongs to the screen, not a sheet of its own. */
  .md1-demo-results__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 50vh;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  .md1-demo-results__art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-demo-results__tagline {
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-results__text {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
