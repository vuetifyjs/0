<!--
  FAQ — no gap at any layer (see GAPS.md: "EmExpansionPanel already covers
  this... no gap at all — placeholder only because unbuilt"). Category
  selection rides EmTabs, which wraps v0's Tabs (createSingle underneath, plus
  roving focus and the tab/panel ARIA wiring); search uses createFilter across
  the active category's questions.
-->
<script setup lang="ts">
  import {
    EmBadge,
    EmButton,
    EmCard,
    EmCardBody,
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
    EmTabs,
    EmTabsItem,
    EmTabsList,
    EmTabsPanel,
    EmTextField,
  } from '@paper/emerald'

  // Framework
  import { createFilter } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  interface FaqItem extends Record<string, unknown> {
    q: string
    a: string
  }

  interface Category {
    id: string
    label: string
    caption: string
    items: FaqItem[]
  }

  const categories: Category[] = [
    {
      id: 'licensing',
      label: 'Licensing',
      caption: 'Seats, renewals, and what you are allowed to ship.',
      items: [
        { q: 'Does one licence cover every project I ship?', a: 'A seat covers unlimited projects for the developers named on it. Count seats by the people who touch the source, not by the number of apps you deploy.' },
        { q: 'What happens to my apps when a licence lapses?', a: 'Anything you already shipped keeps working — the packages are yours at the version you installed. A lapsed licence only ends access to new releases and to the private issue tracker.' },
        { q: 'Can I use Emerald in a product I sell to my own customers?', a: 'Yes, provided they buy the finished product rather than the component source. Redistributing the package itself is a reseller arrangement and needs a separate agreement.' },
        { q: 'Is the headless layer licensed separately?', a: 'No. Vuetify0 is MIT and stays that way; the commercial licence covers the Emerald design system built on top of it. Nothing you build on the composables is encumbered.' },
        { q: 'Do non-profits and classrooms pay?', a: 'Registered non-profits and accredited courses get studio seats at no cost. Send proof of status and we issue them by hand — there is no self-serve path for it.' },
      ],
    },
    {
      id: 'theming',
      label: 'Theming',
      caption: 'Tokens, palettes, and rebranding without a fork.',
      items: [
        { q: 'How do I retheme Emerald without forking it?', a: 'Override the --emerald-* custom properties on any ancestor element. Every component reads its colour, radius, spacing, and type through tokens, so a single scoped block rebrands an entire subtree.' },
        { q: 'Can two themes run on the same page?', a: 'Yes. Tokens cascade, so nesting a second themed block re-scopes everything inside it. Overlays that portal to the document root opt back into their originating region rather than inheriting the page default.' },
        { q: 'Where do dark-mode values come from?', a: 'The dark palette is a separate token set resolved by v0\'s useTheme. Components never branch on the mode themselves, which is why a custom third theme needs no component changes.' },
        { q: 'My brand colour looks wrong on a dark surface.', a: 'Contrast is derived from the token rather than hardcoded. Set the paired on-* token next to your colour, or let the contrast utilities pick a foreground for you using APCA.' },
        { q: 'Do I have to use the shipped type scale?', a: 'No. The --emerald-text-* tokens are the only place sizes and line heights are defined, so replacing the scale moves every component with it.' },
      ],
    },
    {
      id: 'composables',
      label: 'Composables',
      caption: 'The headless layer underneath every component.',
      items: [
        { q: 'Do I need Emerald to use the composables?', a: 'Not at all. The headless package ships on its own with no styling and no runtime dependencies. Emerald is simply one consumer of it.' },
        { q: 'When should I reach for a composable instead of a component?', a: 'Take the component when you want the markup and the ARIA wiring handed to you. Take the composable when you already have markup you like and only need the state machine behind it.' },
        { q: 'Can I mix these composables with a library I already use?', a: 'That is the intended use. The composables render nothing, so they compose with whatever is drawing your interface today — including a design system you built in-house.' },
        { q: 'How do the selection composables relate to each other?', a: 'They stack. Multi-select adds batch operations over the base value store, single-select constrains that to one active item, and stepped selection adds ordered navigation on top of single.' },
        { q: 'Is server-side rendering supported?', a: 'Browser-only APIs sit behind shared environment constants, so nothing reaches for window during render. Hydration state is exposed as its own composable when you need to defer work to the client.' },
      ],
    },
    {
      id: 'releases',
      label: 'Releases & support',
      caption: 'Cadence, backports, and what an SLA actually buys.',
      items: [
        { q: 'How often do releases ship?', a: 'One feature release a month, with patches whenever a fix is ready. Breaking changes are batched into majors and never land in a minor.' },
        { q: 'What does a support SLA actually cover?', a: 'Reproducible defects in the packages you licensed, answered within the response window on your plan. It does not cover review of your application code, though studio seats include a monthly office-hours slot.' },
        { q: 'How do I report something that only breaks in my app?', a: 'Attach a minimal reproduction. A playground link that fails on load is worth more to us than several paragraphs of description, and it usually shortens the fix to a single release.' },
        { q: 'Do you backport fixes to older majors?', a: 'Security fixes for eighteen months after a major is superseded. Behavioural fixes land on the current major only, which is what keeps the upgrade path short.' },
      ],
    },
  ]

  const answers = categories.reduce((sum, cat) => sum + cat.items.length, 0)

  const active = shallowRef('licensing')

  const current = toRef(() =>
    categories.find(cat => cat.id === active.value) ?? categories[0]!)

  const search = shallowRef('')

  const filter = createFilter<FaqItem>({ keys: ['q', 'a'], mode: 'union' })
  const { items: visible } = filter.apply(search, () => current.value.items)

  const channels = [
    {
      id: 'ticket',
      title: 'Open a support ticket',
      copy: 'Defects, integration failures, and anything blocking a release. Include a reproduction and it goes straight to the maintainer who owns that package.',
      cta: 'File a ticket',
      icon: ['M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z'],
    },
    {
      id: 'office',
      title: 'Book office hours',
      copy: 'Thirty minutes with someone who has read the source. Best spent on architecture calls — how to model your data table, when a composable beats a component.',
      cta: 'Reserve a slot',
      icon: ['M8 2v4M16 2v4M3 9h18', 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z'],
    },
    {
      id: 'docs',
      title: 'Read the source of truth',
      copy: 'Every composable ships with its own guide, a decision table for picking between them, and the type signatures the docs are generated from.',
      cta: 'Open documentation',
      icon: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z'],
    },
  ]
</script>

<template>
  <EmeraldShell>
    <div class="adm-faq" data-theme="emerald">
      <header class="adm-faq__hero">
        <div class="adm-faq__intro">
          <span class="adm-faq__eyebrow">Support</span>
          <h1 class="adm-faq__title">Answers, without the ticket</h1>
          <p class="adm-faq__sub">Licensing terms, token overrides, the headless layer, and how releases reach you.</p>
        </div>

        <EmCard class="adm-faq__finder" variant="simple">
          <EmCardBody class="adm-faq__finder-body">
            <EmTextField
              v-model="search"
              class="adm-faq__finder-field"
              :label="`Search ${answers} answers`"
              placeholder="Try “tokens”, “seats”, or “SSR”…"
            />

            <p class="adm-faq__finder-hint">
              Searching within <strong>{{ current.label }}</strong> — {{ visible.length }} of {{ current.items.length }} shown.
            </p>
          </EmCardBody>
        </EmCard>
      </header>

      <EmTabs v-model="active" class="adm-faq__tabs">
        <EmTabsList class="adm-faq__tabs-list" label="FAQ categories">
          <EmTabsItem v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.label }}
            <EmBadge :content="cat.items.length" variant="neutral" />
          </EmTabsItem>
        </EmTabsList>

        <!-- Tabs.Panel keeps every panel mounted and hides the inactive ones,
             so one panel bound to the active id renders the filtered list once
             instead of stamping it into all four. -->
        <EmTabsPanel :value="active">
          <p class="adm-faq__caption">{{ current.caption }}</p>

          <EmExpansionPanelGroup v-if="visible.length > 0" class="adm-faq__accordion">
            <EmExpansionPanel v-for="item in visible" :key="item.q">
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

          <p v-else class="adm-faq__empty">Nothing in {{ current.label }} matches "{{ search }}". Try another category.</p>
        </EmTabsPanel>
      </EmTabs>

      <section aria-labelledby="adm-faq-help" class="adm-faq__help">
        <div class="adm-faq__help-intro">
          <span class="adm-faq__eyebrow">Still stuck</span>
          <h2 id="adm-faq-help" class="adm-faq__help-title">Three ways to reach a human</h2>
          <p class="adm-faq__help-sub">All three are staffed by the people who write the packages. Pick by how much context the problem needs.</p>
        </div>

        <ul class="adm-faq__channels">
          <li v-for="channel in channels" :key="channel.id" class="adm-faq__channel">
            <span aria-hidden="true" class="adm-faq__channel-icon"><svg
              fill="none"
              height="20"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              width="20"
            ><path v-for="(d, index) in channel.icon" :key="index" :d /></svg></span>

            <div class="adm-faq__channel-text">
              <h3>{{ channel.title }}</h3>
              <p>{{ channel.copy }}</p>
            </div>

            <EmButton variant="secondary">{{ channel.cta }}</EmButton>
          </li>
        </ul>
      </section>
    </div>
  </EmeraldShell>
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

  /* Asymmetric band: the pitch on the left, the working control on the right. */
  .adm-faq__hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 22rem);
    align-items: center;
    gap: var(--emerald-spacing-xl, 28px);
  }

  .adm-faq__intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-faq__eyebrow {
    padding: 2px 10px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .adm-faq__title {
    margin: 0;
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-faq__sub {
    max-width: 32rem;
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-faq__finder-body {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-l, 20px);
  }

  .adm-faq__finder-field .emerald-text-field__label {
    font-weight: 700;
  }

  .adm-faq__finder-hint {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-faq__tabs-list {
    flex-wrap: wrap;
  }

  .adm-faq__caption {
    margin: 0 0 var(--emerald-spacing-s, 12px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-faq__accordion {
    width: 100%;
  }

  .adm-faq__empty {
    margin: 0;
    padding: var(--emerald-spacing-xl, 28px) 0;
    color: var(--emerald-on-surface-variant, #757e85);
    text-align: center;
  }

  /* Heading block beside the channels rather than centred above them. */
  .adm-faq__help {
    display: grid;
    grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
    gap: var(--emerald-spacing-xl, 28px);
    align-items: start;
    padding-top: var(--emerald-spacing-l, 20px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-faq__help-intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    position: sticky;
    top: var(--emerald-spacing-l, 20px);
  }

  .adm-faq__help-title {
    margin: 0;
    font-size: clamp(1.25rem, 2vw, 1.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .adm-faq__help-sub {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-faq__channels {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    background: var(--emerald-background, #fefefe);
  }

  .adm-faq__channel {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-l, 20px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-faq__channel:last-child {
    border-bottom: none;
  }

  .adm-faq__channel-icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-faq__channel-text {
    flex: 1;
    min-width: 0;
  }

  .adm-faq__channel-text h3 {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-faq__channel-text p {
    margin: 2px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-faq__channel .emerald-button {
    flex: none;
  }

  @media (max-width: 900px) {
    .adm-faq__hero,
    .adm-faq__help {
      grid-template-columns: 1fr;
    }

    .adm-faq__help-intro {
      position: static;
    }

    .adm-faq__channel {
      flex-wrap: wrap;
    }

    .adm-faq__channel-text {
      flex-basis: 100%;
      order: 1;
    }

    .adm-faq__channel .emerald-button {
      order: 2;
      margin-inline-start: auto;
    }
  }
</style>
