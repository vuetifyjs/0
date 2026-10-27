<script setup lang="ts">
  import { Md1Button, Md1Card, Md1ProgressCircular } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { onMounted, shallowRef } from 'vue'

  /** The simulated wait, in ms, before the card's copy arrives. */
  const LOAD = 1800
  /** How long the two-phase load waits, in ms, before the paper is generated. */
  const PAPER = 700

  // One phase: the container is already on screen and only its ink is pending.
  const one = shallowRef(false)
  // Two phases: nothing, then the paper, then the ink inside it.
  const paper = shallowRef(false)
  const two = shallowRef(false)

  const inkOne = useTimer(() => {
    one.value = true
  }, { duration: LOAD })

  const inkTwo = useTimer(() => {
    two.value = true
  }, { duration: LOAD - PAPER })

  const sheet = useTimer(() => {
    paper.value = true
    inkTwo.start()
  }, { duration: PAPER })

  function onReplay () {
    one.value = false
    paper.value = false
    two.value = false

    inkOne.start()
    sheet.start()
  }

  onMounted(onReplay)
</script>

<template>
  <div class="md1-docs-phases">
    <div class="md1-docs-phases-row">
      <figure class="md1-docs-phases-column">
        <div class="md1-docs-phases-stage" data-phase="one">
          <Md1Card :aria-busy="!one || undefined">
            <div v-if="!one" class="md1-docs-phases-wait">
              <Md1ProgressCircular aria-label="Loading trip details" />
            </div>

            <template v-else>
              <Md1Card.Title>Your trip to Lisbon</Md1Card.Title>

              <Md1Card.Subtitle>3 nights from Friday, 14 June</Md1Card.Subtitle>

              <Md1Card.Supporting>Your flight leaves at 7:40 AM from Terminal 2. Check in online from 24 hours before departure.</Md1Card.Supporting>

              <Md1Card.Actions>
                <Md1Button>Check in</Md1Button>
              </Md1Card.Actions>
            </template>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-phases-caption md1-type-caption">One phase: the card is already there and the ink loads within it</figcaption>
      </figure>

      <figure class="md1-docs-phases-column">
        <div class="md1-docs-phases-stage" data-phase="two">
          <div v-if="!paper" class="md1-docs-phases-wait">
            <Md1ProgressCircular aria-label="Loading trip details" />
          </div>

          <Md1Card v-else :aria-busy="!two || undefined" class="md1-docs-phases-paper">
            <div v-if="!two" class="md1-docs-phases-wait">
              <Md1ProgressCircular aria-label="Loading trip details" />
            </div>

            <template v-else>
              <Md1Card.Title>Your trip to Lisbon</Md1Card.Title>

              <Md1Card.Subtitle>3 nights from Friday, 14 June</Md1Card.Subtitle>

              <Md1Card.Supporting>Your flight leaves at 7:40 AM from Terminal 2. Check in online from 24 hours before departure.</Md1Card.Supporting>

              <Md1Card.Actions>
                <Md1Button>Check in</Md1Button>
              </Md1Card.Actions>
            </template>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-phases-caption md1-type-caption">Two phases: the paper is generated, then the ink loads within it</figcaption>
      </figure>
    </div>

    <Md1Button :disabled="!one || !two" @click="onReplay">Replay</Md1Button>
  </div>
</template>

<style>
  .md1-docs-phases {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-phases-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 300px));
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-phases-column {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
  }

  /* A fixed stage, so the container never changes size: the card fills it in both loads, and only the ink inside it arrives. */
  .md1-docs-phases-stage {
    display: grid;
    height: 280px;
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-phases-stage > .md1-card {
    height: 100%;
  }

  .md1-docs-phases-wait {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  /* The paper is generated: it grows in from slightly smaller on the deceleration curve, then its ink loads. */
  .md1-docs-phases-paper {
    animation: md1-docs-phases-paper 225ms var(--md1-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @keyframes md1-docs-phases-paper {
    from {
      opacity: 0;
      scale: 0.92;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-phases-paper {
      animation: none;
    }
  }

  .md1-docs-phases-caption {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
