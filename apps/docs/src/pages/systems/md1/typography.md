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
| Display 4 | Light 300 | 112 | single line | -10 (ships -0.04em)[^tracking-v15] | Sentence | 54% |
| Display 3 | Regular 400 | 56 | single line (ships 1.35)[^display-3-leading] | -5 (ships -0.02em)[^tracking-v15] | Sentence | 54% |
| Display 2 | Regular 400 | 45 | 48 | 0 | Sentence | 54% |
| Display 1 | Regular 400 | 34 | 40 | 0 | Sentence | 54% |
| Headline | Regular 400 | 24 | 32 | 0 | Sentence | 87% |
| Title | Medium 500 | 20 | single line | 5 (ships 0.02em)[^tracking-v15] | Sentence | 87% |
| Subheading | Regular 400 | 16 / 15 | 24 | 10 | Sentence | 87% |
| Subheading 2 | Regular 400 | 16 / 15 | 28 | 10 | Sentence | 87% |
| Body 2 | Medium 500 | 14 / 13 | 24 | 10 | Sentence | 87% |
| Body 1 | Regular 400 | 14 / 13 | 20 | 10 | Sentence | 87% |
| Caption | Regular 400 | 12 | single line | 20 | Sentence | 54% |
| Button | Medium 500 | 14 | single line | 10 | All caps | 87% |
| Menu | Medium 500 | 14 / 13 | single line | 10 | Sentence | 87% |

Ink is the style's opacity of black on a light theme, from the page's contrast figure; on a dark theme the same two tiers become white at 70% and 100% through `--md1-text-secondary` and `--md1-text-primary` (see [Color](/systems/md1/color)).

Three columns carry a Material Design 1 decision where the page is silent:

- **Single-line leading.** The page prints no leading for Display 4, Display 3, Title, Caption, Button and Menu, which "should exist as single lines". Material Design 1 sets `line-height: 1` on them, except Display 3, which takes Vuetify 1.5's 1.35.[^single-line]
- **Tracking unit.** The page prints bare numbers and no unit. Where Vuetify 1.5 sets a tracking, Material Design 1 takes it: Display 4 at `-0.04em`, Display 3 at `-0.02em` and Title at `0.02em`. Vuetify sets none on the other styles, and its `normal` would erase the page's numbers, so they are read as Adobe tracking units, 1/1000 em: Subheading's 10 is `0.01em` and Caption's 20 is `0.02em`.[^tracking-unit]
- **Menu.** The archived scale, leading and tracking images omit Menu, though the contrast figure lists it. Material Design 1 uses Medium 14 sp (13 sp desktop), single line, at tracking 10.[^menu-metrics] Those metrics are a recollection of earlier revisions of the page, not a capture Material Design 1 could read; treat them as the least certain on the page.

## Typeface

Roboto is the standard typeface, and Noto covers every language Roboto does not. The page's stack is Roboto, then Noto, then the platform sans-serif, and Material Design 1 publishes it as `--md1-font-family`:

```css
font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
```

Material Design 1 does not load fonts. Include Roboto in the weights the scale uses (Light 300, Regular 400 and Medium 500, plus Bold 700 for tall scripts) the way your app loads any web font; without it the stack falls through to the system sans-serif. The weights are also tokens: `--md1-font-weight-light`, `-regular`, `-medium` and `-bold`.

## Desktop sizes

The page gives two sizes for the body styles: one for phones and tablets and a smaller one where mouse and keyboard are the primary input. Material Design 1 keys that on `(pointer: fine)`.[^pointer-fine] Under it, Subheading and Subheading 2 drop to 15 sp and Body 2, Body 1 and Menu to 13 sp; leading, weight and every other style stay the same. The query reads the primary pointer only: a laptop with a touch screen gets the desktop sizes while its trackpad or mouse is the primary pointer, and the device sizes when the browser reports touch as primary, as a 2-in-1 in tablet mode does. There is no runtime override.

## Dense and tall scripts

The page sorts languages into three categories, and Material Design 1 switches between them on the `lang` attribute alone. Set `lang` on `<html>`, or on any element for a passage in another language, and the type tokens and classes beneath it rescope.

| Category | Languages (`:lang()`) | Size | Leading | Weight | Font stack |
|----------|------------------------|------|---------|--------|------------|
| English-like | everything else | the scale above | the scale above | the scale above | Roboto, Noto, sans-serif |
| Dense | `ja`, `ko`, `zh` | 1 sp larger from Title down | the taller column below | as English | Roboto, "Noto Sans CJK", Noto, sans-serif[^noto-names] |
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

Noto ships tall scripts in Regular and Bold only, so the page's own table sets every Medium style in Bold there (Title, Body 2 and Button) and Display 4 in Regular. The table has no Menu row; Material Design 1 sets Menu in Bold too, by the same rule.[^menu-bold] The page's prose advises against Bold; Material Design 1 follows the table, which is the only one that names a weight per style. On desktop the dense and tall body styles drop back by one: Subheading 16 sp, Body 2, Body 1 and Menu 14 sp.

## Examples

::: ds-example
/systems/md1/typography/roboto

### Roboto

The standard typeface in its six weights, Thin, Light, Regular, Medium, Bold and Black, upright and italic, with the full alphabet and numerals. The type scale uses three of them: Light for Display 4, Regular for most styles and Medium for Title, Body 2, Button and Menu; Bold is the tall scripts' substitute for Medium.

These docs load Roboto from Google Fonts on every Material Design 1 page. Material Design 1 itself loads no fonts, so an app that does not load Roboto renders the scale in the platform's sans-serif.
:::

::: ds-example
/systems/md1/typography/noto

### Noto

Noto covers every language Roboto does not, with vertical metrics compatible with Roboto so mixed lines sit on one baseline. Noto Sans CJK has seven weights, Thin to Black with a DemiLight between Light and Regular, and its Regular matches Roboto Regular; Noto Sans Thai, Devanagari and the other tall scripts have Regular and Bold only, which is why the tall rules swap Medium for Bold.

Google Fonts publishes the CJK families per locale, Noto Sans SC, TC, JP and KR, and the tall ones per script. The specimens load each from there; the weights shown are the ones each family ships.
:::

::: ds-example
/systems/md1/typography/scale

### The type scale

All thirteen styles, each set with its `md1-type-*` class and labelled with the metrics the class applies: weight, size (device and desktop where they differ), leading, the tracking the class sets and the ink opacity. The metrics are read from the same token dictionary the classes are generated from, so the labels and the rendering cannot disagree.

Use the display styles sparingly, for a number or a short heading that is the point of the screen; they read at 54% so their size does the work rather than their weight. Title is the app bar's style "across form factors". Body 1 is running text and Body 2 its emphasised form, Caption is for annotations and image captions, and Button is the label every button uses, capitalised by `text-transform` while the source text stays in sentence case. Single-line styles never wrap; on a narrow screen the sample is cut off with an ellipsis instead.
:::

::: ds-example
/systems/md1/typography/context

### The styles in use

The scale set in a screen rather than a specimen, each line tagged with its style. Display carries the one number the screen is about and Headline the place it belongs to; Subheading is the short snippet the guidelines prefer to Body for small pieces of information, Body 2 the emphasised label and Body 1 the running text, Caption the annotation, and Button the label of every button, capitalised by CSS.

Components set their own text from the same tokens, so the toolbar's title is in Title, "across form factors", and the list underneath sets its primary lines in Subheading and its secondary lines in Body 1 with no class from you.
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

The same four styles in English, Japanese and Traditional Chinese (dense), and Vietnamese, Hindi and Thai (tall), with only the `lang` attribute changed. The dense and tall columns take 1 sp more from Title down, 21 sp Title, 17 sp Subheading, 15 sp Body 1 and Button, with the taller leading column. The tall columns set Title and Button in Bold, because Noto has no Medium for the tall scripts. The labels give the device sizes; under a fine pointer the Subheading renders at 16 sp and Body 1 at 14 sp, the desktop column of the script tables.

Set `lang` correctly and the type follows; there is no prop, class or plugin option for it. Your app must still load a font that covers the script. The stack names the families a platform installs, "Noto Sans CJK" and "Noto Sans"; Google Fonts serves Noto under a name per script instead (Noto Sans JP, Noto Sans TC, Noto Sans Devanagari, Noto Sans Thai), so this example loads those and puts their names in `--md1-font-family` for each language.[^google-noto] The labels under each line are marked `lang="en"` so assistive technology reads them in English.
:::

::: ds-example
/systems/md1/typography/dynamic

### Dynamic type

Large type for text whose length is unknown. The guidelines prefer dynamic type to truncation or a single small size: the size is chosen from the scale by the space available. Type digits into the calculator and the result steps down from Display 4 through Display 3, 2 and 1 to Headline as it grows, and only at Headline does it wrap.[^dynamic-stop]

Material Design 1 has no dynamic type component; this is a few lines in the example. It renders the largest style, measures whether the line overflows its box, and steps down until it fits, again whenever the value or the box's width changes. Keep the steps on the scale rather than computing an arbitrary size, so the result still reads as part of the type system.
:::

::: ds-example
/systems/md1/typography/breaks

### Line breaks

The guidelines ask for line breaks that avoid large gaps, orphans and a short word such as a preposition left at the end of a line, without hyphenation. On the web, `text-wrap: balance` evens out the lines of a heading and `text-wrap: pretty` keeps the last line of a paragraph from holding a single word. Turn the switch off to see the browser's default greedy breaks in the same 288 dp card.[^line-breaks]

Neither property is in the Material Design 1 classes, because balance and pretty cost layout time and suit headings and short passages rather than every block of text. Add them to your own headings and card copy where the breaks matter. Browsers that do not support them fall back to the default breaks.
:::

## Accessibility

The page sets a contrast floor of 4.5:1 for text, with 7:1 preferred. The style inks meet it on Material Design 1's light surfaces: 87% black on white measures about 16:1 and 54% black about 4.6:1. Keep secondary-tier styles, Caption and the display styles, off tinted backgrounds that would push them under 4.5:1.

Sizes are in px, the web reading of sp. The page's reason for sp is that a platform can scale type for readers who need it. Browser zoom scales px; a reader's default font size setting does not, because the tokens are px rather than rem. Button labels are capitalised by `text-transform`, so screen readers announce the sentence-case source text rather than spelling out capitals. Set `lang` on every passage in another language: the dense and tall rules depend on it, and so does the voice a screen reader picks.

[^tracking-v15]: Vuetify 1.5.24, stylus/settings/_variables.styl:99-100, 104. The `letter-spacing` of its Display 4, Display 3 and Title headings.

[^display-3-leading]: Vuetify 1.5.24, stylus/settings/_variables.styl:100. The 1.35 `line-height` on Display 3.

[^single-line]: Vuetify 1.5.24, stylus/settings/_variables.styl:99, 104. `line-height: 1` on Display 4 and Title; Caption, Button and Menu follow it by our call, as Vuetify sets no leading on them.

[^tracking-unit]: Our call: the page prints no unit, and Adobe's 1/1000 em is the unit its numbers fit.

[^menu-metrics]: Our call: the archived images omit Menu, so these metrics come from earlier revisions of the page as remembered, not read.

[^pointer-fine]: Our call: `(pointer: fine)` is the closest CSS test for "mouse and keyboard are the primary input".

[^noto-names]: Our call: "Noto Sans CJK" and "Noto Sans" are the family names platforms install Noto under; the page names only Noto.

[^menu-bold]: Our call: the page's tall-script table stops before Menu; Bold follows its rule for every other Medium style.

[^google-noto]: Our call: the docs load only Roboto, so the example pulls each Noto family from Google Fonts, which names them per script.

[^dynamic-stop]: Our call: the page says only that sizes come from the scale by the space available; stopping and wrapping at Headline is the example's choice.

[^line-breaks]: Our call: the page states the rule; the `text-wrap` mechanism and the 288 dp card are the example's.
