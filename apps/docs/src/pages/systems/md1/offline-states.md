---
title: Offline States - Material Design 1 Offline States for Vue
meta:
- name: description
  content: The Material Design 1 offline states pattern. Mark what works offline, explain what does not, download for later with progress, and remove downloads.
- name: keywords
  content: md1 offline, material design 1 offline states, offline pin, cloud off, no internet, download progress, offline ux, vue offline, paper md1
features:
  category: Guide
  label: 'Offline states'
  level: 2
  renderless: false
  group: patterns
  order: 17
related:
  - /systems/md1
  - /systems/md1/icon
  - /systems/md1/list
  - /systems/md1/snackbar
  - /systems/md1/progress-circular
---

# Offline states

<DocsPageFeatures :frontmatter />

Keep an app useful without a connection: show what is available, say what is not, and let people save content for later.

> [!NOTE]
> Reference: [Offline states, Material Design 1 guidelines](https://m1.material.io/patterns/offline-states.html), the archived page Material Design 1 is pinned to. Principles, states and settings, icons and the download interaction. This page is the Vue.

## Usage

The guidelines give three principles:

- **Adapt to the connection.** Plan for a slow, intermittent or missing connection, not only for none.
- **Illustrate functionality.** Let an element's design show how it behaves offline.
- **Display available content.** Loading something beats loading nothing, as long as the app explains that the connection is limited.

The app should say whether it is online or offline, especially when some features work offline and some do not, and give people one place to manage what they have saved.

::: ds-example
/systems/md1/offline-states/available
:::

## Icons and labels

The page names four glyphs and pairs each with a fixed label.

| Glyph | Role | Label | Meaning |
|-------|------|-------|---------|
| Offline pin | `offline-pin` | "Offline" | This works offline, or has been downloaded |
| Cloud off | `cloud-off` | "No internet" | This needs a connection; show only while offline |
| Download | `download` | "Download", with the file size | This can be saved for offline use |
| Delete | `delete` | A remove action, with the space it frees | This download can be removed |

Use the standard glyphs. Never use a toggle for downloading one file: a toggle says a state is on or off, and a download is a one-time action.

> [!WARNING]
> Material Design 1's pinned icon set ships `download` and `delete` but not `offline-pin` or `cloud-off`. Until it does, register them app-wide through `createMd1IconsPlugin({ icons })`. The examples on this page register them for their own subtree with `createMd1IconsContext({ icons })`, which takes the same options. The path data is the Material Icons source at the commit the set is pinned to.

## Examples

::: ds-example
/systems/md1/offline-states/available

### Available offline

Content that works offline carries the offline pin with the label "Offline". Two of the three saved articles here can be read without a connection; the third has no mark, so the reader knows before opening it that it needs one.

The pin and its label sit in `Md1List.Action`, the end column of the row, in Caption text at the secondary ink with the glyph at the active icon opacity (`--md1-icon-active`, 54% black on light, 100% white on dark). The label is what a screen reader reads; the glyph is decorative.

The same mark follows the content elsewhere: an offline icon beside a page address when a site is read offline, and on the item the user just acted on while offline.
:::

::: ds-example
/systems/md1/offline-states/unavailable

### Not available offline

A feature that needs a connection is marked with the cloud-off glyph and, where there is room, the words "No internet". Show it only while the app is offline; online, it would only raise a doubt.

This screen is search in a music app, which needs a connection. Instead of an empty page it says what is missing and what still works, and offers the way there: Go to downloads. That is the guideline's "helpful tips of what the user can do while offline". When the connection returns, the app can offer a download action so the same content is ready next time.
:::

::: ds-example
/systems/md1/offline-states/limited

### Showing saved content

When the connection drops, show the content the app already has rather than an empty screen. The inbox here lists the mail stored on the device. A snackbar explains that the connection is limited and what the user is looking at, and an indeterminate `Md1ProgressLinear` at the top of the list shows the app is still trying.

The snackbar has no action. There is nothing for the user to do: the app reconnects on its own, and a Try again button that cannot succeed is what the errors page tells you not to offer. It leaves after the 6000 ms default; the progress bar stays until the connection is back.
:::

::: ds-example
/systems/md1/offline-states/download

### Downloading for offline

To show that something can be downloaded, pair the download glyph with the word "Download" and include the file size, so people can tell whether it is too large before they start. Press Download 32 MB.

While the episode downloads, a determinate `Md1ProgressCircular` takes the button's place, at the 24 dp size of the glyph it replaces. When it completes, the offline pin and "Offline" appear in the same spot. The guidelines describe this as the download glyph turning into the offline pin, with the progress indicator as the transition between the two. The circle is announced with its `aria-label` and value; the final state is a status message.

While offline, let people pick files to download later, when a connection is back.
:::

::: ds-example
/systems/md1/offline-states/remove

### Removing downloads

People delete downloads to free space, so every downloaded file needs a remove action. Each row here has a delete glyph, and the row says how much space removing it saves. The total at the top updates as files go.

Removing a download is reversible (it can be downloaded again), so it is not confirmed in a dialog. When removing loses something that cannot be downloaded again, confirm it the way the [confirmation](/systems/md1/confirmation) pattern describes.
:::

::: ds-example
/systems/md1/offline-states/places

### A place for offline content

Give people one destination for what they have saved and for their offline settings, and mark it with the offline pin. Here it is an Offline item in the navigation drawer, between the app's main destinations and Settings.

The drawer is an `Md1NavigationDrawer` of `Md1List` rows with `Md1List.Icon` glyphs. The pin on the destination matches the pin on each saved item, so the mark leads to the place.
:::

## Accessibility

Offline state is a fact the user needs before they act, so it must be text as well as a glyph. Every pin and cloud here has a visible label next to it, and the glyphs stay hidden from assistive technology.

| Moment | Announced through |
|--------|-------------------|
| The app goes offline | The snackbar's `role="status"` live region |
| A download progresses | `Md1ProgressCircular`'s `progressbar` role, its `aria-label` and value |
| A download completes | The "Offline" label, in a `role="status"` region |
| A download is removed | The storage total, in a `role="status"` region |

Do not rely on color or a dimmed row alone to say that something is unavailable offline.
