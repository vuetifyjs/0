<script setup lang="ts">
  import {
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
  } from '@paper/emerald'

  const plans = [
    { name: 'Starter', price: 'Free', blurb: 'For trying things out — one project, one member.' },
    { name: 'Team', price: '$12 / seat', blurb: 'Unlimited projects, shared boards, guest access.' },
    { name: 'Business', price: '$29 / seat', blurb: 'SSO, audit log, and priority support.' },
  ]
</script>

<template>
  <div class="emerald-docs-grid">
    <EmCard v-for="plan in plans" :key="plan.name" hoverable>
      <EmCardHeader>
        <EmCardTitle>{{ plan.name }}</EmCardTitle>

        <EmCardSubtitle>{{ plan.price }}</EmCardSubtitle>
      </EmCardHeader>

      <EmCardBody>{{ plan.blurb }}</EmCardBody>
    </EmCard>
  </div>
</template>

<style>
  .emerald-docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--emerald-spacing-l, 20px);
    align-items: stretch;
  }
</style>
