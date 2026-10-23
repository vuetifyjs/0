---
title: Typography - Material Design 1 Type Scale for Vue
meta:
- name: description
  content: The Material Design 1 type scale. Thirteen styles from Display 4 to Caption as md1-type classes, Roboto and Noto, desktop sizes and dense and tall scripts.
- name: keywords
  content: md1 typography, material design 1 type scale, roboto, noto, display headline title subheading body caption, vue typography, paper md1
features:
  category: Guide
  label: 'Typography'
  level: 1
  group: 'style'
  order: 2
related:
  - /systems/md1
  - /systems/md1/color
  - /systems/md1/button
---

# Typography

<DocsPageFeatures :frontmatter />

The Material Design 1 type scale: thirteen named styles set in Roboto and Noto, from Display 4 at 112 sp down to the 12 sp Caption, with desktop sizes and rules for dense and tall scripts.

> [!NOTE]
> Reference: [Typography, Material Design 1 guidelines](https://m1.material.io/style/typography.html), the archived page Material Design 1 is pinned to. Typeface, scale, leading, tracking, language categories and text opacity. This page is the Vue.

## Usage

Each style is a class. Put `md1-type-<style>` on any element and it gets the family, size, weight, leading, tracking, case and ink opacity of that style, with the desktop and script switches built in:

```vue
<template>
  <h2 class="md1-type-headline">Coastal walks</h2>

  <p class="md1-type-body-1">Six routes along the coast.</p>
</template>
```

The classes ship in `@paper/md1/style.css`. Material Design 1's components set their own text with the same tokens, so you need the classes only for your own content. When a class does not fit, read the tokens directly: `--md1-type-<style>-size`, `-weight`, `-leading`, `-tracking` and `-transform`, plus `--md1-font-family`.

::: ds-example
/systems/md1/typography/basic
:::

## Type scale

"The basic set of styles are based on a typographic scale of 12, 14, 16, 20, and 34." Sizes are in sp and leading in dp, both written as px on the web, one to one. Where two sizes are given, the first is for touch devices and the second for desktop. Each style's class is `md1-type-` and the style's name in kebab case: `md1-type-display-4` to `md1-type-menu`.

| Style | Weight | Size (sp) | Leading (dp) | Tracking | Case | Ink |
|-------|--------|-----------|--------------|----------|------|-----|
| Display 4 | Light 300 | 112 | single line | -10 | Sentence | 54% |
| Display 3 | Regular 400 | 56 | single line | -5 | Sentence | 54% |
| Display 2 | Regular 400 | 45 | 48 | 0 | Sentence | 54% |
| Display 1 | Regular 400 | 34 | 40 | 0 | Sentence | 54% |
| Headline | Regular 400 | 24 | 32 | 0 | Sentence | 87% |
| Title | Medium 500 | 20 | single line | 5 | Sentence | 87% |
| Subheading | Regular 400 | 16 / 15 | 24 | 10 | Sentence | 87% |
| Subheading 2 | Regular 400 | 16 / 15 | 28 | 10 | Sentence | 87% |
| Body 2 | Medium 500 | 14 / 13 | 24 | 10 | Sentence | 87% |
| Body 1 | Regular 400 | 14 / 13 | 20 | 10 | Sentence | 87% |
| Caption | Regular 400 | 12 | single line | 20 | Sentence | 54% |
| Button | Medium 500 | 14 | single line | 10 | All caps | 87% |
| Menu | Medium 500 | 14 / 13 | single line | 10 | Sentence | 87% |

Ink is the style's opacity of black on a light theme, from the page's contrast figure; on a dark theme the same two tiers become white at 70% and 100% through `--md1-text-secondary` and `--md1-text-primary` (see [Color](/systems/md1/color)).

Three columns carry a Material Design 1 decision where the page is silent:

- **Single-line leading.** The page prints no leading for Display 4, Display 3, Title, Caption, Button and Menu, which "should exist as single lines". Material Design 1 sets `line-height: 1` on them.
- **Tracking unit.** The page prints bare numbers. Material Design 1 reads them as Adobe tracking units, 1/1000 em, so -10 is `-0.01em` and 20 is `0.02em`.
- **Menu.** The archived scale, leading and tracking images omit Menu, though the contrast figure lists it. Material Design 1 uses Medium 14 sp (13 sp desktop), single line, at tracking 10. Those metrics are a recollection of earlier revisions of the page, not a capture Material Design 1 could read; treat them as the least certain on the page.

## Typeface

Roboto is the standard typeface, and Noto covers every language Roboto does not. The page's stack is Roboto, then Noto, then the platform sans-serif, and Material Design 1 publishes it as `--md1-font-family`:

```css
font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
```

Material Design 1 does not load fonts. Include Roboto in the weights the scale uses (Light 300, Regular 400 and Medium 500, plus Bold 700 for tall scripts) the way your app loads any web font; without it the stack falls through to the system sans-serif. The weights are also tokens: `--md1-font-weight-light`, `-regular`, `-medium` and `-bold`.

## Desktop sizes

The page gives two sizes for the body styles: one for phones and tablets and a smaller one where mouse and keyboard are the primary input. Material Design 1 keys that on `(pointer: fine)`. Under it, Subheading and Subheading 2 drop to 15 sp and Body 2, Body 1 and Menu to 13 sp; leading, weight and every other style stay the same. A laptop with a touch screen and a mouse reports a fine pointer and gets the desktop sizes. There is no runtime override.

## Dense and tall scripts

The page sorts languages into three categories, and Material Design 1 switches between them on the `lang` attribute alone. Set `lang` on `<html>`, or on any element for a passage in another language, and the type tokens and classes beneath it rescope.

| Category | Languages (`:lang()`) | Size | Leading | Weight | Font stack |
|----------|------------------------|------|---------|--------|------------|
| English-like | everything else | the scale above | the scale above | the scale above | Roboto, Noto, sans-serif |
| Dense | `ja`, `ko`, `zh` | 1 sp larger from Title down | the taller column below | as English | Roboto, "Noto Sans CJK", Noto, sans-serif |
| Tall | `ar`, `bn`, `fa`, `gu`, `hi`, `km`, `kn`, `lo`, `ml`, `mr`, `my`, `ne`, `pa`, `si`, `ta`, `te`, `th`, `ur`, `vi` | 1 sp larger from Title down | the taller column below | Regular and Bold only | Roboto, "Noto Sans", Noto, sans-serif |

Styles larger than Title keep the English size. Leading grows for every wrapping style:

| Style | English (dp) | Dense and tall (dp) |
|-------|--------------|---------------------|
| Display 2 | 48 | 63 |
| Display 1 | 40 | 48 |
| Headline | 32 | 34 |
| Subheading 2 | 28 | 30 |
| Subheading | 24 | 26 |
| Body 2 | 24 | 26 |
| Body 1 | 20 | 23 |

Noto ships tall scripts in Regular and Bold only, so the page's own table sets every Medium style in Bold there (Title, Body 2 and Button) and Display 4 in Regular. The table has no Menu row; Material Design 1 sets Menu in Bold too, by the same rule. The page's prose advises against Bold; Material Design 1 follows the table, which is the only one that names a weight per style. On desktop the dense and tall body styles drop back by one: Subheading 16 sp, Body 2, Body 1 and Menu 14 sp.

## Examples

::: ds-example
/systems/md1/typography/scale

### The type scale

All thirteen styles, each set with its `md1-type-*` class and labelled with the metrics the class applies: weight, size (device and desktop where they differ), leading, tracking in the page's units and the ink opacity. The metrics are read from the same token dictionary the classes are generated from, so the labels and the rendering cannot disagree.

Use the display styles sparingly, for a number or a short heading that is the point of the screen; they read at 54% so their size does the work rather than their weight. Title is the app bar's style "across form factors". Body 1 is running text and Body 2 its emphasised form, Caption is for annotations and image captions, and Button is the label every button uses, capitalised by `text-transform` while the source text stays in sentence case. Single-line styles never wrap; on a narrow screen the sample is cut off with an ellipsis instead.
:::

::: ds-example
/systems/md1/typography/desktop

### Device and desktop sizes

The five styles with a desktop size, labelled with both and with the column your browser is getting right now. Open the page on a phone and the device sizes are active; on a desktop with a mouse the 15 sp Subheading and the 13 sp Body and Menu are.

The switch is CSS only: the type tokens are redeclared under `(pointer: fine)` and every class and component reads the tokens, so nothing in your markup changes. This is separate from the `dense` prop some components take. Dense condenses a component's geometry where its page names a dense variant; the desktop type sizes apply everywhere a fine pointer is present.
:::

::: ds-example
/systems/md1/typography/leading

### Subheading and Subheading 2

The page gives the Subheading style two leadings. At 24 dp it sits under a Display or a Headline; at 28 dp, as Subheading 2, it is the two-line heading paired with Body text, the extra 4 dp keeping it apart from the 20 dp Body lines that follow. Both are Regular 16 sp (15 sp on desktop); only the line height differs.

The guidelines also suggest the larger Subheading in place of Body when information comes in short snippets, or when a title is paired with lines of Body text. Keep running text between 40 and 60 characters a line, the page's ideal measure; these blocks cap at 60.
:::

::: ds-example
/systems/md1/typography/scripts

### Dense and tall scripts

The same four styles in English, Japanese (dense) and Vietnamese (tall), with only the `lang` attribute changed. Japanese takes 1 sp more from Title down, 21 sp Title, 17 sp Subheading, 15 sp Body 1 and Button, with the taller leading column. Vietnamese takes the same sizes and leading and sets Title and Button in Bold, because Noto has no Medium for the tall scripts. The labels give the device sizes; under a fine pointer the Subheading renders at 16 sp and Body 1 at 14 sp, the desktop column of the script tables.

Set `lang` correctly and the type follows; there is no prop, class or plugin option for it. Your app must still load a font that covers the script: Noto Sans CJK for Chinese, Japanese and Korean, the matching Noto family for the others. The labels under each line are marked `lang="en"` so assistive technology reads them in English.
:::

## Accessibility

The page sets a contrast floor of 4.5:1 for text, with 7:1 preferred. The style inks meet it on Material Design 1's light surfaces: 87% black on white measures about 16:1 and 54% black about 4.6:1. Keep secondary-tier styles, Caption and the display styles, off tinted backgrounds that would push them under 4.5:1.

Sizes are in px, the web reading of sp. The page's reason for sp is that a platform can scale type for readers who need it. Browser zoom scales px; a reader's default font size setting does not, because the tokens are px rather than rem. Button labels are capitalised by `text-transform`, so screen readers announce the sentence-case source text rather than spelling out capitals. Set `lang` on every passage in another language: the dense and tall rules depend on it, and so does the voice a screen reader picks.
