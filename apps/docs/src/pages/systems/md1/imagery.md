---
title: Imagery - Material Design 1 Images, Scrims and Avatars for Vue
meta:
- name: description
  content: Material Design 1 imagery in components. Text protection scrims with the gradient recipe, hero, feature and gallery images, colour overlays, avatars and thumbnails, and how images load.
- name: keywords
  content: md1 imagery, material design 1 imagery, text protection, scrim, gradient, hero image, avatar, thumbnail, color overlay, vue, paper md1
features:
  category: Guide
  label: 'Imagery'
  level: 1
  group: style
  order: 7
related:
  - /systems/md1
  - /systems/md1/card
  - /systems/md1/grid-list
  - /systems/md1/loading-images
  - /systems/md1/toolbar
---

# Imagery

<DocsPageFeatures :frontmatter />

How Material Design 1 puts images into an interface: text protection over photographs, hero, feature and gallery images, colour overlays, avatars and thumbnails. The photography guidance itself, what to shoot and how to crop it, has no code and is not repeated here.

<DocsMd1Reference
  href="https://m1.material.io/style/imagery.html"
  title="Imagery"
/>

## Usage

Material Design 1 has no image component. Images enter through the components that own them, and each brings the imagery page's rules with it:

| Surface | What it does with the image |
|---------|-----------------------------|
| `Md1Card.Media` | Media at a ratio (16:9 by default); content placed inside it sits over a text protection gradient, 40% black fading over 168 dp |
| `Md1GridList.Tile` and `Md1GridList.Bar` | Tiles at a ratio; the bar is a flat 60% black, `--md1-grid-list-bar`, the imagery page's worked example[^grid-bar] |
| `Md1Toolbar.Extension` with `image` | An integrated hero image in a flexible space |
| `Md1List.Avatar` with `src` | A 40 dp circular avatar, `--md1-avatar-size` |

Card media and grid list tiles load their image with the [loading images](/systems/md1/loading-images) recipe: the image fades in, desaturated, over a tone of the divider colour.

::: ds-example
/systems/md1/loading-images/card
:::

## Text protection

A scrim is a light translucent layer between an image and the text on it, there only to make the text legible. The imagery page gives its gradient three stops: the dark end, whose opacity depends on the image; a centre point three tenths of the way from the dark end; and an end point at 0%. The gradient is three times the standard app bar height long, 168 dp on a phone. Dark scrims ideally run from 20% to 40%, light scrims from 40% to 60%, and an image with busy highlights can take 60% black.

| Token or rule | Value | Where |
|---------------|-------|-------|
| Card media gradient | 40% black at the edge, centre at 50 dp, 0% at 168 dp | `Md1Card.Media` with overlaid content |
| `--md1-grid-list-bar` | 60% black, flat | `Md1GridList.Bar` |
| Dark scrim range | 20% to 40% | Your own overlays |
| Light scrim range | 40% to 60% | Your own overlays |

The card gradient and the grid list bar are the two shipped protections; anything else over an image is yours to draw, and the first example shows the recipe on a plain element.

## Examples

::: ds-example
/systems/md1/imagery/protection

### The scrim recipe

A dark scrim, a light scrim and the gradient alone, with the three numbered stops ruled across it. Move the slider through the page's range for each kind: 20% to 60% for dark, 40% to 60% for light.[^dark-range] Text over a dark scrim is white at 100% and 70%; over a light one it turns to black at 87% and 54%, the ink of a light theme.[^scrim-ink]

The gradient runs three app bar heights from the edge where the text sits, with its centre three tenths of the way along, written as a CSS colour hint so the fade is not linear. The example measures it in `--md1-increment`, so it grows to 192 dp with the tablet app bar.[^gradient-increment]

The second image is the large-image case. Protect the area the text occupies, a band under the title at the top and another under the caption at the bottom, rather than darkening the whole photograph.
:::

::: ds-example
/systems/md1/imagery/integration

### Images in the interface

The imagery page's integration patterns, each built from shipped components. A feature image is the bold focus of a layout that mixes containers of different sizes, here a full-width card over a square-image card and a text card. An integrated hero image sets a scene behind the app bar, through `Md1Toolbar.Extension`, while the content below stays the focus. A gallery image fills the screen on black, its controls on a short gradient so the photograph keeps every pixel.

A colour overlay is not text protection. It tints the whole image with a colour from the palette, here the theme's primary multiplied over a greyscale photograph, as a design element in its own right.[^overlay] The guidelines derive the overlay colour from the image with Android's Palette API; on the web, pick it from the palette or extract it at build time.
:::

::: ds-example
/systems/md1/imagery/avatars

### Avatars and thumbnails

Avatars stand for people and brands, thumbnails for content, and both are usually the way into a primary view. A personal avatar is a photograph; until one exists, a default avatar keeps the list aligned with a neutral glyph on Grey 400.[^default-avatar] A brand avatar carries the brand's mark on its own colour. Every list avatar is 40 dp, `--md1-avatar-size`, on the 72 dp content keyline.

Thumbnails are grid list tiles at 1:1. Mix thumbnail sizes in a gallery when the content has a hierarchy; give each image enough resolution for the screen it lands on, because Material Design 1 favours large images and nothing should look pixelated.
:::

## Accessibility

An image that carries information needs alternative text: pass `alt` to `Md1List.Avatar` and to your own `<img>` elements, as the gallery image does. An image behind a title that already says what it shows is decorative, and takes `alt=""`. Text protection is a contrast measure: check white text against the lightest part of the image under the scrim, and raise the scrim's dark end, within the page's range, until it clears 4.5:1. Never put essential text on an image without a scrim.

[^grid-bar]: Our call: the grid lists page states no bar opacity, so the bar takes the 60% black the imagery page gives as its example.

[^dark-range]: Our call: the page's dark range is 20% to 40%; the slider runs to 60% to reach its busy-image example.

[^scrim-ink]: Our call: the page states no text opacity over a scrim, so the example uses the dark and light theme inks.

[^gradient-increment]: Our call: measuring the length in increments lets it follow the tablet app bar; `Md1Card.Media` keeps a fixed 168 dp.

[^overlay]: Our call: the guidelines take the overlay colour from Android's Palette API, which the web lacks, so the example multiplies the primary over a greyscale image.

[^default-avatar]: Our call: the lists page names no avatar colour; Grey 400 with white ink matches the avatars in Vuetify 1.5's list examples.
