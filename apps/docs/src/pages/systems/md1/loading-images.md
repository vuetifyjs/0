---
title: Loading Images - Material Design 1 Loading Images Pattern for Vue
meta:
- name: description
  content: The Material Design 1 loading images pattern. Images fade in from transparent, flat and desaturated, on card media and grid list tiles, with a staggered three-phase recipe for your own images.
- name: keywords
  content: md1 loading images, material design 1 loading images, image fade in, progressive image load, saturation, exposure, card media, grid list, vue image loading, paper md1
features:
  category: Guide
  label: 'Loading images'
  level: 2
  renderless: false
  group: 'patterns'
  order: 15
related:
  - /systems/md1
  - /systems/md1/card
  - /systems/md1/grid-list
  - /systems/md1/motion
  - /composables/system/use-image
---

# Loading images

<DocsPageFeatures :frontmatter />

Images in Material Design 1 do not pop in. They develop like a print: opacity, exposure and saturation rise in three staggered phases, over a longer duration than a transition, and full colour arrives last.

<DocsMd1Reference
  href="https://m1.material.io/patterns/loading-images.html"
  title="Loading images"
/>

## Usage

Material Design 1 has no image component; the guidelines define none. The two components that own an image, `Md1Card.Media` and `Md1GridList.Tile`, run the recipe themselves from their `src`, so an image placed through them loads the Material way with no extra code.

::: ds-example
/systems/md1/loading-images/card
:::

While the image loads, the card's media area holds a 12% tone (`--md1-divider`) instead of leaving a hole in the sheet, and the image waits at 0% opacity, 20% saturation and a lifted exposure. When it arrives, opacity and filter ease to full over `--md1-duration-complex` (375 ms on a phone, 200 ms under a mouse) on the standard curve.[^load-duration] An image that fails keeps the tone and hides the broken glyph. Each press of the button loads a new URL, so the browser fetches again instead of answering from its cache.

## The recipe

| Phase | Guidelines | Ends |
|-------|-----------|------|
| Opacity | 0% at the start, 100% at the end | Halfway through the load |
| Exposure | Gamma, or black output for darker images: the image starts low in contrast | Three quarters of the way through |
| Saturation | 0% or 20% at the start, 100% at the end | At the end of the load, after full opacity |
| Duration | Longer for a load than for a transition | No value stated |
| Position | A small shift as the image loads, horizontal in the guidelines' account switcher | No value stated |

The three phases start together and end in sequence. The end points are read from the guidelines' timing figure: every track starts at 1 on a scale of 1 to 3, and opacity ends at 2, exposure at 2.5 and saturation at 3. The page gives no milliseconds. The guidelines warn against adjusting levels in a way that overexposes the lighter values, so the composed example below lifts contrast from a flat start rather than boosting brightness.

| Surface | Opacity | Exposure | Saturation | Timing |
|---------|---------|----------|------------|--------|
| `Md1Card.Media` | 0% to 100% | `brightness(1.2)` to none | 20% to 100% | One transition for all three, `--md1-duration-complex`, standard curve[^card-phases] |
| `Md1GridList.Tile` | 0% to 100% | none[^tile-exposure] | 20% to 100% | One transition for both, `--md1-duration-complex`, decelerate curve, independent of the tile's staggered entrance |
| Your own image | Composed as in Three phases on your own image, below | Contrast from 60% | 20% to 100% | Staggered phases on a docs-chosen duration |

## Examples

::: ds-example
/systems/md1/loading-images/grid

### Grid list tiles

`Md1GridList.Tile` loads its image the same way: transparent and at 20% saturation until the browser reports it loaded, then full opacity and colour over `--md1-duration-complex` on the decelerate curve. The tiles themselves also enter in sequence, each 20 ms (`--md1-stagger`) after the one before, left to right and then top to bottom, the choreography rule of the [Motion](/systems/md1/motion) page. The two motions are independent: a tile can have finished entering long before its image arrives, and the grid never waits for the slowest image.

The button re-keys the grid, which remounts every tile with new image URLs, so both the entrance and the image loads play again. A tile whose image was already complete before the component could listen for `load` (a cached image during hydration) is caught on mount and shown at once rather than left faded out.

Use the grid when images are the primary content of a collection: photos, albums, products. The tile bars keep their own `--md1-grid-list-bar` protection, so captions read before the image arrives.
:::

::: ds-example
/systems/md1/loading-images/phases

### Three phases on your own image

An image that does not sit in a card or a grid list, a navigation drawer header or a hero behind a toolbar, takes the recipe as a composition. The example tracks the load with v0's [useImage](/composables/system/use-image), writes its state to `data-state` on the `<img>`, and lets the stylesheet run two animations once the state reads `loaded`.

The first animation is opacity from 0% to 100% with an 8 px horizontal shift, the small position change the guidelines add, over half the load on the decelerate curve.[^shift] The second is a filter over the whole load: contrast rises from 60% to 100% by three quarters of the way[^contrast-start], and saturation climbs from 20% to 100% across the full length, so colour is the last thing to land. The load duration is four times `--md1-duration-complex`, 1.5 s on a phone and 800 ms under a mouse. The guidelines ask only for something longer than a transition, so this value is a docs choice; keep the proportions and pick the length for the image's size and prominence.

The guidelines call the full treatment ideal for large images on large screens, their example being a desktop wallpaper. For small thumbnails a plain fade is enough. Both animations stop under reduced motion, through the same `data-reduced-motion` attribute and media query the rest of Material Design 1 reads, and the image then appears in its final state.
:::

## Accessibility

The recipe is visual only. The image's accessible name comes from its `alt`, which card media and grid tiles leave empty by default (decorative); pass `alt` when the image carries information its title or bar does not. Nothing is announced while an image loads, which is correct for decoration; when an image is the content itself, mark its container `aria-busy="true"` until it loads so assistive technology waits for it.

Under reduced motion every phase is skipped: card media and grid tiles drop their transitions, and the composed example drops its animations, so the image appears at full opacity and colour as soon as it arrives.

[^load-duration]: Our call: the page asks only for a duration longer than a transition; the complex duration and the standard curve are ours, and the placeholder takes the divider tone.

[^card-phases]: Our call: `brightness` stands in for the exposure step, and the three phases share one transition rather than ending in sequence.

[^tile-exposure]: Our call: CSS has no gamma filter, so the tile skips the exposure phase.

[^shift]: Our call: the page shows a small horizontal shift without a distance; 8 px is the example's.

[^contrast-start]: Our call: 60% contrast is the example's flat starting point; the page gives the exposure phase no value.
