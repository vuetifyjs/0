---
title: Onboarding - Material Design 1 Onboarding Pattern for Vue
meta:
- name: description
  content: The Material Design 1 onboarding models. Quickstart, self-select and top user benefits, composed from buttons, lists and cards with pagination dots you draw.
- name: keywords
  content: md1 onboarding, material design 1 onboarding, warm welcome, first run experience, quickstart, self-select, top user benefits, onboarding carousel, vue onboarding, paper md1
features:
  category: Guide
  label: 'Onboarding'
  level: 2
  renderless: false
  group: 'patterns'
  order: 21
related:
  - /systems/md1
  - /systems/md1/button
  - /systems/md1/list
  - /systems/md1/card
  - /systems/md1/feature-discovery
  - /composables/selection/create-step
---

# Onboarding

<DocsPageFeatures :frontmatter />

Onboarding, the guidelines' "warm welcome", is the first experience a new user has with an app. Material Design 1 defines three models for it, and `@paper/md1` composes each from `Md1Button`, `Md1List` and `Md1Card`; there is no onboarding component.

<DocsMd1Reference
  href="https://m1.material.io/growth-communications/onboarding.html"
  title="Onboarding"
/>

## Usage

Show onboarding to first-time users and never to returning ones. Its goals are to welcome the user, show how the app fits their life, and drive the actions that predict engagement in the first session and retention over the first seven days. The simplest model, Quickstart, lands the user straight in the app with something to do.

::: ds-example
/systems/md1/onboarding/quickstart
:::

Quickstart gives the user something to do instead of a blank screen. The first key action, the one most closely linked to engagement in the first seven days, is promoted as a raised `Md1Button`; other ways to start sit in an `Md1List` below it. Education is offered, never forced: the guidelines show the offer late in the first session (90% of the way through an average one), and the example raises its "Learn more" and "No thanks" card only after the first action is taken.

## Choosing a model

| Model | What it is | Use when | Avoid when |
|-------|-----------|----------|------------|
| Quickstart | The user lands directly in the UI, after sign-in and setup only | The behaviours that drive engagement and retention are known | The app tackles a new challenge or offers a new kind of benefit |
| Self-select | A short series of choices that customise the first run | The UI can be customised; the app has setup or consent requirements | The app tackles a new challenge or offers a new kind of benefit; it announces new uses or major UI changes |
| Top user benefits | A brief autoplay carousel of up to three benefits | The app tackles a new challenge, or announces new uses or major UI changes | The UI and benefits follow patterns most users already know; the app has no major changes |

Never combine self-select with top user benefits. Setup may run before the first-run experience, or after or inside onboarding. Whichever model runs, the screen it ends on should make it easy to act on what was just learned. For a single feature introduced later, use [Feature discovery](/systems/md1/feature-discovery) instead.

| Part | Material Design 1 surface | Guideline |
|------|-----------------|-----------|
| Primary call to action | `Md1Button variant="raised"` | "Get started" throughout a carousel; the first key action in Quickstart |
| Choices | `Md1List select="multiple"`, or `Md1GridList` tiles with `selected` | Fewer than ten, on one screen, each with a noticeable effect |
| Education offer | A dismissible `Md1Card` with "Learn more" and "No thanks" | Offered late in the first session, never forced up front |
| Desktop carousel | `Md1Card`, with icon-only `Md1Button`s for Previous and Next | Illustration, copy and the button in a centred card |
| Pagination | Dots you draw | One per screen, beneath the copy or the card; none for a video |

Material Design 1 ships no pagination dots: the guidelines draw them on the onboarding page only and give no metrics, so they are part of your composition, not a component.

## Examples

::: ds-example
/systems/md1/onboarding/sign-in

### Sign-in screen

Self-select often starts by signing in. When the device already knows an account, the screen offers it instead of a form: the account in a sheet at the bottom, under the app's illustration[^illustration], with one full-width raised button to continue as that person. The arrow beside the account opens an `Md1Menu` of the other accounts on the device.

Name the button for what happens, "Continue as Janelle", and keep the account's name and email visible above it, so the reader can see which identity they are about to use.
:::

::: ds-example
/systems/md1/onboarding/self-select

### Self-select

Self-select lets users shape their first run with a short series of choices. The guidelines ask for choices that are meaningful and noticeable, that ask only what normal use would not reveal, and that are short: one screen, or several that feel connected, with fewer than ten choices each. Content apps ask for topics of interest; feed apps ask which topics to bundle.

The example is one screen: a headline in the Headline style (24 sp on 32 sp), a line of Subheading copy in the secondary ink, and six topics in an `Md1List` with `select="multiple"`, the multi-select listbox with the selection pattern's check marks. The guidelines also name a bundled list and a grid view as common designs; the grid view is an `Md1GridList` whose tiles toggle `selected`. "Next" moves on to the first-run experience and is enabled from the start, so a reader who picks nothing can still continue.
:::

::: ds-example
/systems/md1/onboarding/designs

### Self-select designs

The guidelines draw three common designs for self-select choices, each with the same six topics here. A bundled list pairs each topic with a switch and says what the switch does in the secondary line: Bundled, or Shown individually. A grid view shows each topic as a 72 dp circle that takes a check mark when chosen.[^grid-circle] A list shows each topic as a card row with a colour block, and an add mark that turns into a check.

In all three an unchosen topic recedes, its colour dropped to 38% and its label to the disabled ink, so what is chosen reads at a glance.[^unchosen] The grid and list tiles are toggle buttons with `aria-pressed`; the bundled list's switches are named for their topic.
:::

::: ds-example
/systems/md1/onboarding/top-benefits

### Top user benefits

Top user benefits is a brief autoplay carousel of at most three illustrations, each positioning one benefit of the app at a moment that matters rather than describing a feature. Each screen auto-advances every two to three seconds; the first one advances sooner so it is clear this is not a single screen. Autoplay stops for good once the user touches the carousel, and the carousel loops until "Get started" is pressed. The button and the dots stay fixed while the copy changes on its own field, at the same elevation as the illustration.

The example keeps the slide state in v0's [createStep](/composables/selection/create-step) with `circular` on, and times it with [useTimer](/composables/system/use-timer): 2 s for the first screen and 3 s for the others, values inside the guidelines' range. A `pointerdown` or focus anywhere in the carousel stops the timer. The dots are v0 `Button.Root`s, 8 dp marks in the disabled ink with the current one in the primary colour[^dots], so a keyboard user can move between screens; the guidelines also make the screen swipeable, a gesture Material Design 1 does not ship. Once autoplay stops, the copy region becomes a polite live region so a screen reader hears each change.

The layout is the handset portrait redline: a 1:1 illustration, then centred copy and controls built upward from the bottom edge with 24 dp of padding. The headline is 24 sp on a 32 sp leading; the centre of the copy sits 56 dp above the top of the button, which leaves room for one to three lines. The redline sets the subhead at 15 sp where Material Design 1's Subheading token is 16 sp on a touch device; the example uses the token.[^subhead-token]
:::

::: ds-example
/systems/md1/onboarding/layouts

### Layouts and redlines

The same screen of the carousel on each platform the guidelines draw, each device at its size in dp.[^device-zoom] In portrait the copy and controls are centred beneath the 1:1 illustration and built upward from the bottom edge; in landscape they are left-aligned against the illustration's end edge and vertically centred; on desktop they sit in a centred card with the arrows beside it and the dots beneath it.

Turn on the redlines to number the measures the guidelines give: the headline at 24 sp on 32 sp, the subhead at 15 sp on 24 sp (the Subheading token's 16 sp here), the 32 sp line height, 56 dp from the top of the button to the centre of the copy, 24 dp of vertical padding, and on desktop 48 dp from the card to each arrow.
:::

::: ds-example
/systems/md1/onboarding/desktop

### Desktop carousel

On desktop the guidelines put the illustration, the copy and the button in a centred card, with "Previous" and "Next" beside the card and the pagination beneath it. The redline: Headline 24 sp on 32 sp, Subheading 16 sp on 24 sp, 56 dp from the top of the button to the centre of the copy, 24 dp from the card to the dots, and 48 dp from the card to each arrow. Below 600 px, where the handset layouts apply instead, the example moves the arrows into the pagination row so the card keeps its width.[^arrows-row]

The card is an `Md1Card` at its resting elevation and the arrows are icon-only `Md1Button`s with the `arrow-back` and `arrow-forward` glyphs, named "Previous" and "Next" through `ariaLabel`. Both glyphs mirror under right-to-left text. The guidelines' figure draws the arrows as white circles with a shadow; Material Design 1 has no such button, so the flat icon button stands in.[^arrow-buttons] The dots only reflect the position here (`aria-hidden`), because the arrows already navigate. The carousel is circular, so Next on the last screen returns to the first, matching the mobile carousel's loop.
:::

## Accessibility

A carousel that moves by itself must be stoppable. The top user benefits example stops for good on the first touch, click or focus inside it, which also covers keyboard users who tab into it, and that rule meets WCAG's Pause, Stop, Hide criterion (2.2.2: anything that starts moving on its own and lasts more than five seconds needs a way to pause it). Give the carousel `aria-roledescription="carousel"` and an `aria-label`, and keep its copy region out of the live announcements while it rotates (`aria-live="off"`), switching to `polite` once the reader is in control.

Pagination dots that act as buttons need names that state position, "Benefit 2 of 3", and `aria-current` on the current one. Dots that only mirror the position are `aria-hidden`. The illustration in each screen is decorative when the headline already carries the message. Every call to action is a real button with a text label, and the onboarding copy follows the guidelines' writing table: "Next", "No thanks", "Learn more", and "Get started" from the onboarding page itself.

[^illustration]: Our call: no illustration assets ship with the docs, so a glyph on the background stands in for the figure's artwork.

[^grid-circle]: Our call: the figure draws the circles without metrics; 72 dp at 2 dp elevation is read from it.

[^unchosen]: Our call: the figures dim unchosen topics without a value; 38% is the disabled ink.

[^dots]: Our call: the page draws the dots without metrics; the size and inks are the example's.

[^subhead-token]: Our call: the example keeps the shipped Subheading token rather than a one-off 15 sp size.

[^device-zoom]: Our call: the 360 x 640 to 1024 x 640 devices are laid out at full size and scaled with CSS `zoom` to fit the column, an approximation.

[^arrows-row]: Our call: the guidelines draw the desktop card only at desktop widths; the narrow-window arrangement is the example's.

[^arrow-buttons]: Our call: the figure's white circular arrows are not a Material Design 1 component, so the shipped icon button stands in.
