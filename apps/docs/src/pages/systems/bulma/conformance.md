---
title: Conformance - Bulma markup this package matches
meta:
- name: description
  content: "@paper/bulma is diffed against markup published on bulma.io. Bulma 1.0 or newer. Deviations are declared, including aria added where the docs markup fails axe."
- name: keywords
  content: bulma conformance, bulma 1.0, bulma markup, vue bulma, paper bulma, accessibility
features:
  category: Guide
  label: 'Conformance'
  level: 2
  order: 0
related:
  - /systems/bulma
  - /systems/bulma/modal
  - /systems/bulma/number-field
---

# Conformance

<DocsPageFeatures :frontmatter />

Nothing about your stylesheet changes. There is no theme to adopt, no class prefix to learn, and no CSS in the package. The [component catalog](/systems/bulma#components) is the list. This page is what "matches Bulma" means.

> [!NOTE]
> Bulma **1.0+** only. The 0.9.x line predates Bulma's CSS variables and is explicitly unsupported. Latest verified: 1.0.4.

## What conformance means

Every component but the number field is diffed against markup [published on bulma.io](https://bulma.io/documentation/). The fixtures live beside the source in `packages/bulma/harness/fixtures/`. All but the number field are captured verbatim from the documentation. Bulma ships no number input, so that fixture is composed from the addons docs.[^composed] The conformance suite asserts that the rendered DOM matches element for element and class for class.

Where the two differ, the difference is deliberate and declared:

| Deviation | Why |
|-----------|-----|
| No owned token namespace | `--bulma-*` belongs to upstream; the package owns no prefix |
| Upstream state classes, unprefixed | `is-active` and `is-hoverable` instead of data-attribute hooks. Bulma's CSS selects on them |
| Native form controls | Bulma styles native `select`, `input[type=checkbox]` and friends; a non-native control gets none of your CSS |
| Added aria | `BuDropdown`'s `menu` prop opts `.dropdown-menu` into `role="menu"`; the component does not inspect the items[^dropdown-menu]. `BuNotificationDelete` labels its delete button |

Flat names such as `BuModalContent` stay exported. The dotted form (`BuModal.Content`) is the one to compose. Import the parent. The parts hang off it.

[^dropdown-menu]: Both additions fix axe failures in the verbatim documentation markup. The docs' arbitrary-content dropdown promises `role="menu"` without menu items, and its delete button ships unlabeled.

[^composed]: Bulma documents no number input. [BuNumberField](/systems/bulma/number-field) composes one out of the form parts it does document: attached controls, buttons, and an input. Its conformance fixture is self-authored rather than captured, and declares the upstream provenance of every class in it.
