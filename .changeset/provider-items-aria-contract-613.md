---
"@vuetify/v0": patch
---

fix(Group,Selection,Single,Step): complete the provider Item ARIA contract (#613)

`aria-selected` is only valid on roles like `option` and `tab`, so the state the provider Items emitted was ignored by assistive technology. SelectionItem and SingleItem now emit `role="option"`, StepItem emits `role="tab"`, and all four Item families (including GroupItem's existing `role="checkbox"`) ship `tabindex` plus Enter/Space (Space for checkbox) keyboard activation so the bound element is operable without consumer completion.
