---
title: Conformance - Bulma markup this package matches
meta:
- name: description
  content: "@paper/bulma diffs its markup against pages on bulma.io. It targets Bulma 1.0 or newer and declares every deviation, including aria it adds where the docs markup fails axe."
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

Your stylesheet does not change. The package adds no theme, no class prefix, and no CSS. The [component catalog](/systems/bulma#components) lists the components. This page defines what "matches Bulma" means.

> [!NOTE]
> Bulma **1.0+** only. The 0.9.x line predates Bulma's CSS variables, and this package does not support it. Latest verified: 1.0.4.

## What conformance means

The suite diffs every component but the number field against markup [bulma.io publishes](https://bulma.io/documentation/). The fixtures live beside the source in `packages/bulma/harness/fixtures/`. The harness captures every fixture but the number field verbatim from the documentation. Bulma ships no number input, so the harness composes that fixture from the addons docs.[^composed] The conformance suite asserts that the rendered DOM matches element for element and class for class.

Where the rendered DOM and the docs differ, the package declares the difference on purpose:

| Deviation | Why |
|-----------|-----|
| No owned token namespace | `--bulma-*` belongs to upstream; the package owns no prefix |
| Upstream state classes, unprefixed | `is-active` and `is-hoverable` instead of data-attribute hooks. Bulma's CSS selects on them |
| Native form controls | Bulma styles native `select`, `input[type=checkbox]` and friends; a non-native control gets none of your CSS |
| Added aria | `BuDropdown`'s `menu` prop opts `.dropdown-menu` into `role="menu"`; the component does not inspect the items[^dropdown-menu]. `BuNotificationDelete` labels its delete button |

The package still exports flat names such as `BuModalContent`. Compose with the dotted form (`BuModal.Content`). Import the parent. The parts hang off it.

[^dropdown-menu]: Both additions fix axe failures in the verbatim documentation markup. The docs' arbitrary-content dropdown promises `role="menu"` without menu items, and its delete button ships unlabeled.

[^composed]: Bulma documents no number input. [BuNumberField](/systems/bulma/number-field) composes one out of the form parts Bulma does document: attached controls, buttons, and an input. The harness writes that fixture itself instead of capturing it, and the fixture declares the upstream provenance of every class in it.
