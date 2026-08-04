<!--
  FAQ — no gap at any layer (see GAPS.md: "EmExpansionPanel already covers
  this... no gap at all — placeholder only because unbuilt"). Category
  selection uses v0's createSingle (decision table: "Single-choice state
  (tabs, theme picker) → createSingle"); search uses createFilter across the
  active category's questions.
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter, createSingle } from '@vuetify/v0'

  // Context
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  interface FaqItem extends Record<string, unknown> {
    q: string
    a: string
  }

  interface Category {
    id: string
    label: string
    icon: string[]
    items: FaqItem[]
  }

  const categories: Category[] = [
    {
      id: 'general',
      label: 'General Usage',
      icon: ['M4 7h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
      items: [
        { q: 'How do I customize my dashboard widgets?', a: 'Open the dashboard settings menu and use drag-and-drop to reorder cards. You can also enable or disable modules per role so each team sees the most relevant metrics first.' },
        { q: 'Can I create multiple dashboards for different teams?', a: 'Yes — clone an existing dashboard or start from a blank layout, then scope its visibility to a role or team.' },
        { q: 'How often is dashboard data refreshed?', a: 'Live widgets refresh every 30 seconds; historical charts refresh on page load. A manual refresh button is always available.' },
        { q: 'Can I export charts and tables from the dashboard?', a: 'Yes — every table and chart card has an export action for CSV, and select charts also support PNG export.' },
        { q: 'Is the dashboard optimized for mobile use?', a: 'The admin shell collapses to a single column below 900px, with the rail navigation swapping to a slide-over drawer.' },
      ],
    },
    {
      id: 'security',
      label: 'Security & Access',
      icon: ['M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z'],
      items: [
        { q: 'How do I enable two-factor authentication?', a: 'Go to Settings → Security and toggle two-factor authentication. You can pair an authenticator app or receive codes by SMS.' },
        { q: 'Who can see audit logs?', a: 'Audit logs are scoped to Admin and Owner roles by default; grant a custom role read-only access from Roles & Permissions.' },
        { q: 'How do I revoke a teammate\'s access?', a: 'From Users, open the teammate\'s profile and choose Revoke Access — active sessions end immediately.' },
        { q: 'Does the platform support SSO?', a: 'SAML and OIDC single sign-on are available on Business and Enterprise plans, configurable under Settings → Security.' },
      ],
    },
    {
      id: 'billing',
      label: 'Billing & Plans',
      icon: ['M3 7h18v10H3V7Z', 'M3 10h18', 'M7 15h4'],
      items: [
        { q: 'How do I change my billing plan?', a: 'Go to Settings → Billing and choose Change Plan. Upgrades apply immediately; downgrades take effect at the next billing cycle.' },
        { q: 'Where can I find past invoices?', a: 'All invoices are listed under Settings → Billing → Invoice History, downloadable as PDF.' },
        { q: 'Do you offer annual billing discounts?', a: 'Yes — switching to yearly billing saves roughly 20% compared to monthly, prorated from your current cycle.' },
      ],
    },
    {
      id: 'support',
      label: 'Support & Troubleshooting',
      icon: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M9.7 9.3a2.4 2.4 0 0 1 4.6.8c0 1.6-2.3 2.4-2.3 2.4', 'M12 17h.01'],
      items: [
        { q: 'A widget shows stale data — what should I check?', a: 'Confirm the data source connection under Settings → Integrations, then force-refresh the widget from its card menu.' },
        { q: 'How do I report a platform bug?', a: 'Use Open Support Ticket below, or email support directly — include the page URL and a screenshot when possible.' },
        { q: 'Can I get a walkthrough for a specific workflow?', a: 'Book a session with a product specialist from the Request Product Guidance card below.' },
      ],
    },
  ]

  const single = createSingle<{ id: string, value: string }>({ mandatory: true })
  single.onboard(categories.map(c => ({ id: c.id, value: c.label })))
  single.select('general')

  const activeCategory = toRef(() =>
    categories.find(c => c.id === single.selectedId.value) ?? categories[0]!)

  const search = shallowRef('')

  const filter = createFilter<FaqItem>({ keys: ['q', 'a'], mode: 'union' })
  const { items: visibleItems } = filter.apply(search, () => activeCategory.value.items)
</script>

<template>
  <AdminShell>
    <div class="adm-faq" data-theme="emerald">
      <EmCard class="adm-faq__hero" variant="simple">
        <EmCardBody class="adm-faq__hero-body">
          <span class="adm-faq__eyebrow">FAQs</span>
          <h1 class="adm-faq__title">Frequently Asked Questions</h1>
          <p class="adm-faq__sub">Find answers about analytics, permissions, billing, and operational support for your team.</p>

          <div class="adm-faq__search">
            <EmTextField v-model="search" aria-label="Search for an admin question" placeholder="Search for an admin question" />
            <EmButton variant="primary">Search</EmButton>
          </div>
        </EmCardBody>
      </EmCard>

      <section aria-label="FAQ categories" class="adm-faq__body">
        <nav aria-label="FAQ categories" class="adm-faq__nav">
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="adm-faq__nav-item"
            :data-selected="single.selectedId.value === cat.id || undefined"
            type="button"
            @click="single.select(cat.id)"
          >
            <svg
              aria-hidden="true"
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            ><path v-for="(d, index) in cat.icon" :key="index" :d /></svg>
            {{ cat.label }}
            <svg
              aria-hidden="true"
              class="adm-faq__nav-chevron"
              fill="none"
              height="14"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 16 16"
              width="14"
            ><path d="M6 4l4 4-4 4" /></svg>
          </button>
        </nav>

        <div class="adm-faq__panel">
          <header class="adm-faq__panel-head">
            <span aria-hidden="true" class="adm-faq__panel-icon"><svg
              fill="none"
              height="18"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.75"
              viewBox="0 0 24 24"
              width="18"
            ><path v-for="(d, index) in activeCategory.icon" :key="index" :d /></svg></span>

            <div>
              <h2 class="adm-faq__panel-title">{{ activeCategory.label }}</h2>
              <p class="adm-faq__panel-sub">{{ visibleItems.length }} question{{ visibleItems.length === 1 ? '' : 's' }} in this category.</p>
            </div>
          </header>

          <EmExpansionPanelGroup v-if="visibleItems.length > 0" class="adm-faq__accordion">
            <EmExpansionPanel v-for="item in visibleItems" :key="item.q">
              <EmExpansionPanelHeader>
                <EmExpansionPanelActivator>
                  {{ item.q }}
                  <EmExpansionPanelCue />
                </EmExpansionPanelActivator>
              </EmExpansionPanelHeader>

              <EmExpansionPanelContent>
                {{ item.a }}
              </EmExpansionPanelContent>
            </EmExpansionPanel>
          </EmExpansionPanelGroup>

          <p v-else class="adm-faq__empty">No questions match "{{ search }}" in {{ activeCategory.label }}.</p>
        </div>
      </section>

      <section aria-label="Need more help" class="adm-faq__help">
        <span class="adm-faq__eyebrow adm-faq__eyebrow--center">Still have questions?</span>
        <h2 class="adm-faq__help-title">Need More Admin Help?</h2>
        <p class="adm-faq__help-sub">Choose the best support channel for your team and get assistance from the right specialists.</p>

        <div class="adm-faq__help-grid">
          <EmCard variant="simple">
            <EmCardBody class="adm-faq__help-card">
              <span aria-hidden="true" class="adm-faq__help-icon"><svg
                fill="none"
                height="22"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="22"
              ><path d="M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z" /></svg></span>

              <h3>Contact Technical Support</h3>
              <p>Report platform issues, integration errors, or access problems. Our technical team can investigate logs and help you restore operations quickly.</p>
              <EmButton variant="secondary">Open Support Ticket</EmButton>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardBody class="adm-faq__help-card">
              <span aria-hidden="true" class="adm-faq__help-icon"><svg
                fill="none"
                height="22"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="22"
              ><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2Z" /></svg></span>

              <h3>Request Product Guidance</h3>
              <p>Need help configuring dashboards, permissions, or analytics workflows? Schedule a walkthrough with a product specialist.</p>
              <EmButton variant="secondary">Book a Session</EmButton>
            </EmCardBody>
          </EmCard>

          <EmCard variant="simple">
            <EmCardBody class="adm-faq__help-card">
              <span aria-hidden="true" class="adm-faq__help-icon"><svg
                fill="none"
                height="22"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                width="22"
              ><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></svg></span>

              <h3>Explore Admin Documentation</h3>
              <p>Browse setup guides, API references, release notes, and troubleshooting playbooks to resolve common admin tasks independently.</p>
              <EmButton variant="secondary">View Documentation</EmButton>
            </EmCardBody>
          </EmCard>
        </div>
      </section>
    </div>
  </AdminShell>
</template>

<style>
  .adm-faq {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xl, 28px);
  }

  .adm-faq .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
  }

  .adm-faq__hero-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: clamp(1.5rem, 4vw, 3rem) 1rem;
    text-align: center;
  }

  .adm-faq__eyebrow {
    padding: 2px 10px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .adm-faq__eyebrow--center {
    margin: 0 auto;
  }

  .adm-faq__title {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-faq__sub {
    max-width: 34rem;
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-faq__search {
    display: flex;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    max-width: 26rem;
    margin-top: var(--emerald-spacing-s, 12px);
  }

  .adm-faq__search .emerald-text-field {
    flex: 1;
  }

  .adm-faq__body {
    display: grid;
    grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
    gap: var(--emerald-spacing-l, 20px);
    align-items: start;
  }

  .adm-faq__nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .adm-faq__nav-item {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid transparent;
    border-radius: var(--emerald-radius-m, 8px);
    background: none;
    color: var(--emerald-on-surface, #2b2d2e);
    font: inherit;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }

  .adm-faq__nav-item:hover {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-faq__nav-item[data-selected] {
    border-color: var(--emerald-neutral-300, #ccd6e7);
    background: var(--emerald-background, #fefefe);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-faq__nav-chevron {
    margin-inline-start: auto;
    opacity: 0.5;
  }

  .adm-faq__panel {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-l, 20px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    background: var(--emerald-background, #fefefe);
  }

  .adm-faq__panel-head {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-s, 12px);
  }

  .adm-faq__panel-icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-faq__panel-title {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-faq__panel-sub {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-faq__accordion {
    width: 100%;
  }

  .adm-faq__empty {
    margin: 0;
    padding: var(--emerald-spacing-l, 20px) 0;
    color: var(--emerald-on-surface-variant, #757e85);
    text-align: center;
  }

  .adm-faq__help {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    text-align: center;
  }

  .adm-faq__help-title {
    margin: 0;
    font-size: clamp(1.375rem, 2.5vw, 1.75rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-faq__help-sub {
    max-width: 32rem;
    margin: 0 0 var(--emerald-spacing-m, 16px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-faq__help-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .adm-faq__help-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-l, 20px);
    text-align: center;
  }

  .adm-faq__help-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-bottom: 4px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-faq__help-card h3 {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-faq__help-card p {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 900px) {
    .adm-faq__body {
      grid-template-columns: 1fr;
    }

    .adm-faq__nav {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .adm-faq__help-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
