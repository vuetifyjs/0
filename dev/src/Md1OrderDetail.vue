<script setup lang="ts">
  // Components
  import { Md1Button, Md1Icon, Md1Menu, Md1Stepper, Md1Tooltip } from '@paper/md1'

  // Framework
  import { Button } from '@vuetify/v0'

  // Context
  import { orders } from './Md1Data'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  // Types
  import type { Order } from './Md1Data'

  const route = useRoute()
  const router = useRouter()

  const order = toRef(() => orders.all.value.find(row => row.id === Number(route.params.id)))

  const statuses: Order['status'][] = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

  /** How far along the timeline each status stands; a cancelled order failed while processing. */
  const rank = toRef(() => {
    if (!order.value || order.value.status === 'Cancelled') return 1

    return { Processing: 1, Shipped: 2, Delivered: 3 }[order.value.status]
  })

  const failed = toRef(() => order.value?.status === 'Cancelled')

  /** The open step: the one the order is on, or the failed one. */
  const step = toRef(() => ['processing', 'shipped', 'delivered'][rank.value - 1])

  function back () {
    router.push('/md1/orders')
  }
</script>

<template>
  <section v-if="order" class="md1-demo-order-detail">
    <div class="md1-demo-order-detail__sheet md1-elevation-2">
      <div class="md1-demo-order-detail__head">
        <Md1Tooltip>
          <Md1Tooltip.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="Back to orders" icon="arrow-back" @click="back" />
          </Md1Tooltip.Activator>

          <Md1Tooltip.Content>Back to orders</Md1Tooltip.Content>
        </Md1Tooltip>

        <h2 class="md1-demo-order-detail__title">Order {{ order.id }}</h2>

        <Md1Menu v-model:selected="order.status">
          <Md1Menu.Activator v-slot="{ attrs }">
            <Button.Root
              v-bind="attrs"
              :aria-label="`Status for order ${order.id}: ${order.status}`"
              class="md1-demo-order-detail__menu"
            >
              <span class="md1-demo-status" :data-status="order.status">{{ order.status }}</span>

              <Md1Icon name="arrow-drop-down" />
            </Button.Root>
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item v-for="status in statuses" :key="status" :value="status">{{ status }}</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </div>

      <dl class="md1-demo-order-detail__meta">
        <div><dt>Customer</dt><dd>{{ order.customer }}</dd></div>

        <div><dt>Placed</dt><dd>{{ order.shown }}</dd></div>

        <div><dt>Items</dt><dd>{{ order.items }}</dd></div>

        <div><dt>Total</dt><dd>{{ order.total.toFixed(2) }}</dd></div>
      </dl>
    </div>

    <div class="md1-demo-order-detail__sheet md1-elevation-2">
      <!-- The order's fulfilment as the spec's vertical stepper; the open step follows the status. -->
      <Md1Stepper class="md1-demo-order-detail__steps" :model-value="step" vertical>
        <Md1Stepper.Step complete label="Ordered" value="ordered">
          <Md1Stepper.Content>Placed {{ order.shown }} by {{ order.customer }}.</Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Step
          :complete="!failed && rank >= 2"
          :error="failed ? 'Order cancelled' : undefined"
          label="Processing"
          value="processing"
        >
          <Md1Stepper.Content>
            {{ failed
              ? 'The order was cancelled and refunded to the original payment method.'
              : `${order.items} ${order.items === 1 ? 'item is' : 'items are'} being picked and packed.` }}
          </Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Step :complete="!failed && rank >= 3" label="Shipped" value="shipped">
          <Md1Stepper.Content>Handed to the courier, tracking shared with the customer.</Md1Stepper.Content>
        </Md1Stepper.Step>

        <Md1Stepper.Step :complete="!failed && rank >= 3" label="Delivered" value="delivered">
          <Md1Stepper.Content>Left with the customer.</Md1Stepper.Content>
        </Md1Stepper.Step>
      </Md1Stepper>
    </div>
  </section>

  <!-- The empty-states pattern for an id the store does not hold. -->
  <div v-else class="md1-demo-order-detail__missing">
    <Md1Icon aria-hidden="true" class="md1-demo-order-detail__art" name="error-outline" />

    <p class="md1-demo-order-detail__tagline">Order not found</p>

    <p class="md1-demo-order-detail__text">It may have been deleted. Head back to the orders table.</p>

    <Md1Button @click="back">Back to orders</Md1Button>
  </div>
</template>

<style>
  .md1-demo-order-detail {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 840px;
    margin-inline: auto;
  }

  .md1-demo-order-detail__sheet {
    box-sizing: border-box;
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-order-detail__head {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: 56px;
  }

  .md1-demo-order-detail__title {
    flex: 1 1 auto;
    margin: 0;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The status control: the table's inline menu, on the detail sheet. */
  .md1-demo-order-detail__menu {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 48px;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  .md1-demo-order-detail__menu .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* The summary: caption-labelled values on one wrapping row, 16 dp keylines. */
  .md1-demo-order-detail__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-4, 32px);
    margin: var(--md1-spacing-1, 8px) 0 0;
    padding-inline-start: var(--md1-spacing-1, 8px);
  }

  .md1-demo-order-detail__meta dt {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-order-detail__meta dd {
    margin: 0;
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-demo-order-detail__steps {
    width: 100%;
  }

  /* The empty-states pattern: the state belongs to the screen, not a sheet of its own. */
  .md1-demo-order-detail__missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 60vh;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  .md1-demo-order-detail__art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-demo-order-detail__tagline {
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-order-detail__text {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
