# Patterns: feature discovery (growth and communications)

The tap-target prompt of the MD1 "Growth & communications" section, pinned for `Md1FeatureDiscovery`. The page is the only growth-communications page with metrics; its three siblings (introduction, onboarding, gesture education) are summarised at the end so SPEC.md can rule on them.

Confidence legend: `high` = read from the archived spec page text; `moderate` = Vuetify 1.5.24 stylus only; `low` = memory; `not found` = no source states it. Vuetify 1.5.24 ships no feature-discovery component, so every row is spec text or `not found`.

## Sources

| Page | URL | Served capture |
|---|---|---|
| Feature discovery | `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/feature-discovery.html` | 2018-12-04 02:58:11 (the archive served the nearest capture) |
| Feature discovery, mirror | `https://m1.material.io/growth-communications/feature-discovery.html` | read 2026-10-22; every metric sentence identical to the Wayback text |
| Onboarding | `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/onboarding.html` | 2018-12-25 request; served timestamp not recorded in the stripped text |
| Gesture education | `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/gesture-education.html` | same |
| Introduction | `http://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/growth-communications/introduction.html` | same |

The page's figures (`useredu-er-featuredisc-design-01.png`, `useredu-er-feasturedisc-design-phone-centered.png`, `useredu-er-feasturedisc-design-offset.png`, `useredu-er-feasturedisc-design-tablet-contained.png`, `useredu-er-feasturedisc-design-tablet-edge.png`, `useredu-er-featuredisc-color1.png`, `useredu-er-featuredisc-color2.png`) could not be fetched on 2026-10-22: the Wayback image host refused the connection and the `m1.material.io` asset paths return 404. No value below is measured from artwork.

## 1. Definition and anatomy

| Item | Statement | Confidence |
|---|---|---|
| Purpose | "Provide value and improve engagement by introducing users to new features and functionality at relevant moments." | high |
| Single-step actions | Prompt users to try features that complete in a single tap (saving a location in a map app). Components: tap target, hint text | high |
| Multiple-step actions | Prompt users to try features that need more than one tap (turning on automatic backup). Component: guided flow | high |
| Tap target | "A feature discovery prompt focuses user attention on a specific UI element. It contains a tap target, indicated by a circular shape, which is surrounded by a larger area with a distinct background color." | high |
| Actions | "The prompt contains a single action, without additional actions present." | high |
| Dismissal | "Users may dismiss the prompt by using a swipe gesture or tapping outside of the prompt's background area." | high |
| Background | "surrounded by a large background area which is colored using the app's primary color" (figure caption) | high |
| Hint text | "For smaller, simpler prompts that request user input, use hint text instead of tap targets." | high |

## 2. Metrics

| Metric | Value | Context | Confidence |
|---|---|---|---|
| Mobile elevation | "tap targets are located at a higher elevation than other UI elements and may span the width of the screen" | mobile | high (no dp value) |
| Edge rule, mobile | When the promoted action is within 88 dp of the screen top or bottom (excluding the status and navigation bars), place the tap target directly on top of the promoted action | mobile | high |
| Centre offset, mobile | Target right of the screen centre: background offset 20 dp to the left. Target left of centre: background offset 20 dp to the right. Target in the centre: offset automatically left or right by language | mobile | high |
| Containment, desktop and tablet | Prompts are generally limited to the surface the target rests on (such as a card); the tap target is the size of the tappable surface | desktop, tablet | high |
| Off-centre targets, desktop and tablet | Offset the prompt background from the centre of the surface | desktop, tablet | high |
| Small surface | A surface smaller than 280 dp tall and 360 dp wide lets the tap target and prompt background extend beyond its edges, at a higher elevation | desktop, tablet | high |
| Edge rule, surface | Targets within 88 dp of the surface's edge centre the prompt background around the target | desktop, tablet | high |
| Centre offset, surface | Targets in the centre of the screen offset the prompt background by 20 dp; all other targets place the background where other screen elements allow | desktop, tablet | high |
| Screen edge rule | Targets within the top or bottom 144 dp or the left or right 200 dp of the screen centre the background around the target, above other elements | desktop, tablet | high |
| Unconfined prompts | Targets on small surfaces outside those edge bands may use prompts unconfined by any surface, with the same 20 dp left or right offset | desktop, tablet | high |
| Tap target diameter | not stated | | not found |
| Background diameter | not stated | | not found |
| Title and body type | not stated (memory of implementations: Title 20 sp white, body 16 sp white 70%) | | not found (spec); low (memory) |
| Inner target colour | not stated in text (the figures show a light disc under the icon) | | not found |

## 3. Colour

| Item | Value | Confidence |
|---|---|---|
| Tap target colour | "The tap target may use the primary color of your app or toolbar." | high |
| Background opacity | "The background of the tap target has an opacity of 96%." | high |
| Alternatives in the figures | "The primary color is applied to the tap target background." and "The accent color is applied to the tap target background." (two captions) | high |

## 4. Motion

| Phase | Statement | MD1 mapping | Confidence |
|---|---|---|---|
| Appear | "The tap target originates on the screen from the highlighted icon using a standard material motion curve." | scale from the promoted icon on `--md1-easing-standard` over `--md1-duration-enter` (duration not stated) | high (curve); not found (duration) |
| Idle | "While idle, the highlighted action grows by 10% over one second and then shrinks. A material touch ripple emanates from the action as it reaches its largest size." | a 1 s pulse to 110% with an `Md1Ripple` at the peak, repeating; gated by reduced motion | high |
| Interaction | "Tapping the highlighted action causes the tap target to expand and then fade with an ease out." | expand then fade on `--md1-easing-decelerate` over `--md1-duration-leave` (duration not stated) | high (shape); not found (duration) |
| Dismiss | "Tapping outside the tap target causes it to shrink and fade with an ease out." | shrink then fade on `--md1-easing-decelerate` over `--md1-duration-leave` | high (shape); not found (duration) |

## 5. Guided flows

| Component | Statement | MD1 mapping | Confidence |
|---|---|---|---|
| 1. Tap target | "Tap targets introduce the task ahead by highlighting the user benefit." | `Md1FeatureDiscovery` | high |
| 2. Ripple | "Ripples guide users through subsequent steps. The color of the ripple should match the color of the tap target." | `Md1Ripple` with `center` on each following step's control, in the prompt colour | high |
| 3. Completion toast | "Upon completion of the guided flow, provide a toast confirming that the user has completed the task. Include an action that brings the user back to where the tap target appeared." | `Md1Snackbar` with one action (toasts are out; the snackbar is the web surface) | high (rule); the snackbar substitution is SPEC.md's toasts ruling |
| Count | "Guided flows may contain up to three design components." | documented composition, no component | high |

## 6. Targeting, triggering, volume and frequency (docs guidance, no surface)

| Rule | Statement | Confidence |
|---|---|---|
| Target the right users | Show prompts to users who have not tried the feature; avoid advanced features for casual users; general features go to everyone | high |
| Prioritise | Feature discovery continues over time; prioritise features relevant to the user's context, not only new ones | high |
| Do not present on open | Users opening an app to take a specific action are less likely to find a prompt helpful; avoid interruptive moments | high |
| Contextually relevant moments | Present prompts when they help the user complete the action in progress (crop only after an image is added) | high |
| Natural pauses | Without action triggers, show prompts during natural pauses (after a message is read or sent) | high |
| Volume | Limit prompts, for example no more than one per session | high |
| Frequency | After a dismissal do not show the same or a similar message for a substantial period; after acceptance a similar message may follow sooner | high |

## 7. WAI-ARIA and v0 mapping

| Item | Mapping | Confidence |
|---|---|---|
| Pattern | The prompt is a non-modal dialog anchored to one control: `role="dialog"` with `aria-labelledby` (title) and `aria-describedby` (body); the promoted action keeps its own name and stays operable | high (APG dialog pattern); the choice is MD1's |
| v0 primitive | `Tour.Root` (one step), `Tour.Activator` (renderless, binds the promoted action), `Tour.Highlight` (the portal that draws around the activator; v0 draws a cutout scrim, MD1 restyles it as the two circles), `Tour.Content` (`role="dialog"`, `aria-labelledby`, `aria-describedby`, `placement`, `offset`), `Tour.Title`, `Tour.Description`, `Tour.Skip` (dismiss), `Tour.Keyboard` (Escape); `Tour.Next`, `Tour.Prev` and `Tour.Progress` are not rendered for a single step | high (`packages/0/src/components/Tour/*` props read 2026-10-22) |
| Dismiss paths | Tap outside (`Tour.Skip` bound on the background), Escape; the swipe dismissal is a gesture and does not ship | high (spec); the swipe omission is SPEC.md's gesture rule |
| Completion | Tapping the promoted action runs the root's `complete()`; the consumer's own handler on the action still fires | high (`TourRootSlotProps.complete`) |

## 8. Sibling pages (for SPEC.md rulings)

| Page | Content | Suggested ruling | Confidence |
|---|---|---|---|
| Introduction | One paragraph naming onboarding, feature discovery and gesture education | out (no rules) | high |
| Onboarding | Three models: Self-Select (a short series of meaningful choices, fewer than ten per screen, one screen or connected screens; patterns: bundled list, grid view, list), Quickstart (land directly in the UI; offer education at about 90% of the first session; prioritise the first key action), Top User Benefits (an autoplay carousel of up to three illustrations rotating every two to three seconds with pagination dots and a fixed "Get Started" button, swipe-enabled, auto-advance disabled on touch; or a video without pagination; layouts: centred copy under a 1:1 illustration on portrait, left-aligned copy beside it on landscape, a centred card with "Next" and "Previous" buttons on desktop). Do not combine Self-Select with Top User Benefits | composition: `Md1Button`, `Md1List` or `Md1GridList` (choices), `Md1Card` (desktop card); no surface, no metrics beyond the counts above | high |
| Gesture education | Partial-surface prompts ("hint motion" previews how a card moves; the gesture being taught is the only way to dismiss the sample UI) and entire-screen prompts (a snackbar describes the gesture while a gesture indicator shows it; tapping restores the page; a bottom sheet stays until the user interacts). Show only to users who have not performed the gesture; up to two prompts in the first run for critical gestures; most prompts once | out: the hint motion is a gesture rehearsal with no metrics; the full-screen variant's text is an `Md1Snackbar` the consumer raises | high |

## 9. Not found

| Item | Where it should have been | Status |
|---|---|---|
| Tap target and background diameters | Design section | not found (figures only, not fetched) |
| Title and body type styles | Design section | not found |
| Durations for appear, interaction and dismiss | Motion section | not found; the motion page's enter and leave values stand in |
| Inner target disc colour and opacity | Color section | not found (only the 96% background is stated) |
| Elevation value for "a higher elevation" | Mobile and Desktop sections | not found |
