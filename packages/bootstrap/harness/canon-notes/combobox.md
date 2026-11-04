# BCombobox

- Toggle is `button.form-control.combobox-toggle` (`type="button"`). It is not `BMenu`. `BMenu` owns a `button.btn-solid` trigger.
- Inside it: `span.combobox-value` and the pin caret `svg.combobox-caret`. No other caret.
- Panel is `div.menu`. `.show` is the open state. `data-bs-placement="bottom-start"` is the transform-origin hook. No native `popover` attribute. `showPopover` is a no-op, same as `BMenu`. Position area is BMenu's bottom-start value, `block-end span-inline-end`.
- Items are `button.menu-item`. The selected item adds `.selected` and `aria-selected="true"`. `BMenuItem` is not reused. It injects menu context.
- `v-model` is the selected value. Open state is internal. An empty item list still opens.
- Options are onboarded into `createCombobox`. The menu renders `filtered`. Its popover is not attached.
- `name` renders `input[type=hidden]`. Do not emit `data-bs-toggle` or `data-bs-value`.
- Fixture diff ignores `style`.
