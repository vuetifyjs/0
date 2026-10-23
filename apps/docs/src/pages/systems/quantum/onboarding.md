---
title: Onboarding - Quantum Material Design 1 Onboarding Pattern for Vue
meta:
- name: description
  content: The Material Design 1 onboarding models in Quantum. Quickstart, self-select and top user benefits, composed from buttons, lists and cards with pagination dots you draw.
- name: keywords
  content: quantum onboarding, material design 1 onboarding, warm welcome, first run experience, quickstart, self-select, top user benefits, onboarding carousel, vue onboarding, paper quantum
features:
  category: Guide
  label: 'Onboarding'
  level: 2
  renderless: false
  group: 'patterns'
  order: 21
related:
  - /systems/quantum
  - /systems/quantum/button
  - /systems/quantum/list
  - /systems/quantum/card
  - /systems/quantum/feature-discovery
  - /composables/selection/create-step
---

# Onboarding

<DocsPageFeatures :frontmatter />

Onboarding, the guidelines' "warm welcome", is the first experience a new user has with an app. Material Design 1 defines three models for it, and Quantum composes each from `QuButton`, `QuList` and `QuCard`; there is no onboarding component.

> [!NOTE]
> Reference: [Onboarding, Material Design 1 guidelines](http://web.archive.org/web/20181225002225/https://material.io/archive/guidelines/growth-communications/onboarding.html), the archived page Quantum is pinned to. The three models, when to use each, and the platform redlines. This page is the Vue.

## Usage

Show onboarding to first-time users and never to returning ones. Its goals are to welcome the user, show how the app fits their life, and drive the actions that predict engagement in the first session and retention over the first seven days. The simplest model, Quickstart, lands the user straight in the app with something to do.

::: ds-example
/systems/quantum/onboarding/quickstart
:::

Quickstart gives the user something to do instead of a blank screen. The first key action, the one most closely linked to engagement in the first seven days, is promoted as a raised `QuButton`; other ways to start sit in a `QuList` below it. Education is offered, never forced: the guidelines show the offer late in the first session (90% of the way through an average one), and the example raises its "Learn more" and "No thanks" card only after the first action is taken.

## Choosing a model

| Model | What it is | Use when | Avoid when |
|-------|-----------|----------|------------|
| Quickstart | The user lands directly in the UI, after sign-in and setup only | The behaviours that drive engagement and retention are known | The app tackles a new challenge or offers a new kind of benefit |
| Self-select | A short series of choices that customise the first run | The UI can be customised; the app has setup or consent requirements | The app tackles a new challenge or offers a new kind of benefit; it announces new uses or major UI changes |
| Top user benefits | A brief autoplay carousel of up to three benefits | The app tackles a new challenge, or announces new uses or major UI changes | The UI and benefits follow patterns most users already know; the app has no major changes |

Never combine self-select with top user benefits. Setup may run before the first-run experience, or after or inside onboarding. Whichever model runs, the screen it ends on should make it easy to act on what was just learned. For a single feature introduced later, use [Feature discovery](/systems/quantum/feature-discovery) instead.

| Part | Quantum surface | Guideline |
|------|-----------------|-----------|
| Primary call to action | `QuButton variant="raised"` | "Get started" throughout a carousel; the first key action in Quickstart |
| Choices | `QuList select="multiple"`, or `QuGridList` tiles with `selected` | Fewer than ten, on one screen, each with a noticeable effect |
| Education offer | A dismissible `QuCard` with "Learn more" and "No thanks" | Offered late in the first session, never forced up front |
| Desktop carousel | `QuCard`, with icon-only `QuButton`s for Previous and Next | Illustration, copy and the button in a centred card |
| Pagination | Dots you draw | One per screen, beneath the copy or the card; none for a video |

Quantum ships no pagination dots: the guidelines draw them on the onboarding page only and give no metrics, so they are part of your composition, not a component.

## Examples

::: ds-example
/systems/quantum/onboarding/self-select

### Self-select

Self-select lets users shape their first run with a short series of choices. The guidelines ask for choices that are meaningful and noticeable, that ask only what normal use would not reveal, and that are short: one screen, or several that feel connected, with fewer than ten choices each. Content apps ask for topics of interest; feed apps ask which topics to bundle.

The example is one screen: a headline in the Headline style (24 sp on 32 sp), a line of Subheading copy in the secondary ink, and six topics in a `QuList` with `select="multiple"`, the multi-select listbox with the selection pattern's check marks. The guidelines also name a bundled list and a grid view as common designs; the grid view is a `QuGridList` whose tiles toggle `selected`. "Next" moves on to the first-run experience and is enabled from the start, so a reader who picks nothing can still continue.
:::

::: ds-example
/systems/quantum/onboarding/top-benefits

### Top user benefits

Top user benefits is a brief autoplay carousel of at most three illustrations, each positioning one benefit of the app at a moment that matters rather than describing a feature. Each screen auto-advances every two to three seconds; the first one advances sooner so it is clear this is not a single screen. Autoplay stops for good once the user touches the carousel, and the carousel loops until "Get started" is pressed. The button and the dots stay fixed while the copy changes on its own field, at the same elevation as the illustration.

The example keeps the slide state in v0's [createStep](/composables/selection/create-step) with `circular` on, and times it with [useTimer](/composables/system/use-timer): 2 s for the first screen and 3 s for the others, values inside the guidelines' range. A `pointerdown` or focus anywhere in the carousel stops the timer. The dots are v0 `Button.Root`s, 8 dp marks in the disabled ink with the current one in the primary colour, so a keyboard user can move between screens; the guidelines also make the screen swipeable, a gesture Quantum does not ship. Once autoplay stops, the copy region becomes a polite live region so a screen reader hears each change.

The layout is the handset portrait redline: a 1:1 illustration, then centred copy and controls built upward from the bottom edge with 24 dp of padding. The headline is 24 sp on a 32 sp leading; the centre of the copy sits 56 dp above the top of the button, which leaves room for one to three lines. The redline sets the subhead at 15 sp where Quantum's Subheading token is 16 sp on a touch device; the example uses the token.
:::

::: ds-example
/systems/quantum/onboarding/desktop

### Desktop carousel

On desktop the guidelines put the illustration, the copy and the button in a centred card, with "Previous" and "Next" beside the card and the pagination beneath it. The redline: Headline 24 sp on 32 sp, Subheading 16 sp on 24 sp, 56 dp from the top of the button to the centre of the copy, 24 dp from the card to the dots, and 48 dp from the card to each arrow. Below 600 px, where the handset layouts apply instead, the example moves the arrows into the pagination row so the card keeps its width.

The card is a `QuCard` at its resting elevation and the arrows are icon-only `QuButton`s with the `arrow-back` and `arrow-forward` glyphs, named "Previous" and "Next" through `ariaLabel`. Both glyphs mirror under right-to-left text. The guidelines' figure draws the arrows as white circles with a shadow; Quantum has no such button, so the flat icon button stands in. The dots only reflect the position here (`aria-hidden`), because the arrows already navigate. The carousel is circular, so Next on the last screen returns to the first, matching the mobile carousel's loop.
:::

## Accessibility

A carousel that moves by itself must be stoppable. The top user benefits example stops for good on the first touch, click or focus inside it, which also covers keyboard users who tab into it, and that rule meets WCAG's Pause, Stop, Hide criterion (2.2.2: anything that starts moving on its own and lasts more than five seconds needs a way to pause it). Give the carousel `aria-roledescription="carousel"` and an `aria-label`, and keep its copy region out of the live announcements while it rotates (`aria-live="off"`), switching to `polite` once the reader is in control.

Pagination dots that act as buttons need names that state position, "Benefit 2 of 3", and `aria-current` on the current one. Dots that only mirror the position are `aria-hidden`. The illustration in each screen is decorative when the headline already carries the message. Every call to action is a real button with a text label, and the onboarding copy follows the guidelines' writing table: "Next", "No thanks", "Learn more", and "Get started" from the onboarding page itself.
