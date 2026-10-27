---
title: Permissions - Material Design 1 Permissions Pattern for Vue
meta:
- name: description
  content: The Material Design 1 permissions pattern. Explain a denied permission with a snackbar, and give a critical one its own screen with a way to Settings.
- name: keywords
  content: md1 permissions, material design 1 permissions, denied permission, runtime permissions, permission snackbar, grant access, vue permissions, paper md1
features:
  category: Guide
  label: 'Permissions'
  level: 2
  renderless: false
  group: patterns
  order: 18
related:
  - /systems/md1
  - /systems/md1/snackbar
  - /systems/md1/button
  - /systems/md1/onboarding
---

# Permissions

<DocsPageFeatures :frontmatter />

Ask for access at the moment it makes sense, explain why, and say what happens when the answer is no.

<DocsMd1Reference
  href="https://m1.material.io/patterns/permissions.html"
  title="Permissions"
/>

## Usage

The request itself is the platform's dialog, not the app's, so this page shows only what the app draws: what it says after a denial. The guidelines' request patterns still decide when to ask:

- **Ask up-front** only for critical permissions whose purpose is obvious, such as SMS for a messaging app.
- **Ask in context**, when a feature is first used, for everything else.
- **Educate** first when the reason is not clear, in a warm welcome for critical permissions and next to the feature for the rest.
- **Ask only for what is relevant**, and give an immediate benefit for what was granted.

A user's own action, such as taking a picture or choosing a contact, is consent enough; no permission request belongs there.

A permission can be denied by the user in the request, or silently, because the user once chose "Don't ask again". Either way the feature no longer works as intended, so the app says that permission is needed and gives a way to allow it.

## Examples

::: ds-example
/systems/md1/permissions/educate

### Educate in context

"Non-critical permissions that are less intuitive may benefit from being explained in context." Location is secondary to a photo app, and why it wants location is not obvious, so the request waits until the feature is invoked and comes with an explanation. Add location opens a card right under the photo that says what the permission is for and how little it reads; only Continue asks the browser, so the system prompt never arrives without the explanation in front of it. Not now closes the card and asks nothing.

The request is real: Continue calls `navigator.geolocation.getCurrentPosition`. When it is allowed the photo is tagged with the place. When it is denied, at the prompt or by a block set earlier, the status line says the photo stays untagged and where to allow location, the feedback the page asks for whenever a permission is denied, while the rest of the screen keeps working. A permission the browser already reports as granted skips the explanation, because no prompt follows.
:::

::: ds-example
/systems/md1/permissions/denied

### A denied permission

When a secondary feature needs a permission the user has denied, a snackbar says so at the moment the feature is used. Here the microphone in a notes app was turned down: tapping the voice-note button shows "To record voice notes, allow Notes permission to record audio." with a Settings action that leads to the app's permission settings.

The rest of the app keeps working; only the feature that needs the permission stops, and the message names that feature rather than the permission group alone.

The copy, the multi-line snackbar and the Settings action are the figure's. The notes app around them is drawn in the app's primary rather than the figure's cyan,[^notes-primary] and its quick-note row uses the nearest glyphs the icon set ships.[^notes-glyphs] At a phone width the message fits its two lines; in a column narrower than a 360 dp phone the snackbar's two-line limit cuts it short.[^snackbar-copy]
:::

::: ds-example
/systems/md1/permissions/critical

### A critical permission

When the app cannot run at all without a permission, a snackbar is not enough. A full screen explains why the permission must be allowed and offers a button that opens Settings, with a way out of the app beside it. Here a messenger needs SMS, Phone and Contacts; Exit closes the app and Settings takes the user to grant access.

The layout is the figure's: the headline, the explanation, the two flat actions over a seam, and Settings trailed by a chevron. The figure's illustration does not ship, so three discs with the SMS, Contacts and Phone glyphs stand in for it,[^critical-art] and the screen takes the app's primary in place of the figure's green.[^critical-fill]
:::

## Accessibility

The snackbar is a `role="status"` live region, so the denial is announced when it appears, and its Settings action is a real button reachable by keyboard. On the critical screen the title is a heading, the needed permissions are a labelled list, and both actions are buttons; the glyphs in the discs are decorative and the labels under them carry the meaning.

[^notes-primary]: Our call: the app bar takes the docs theme's primary, so the example follows the theme switch like every other Material Design 1 screen.

[^notes-glyphs]: Our call: the figure's note, list, mic and camera glyphs are drawn with the `edit`, `reorder`, `mic` and `photo` roles, the nearest the set ships.

[^snackbar-copy]: Our call: the snackbars page allows two lines on mobile, and the action stacks below the text only when it is wider than 128 px, so a narrow column ellipsizes the figure's copy rather than the example shortening it.

[^critical-art]: Our call: illustration is not in the package; three 56 dp discs at 24% white keep the figure's three-permission motif.

[^critical-fill]: Our call: the figure's green is that app's own colour, and the primary is this one's.
