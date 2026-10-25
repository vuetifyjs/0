<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
  import { MD1_CARD_COLLAPSIBLE, Md1Button, Md1Card, Md1Divider, Md1List, Md1TextField } from '@paper/md1'
  import { ref, shallowRef } from 'vue'

  const expanded = shallowRef(false)
  const open = shallowRef(true)
  const draft = shallowRef('')

  const comments = ref([
    { id: 1, name: 'Trevor Hansen', initial: 'T', when: '1d', text: 'So tasty!' },
    { id: 2, name: 'Sandra Adams', initial: 'S', when: '1d', text: 'I tried this last weekend and the lemon really makes it. I roasted the hearts a little longer than the recipe says and they came out crisp at the edges.' },
    { id: 3, name: 'David Park', initial: 'D', when: '1d', text: 'Then we\'ll go with that: two bunches of basil and a lot more garlic than you think you need.' },
    { id: 4, name: 'Britta Holt', initial: 'B', when: '2d', text: 'Saving this one for the next dinner party. Does it keep overnight?' },
    { id: 5, name: 'Ali Connors', initial: 'A', when: '3d', text: 'It does, but add the breadcrumbs just before serving or they go soft.' },
  ])

  function onComment () {
    const text = draft.value.trim()

    if (!text) return

    comments.value.unshift({ id: Date.now(), name: 'You', initial: 'Y', when: 'now', text })
    draft.value = ''
  }
</script>

<template>
  <div class="md1-docs-cards md1-docs-cards-start">
    <Md1Card v-model:expanded="expanded">
      <Md1Card.Header subtitle="June 1, 2015" title="Basilico Eats" />

      <Md1Card.Supporting>
        <span :class="{ 'md1-docs-card-clamp': !expanded }">
          A flavorful and local favorite of Basilico Eats: try this all-star, easy-to-follow recipe for artichokes with roasted garlic, lemon and toasted breadcrumbs. Trim the stems, halve the hearts, and roast them cut side down until the leaves turn golden. Finish with olive oil, parsley and a squeeze of lemon, and serve while warm.
        </span>
      </Md1Card.Supporting>

      <Md1Card.Actions>
        <Md1Button>Share</Md1Button>

        <Collapsible.Activator v-slot="{ attrs }" :namespace="MD1_CARD_COLLAPSIBLE" renderless>
          <Md1Button v-bind="attrs">{{ expanded ? 'Show less' : 'Read more' }}</Md1Button>
        </Collapsible.Activator>
      </Md1Card.Actions>

      <Md1Card.Expanded>
        Serves four as a side, two as a light lunch. Hands-on time 20 minutes; roasting 35 minutes at 220 °C.
      </Md1Card.Expanded>
    </Md1Card>

    <Md1Card>
      <Md1Card.Header subtitle="34 comments" title="Artichoke recipe" />

      <Md1Card.Actions>
        <Md1Button :icon="open ? 'expand-less' : 'expand-more'" @click="open = !open">{{ open ? 'Hide comments' : 'Show comments' }}</Md1Button>
      </Md1Card.Actions>

      <template v-if="open">
        <Md1Divider />

        <div aria-label="Comments" class="md1-docs-card-scroll" role="region" tabindex="0">
          <Md1List aria-label="Comments" :lines="3">
            <Md1List.Item v-for="comment in comments" :key="comment.id">
              <Md1List.Avatar>{{ comment.initial }}</Md1List.Avatar>

              <Md1List.Content>
                <Md1List.Primary>{{ comment.name }}</Md1List.Primary>

                <Md1List.Secondary>{{ comment.text }}</Md1List.Secondary>
              </Md1List.Content>

              <Md1List.Action>{{ comment.when }}</Md1List.Action>
            </Md1List.Item>
          </Md1List>
        </div>

        <Md1Divider />

        <form class="md1-docs-card-comment" @submit.prevent="onComment">
          <Md1TextField v-model="draft" full-width label="Add a comment" />
        </form>
      </template>
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

  .md1-docs-cards-start {
    align-items: start;
  }

  /* Truncated, not scrolled: the text stops at three lines with an ellipsis until the card expands. */
  .md1-docs-card-clamp {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }

  /* Desktop only: the comments scroll inside the card, under a fixed height. */
  .md1-docs-card-scroll {
    max-height: 280px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-card-scroll:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: -2px;
  }

  .md1-docs-card-comment {
    margin: 0;
  }
</style>
