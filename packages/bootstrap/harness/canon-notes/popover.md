# popover

Rendered root is `div.popover.bs-popover-auto` with `role="tooltip"` and `data-bs-placement`. `.show` is the open state. `.popover-instant` skips the fade.

The arrow is `div.popover-arrow`. `h3.popover-header` renders only when `title` is non-empty. `div.popover-body` renders only when `text` is non-empty or the content slot is set. If title and text are both empty and there is no content slot, `.show` is not added.

Default trigger is click, not hover. Click toggles. Escape closes on capture. The gap is a `0.4rem` margin on the popover's side.

The component never sets the native `popover` attribute, `data-bs-toggle`, `data-bs-title`, or `data-bs-content`. `showPopover` is a no-op before attach, same as the tooltip, so the element stays in normal flow.

Placement is the same 12 tokens as the tooltip, duplicated in this file rather than imported. Positioning is usePopover anchor positioning.
