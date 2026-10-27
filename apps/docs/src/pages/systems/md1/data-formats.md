---
title: Data Formats - Material Design 1 Data Formats Pattern for Vue
meta:
- name: description
  content: The Material Design 1 data formats pattern. Times, dates, ranges, approximate and absolute time, durations, and redacting card numbers and truncating email addresses.
- name: keywords
  content: md1 data formats, material design 1 date format, time range, relative time, redaction, truncation, midline ellipsis, vue date formatting, paper md1
features:
  category: Guide
  label: 'Data formats'
  level: 2
  renderless: false
  group: 'patterns'
  order: 8
related:
  - /systems/md1
  - /systems/md1/list
  - /composables/plugins/use-locale
  - /composables/plugins/use-date
---

# Data formats

<DocsPageFeatures :frontmatter />

How dates, times and sensitive numbers appear in text: what to show, what to round, and what to hide. Material Design 1 ships no formatter; the rules are applied with the browser's `Intl` formatters in the reader's locale, which v0's [useLocale](/composables/plugins/use-locale) and [useDate](/composables/plugins/use-date) hold for the app.

<DocsMd1Reference
  href="https://m1.material.io/patterns/data-formats.html"
  title="Data formats"
/>

## Usage

::: ds-example
/systems/md1/data-formats/dates
:::

Each row applies one of the guideline's rules to a fixed moment, so the output never drifts.[^no-time-zones] Turn on the 24-hour clock to drop AM and PM everywhere.

| Rule | Example |
|------|---------|
| Time within the current day: uppercase AM or PM without periods; no marker on the 24-hour clock | 2:00 PM, 14:00 |
| The year only outside the current year | January 14; January 14, 2012 |
| Approximate time rounds down to the largest unit that has passed | In 5 minutes, 3 days ago |
| Ranges take an en dash without spaces, with spaces once months are spelled out on both sides | 8:00 AM–12:30 PM, Jan 6 – Feb 2 |
| One AM or PM at the end of a range when both ends share it | 8:00–10:30 AM |
| The year on both ends of a range unless both share it | Dec 6, 2013–Jan 2, 2014; January 4–6, 2014 |
| Durations as H:MM:SS, without the hours when there are none | 0:30, 1:01:05 |
| Rounded times drop ":00" | 8 AM |

The guideline's patterns are English; the example takes its month and weekday names, its period markers and its relative phrases from `Intl` in the locale `useLocale` has selected, and applies the guideline's assembly rules on top.[^intl-parts] A locale that writes the day before the month, or uses lowercase period markers, keeps its own order and case for those parts.

## Examples

::: ds-example
/systems/md1/data-formats/redaction

### Redaction and truncation

Midline ellipses stand in for hidden digits. Card numbers take four, everything else three, written as the guideline's Unicode string: two spaces, then each midline ellipsis (U+2022) followed by a six-per-em space (U+2006), then the visible digits.

Baseline ellipses stand in for letters that are not shown. The PayPal address is cut by its column: `text-overflow: ellipsis` ends it in a single ellipsis character (U+2026) after the last letter that fits, so the truncation follows the width rather than a fixed length.
:::

## Accessibility

Screen readers read midline ellipses as bullets, one by one. The example hides the bullets from assistive technology and adds visually hidden text, "ending in 1234", after them. A truncated address is still whole in the DOM, so a screen reader reads it in full; give it a `title` only if sighted mouse users also need the full value. Relative times such as "3 days ago" age while the page is open, so refresh them on a timer, and put the absolute date in a `<time datetime>` element or an `aria-label` when the exact moment matters.

[^no-time-zones]: Our call: the example omits the time zone rules, because `Intl`'s short offsets (GMT+5) do not match the guidelines' UTC+5:00 and ET forms.

[^intl-parts]: Our call: the guidelines' patterns are English only, so locale names and markers come from `Intl` while the assembly rules stay the guidelines'.
