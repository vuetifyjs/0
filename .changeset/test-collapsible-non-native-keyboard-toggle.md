---
"@vuetify/v0": patch
---

test(Collapsible): cover keyboard toggle for non-native activator elements (#641)

`CollapsibleActivator` already handles Enter/Space and sets `role="button"` for non-native `as` elements, but no test asserted that a non-native activator actually toggles the collapsible on Enter/Space. Adds two tests covering that gap.
