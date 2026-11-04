# BOtp

- Root is `Otp.Root` with class `otp`. Each box is `Otp.Item` with class `otp-input`. The pin's single `input.otp-input[maxlength=N]` is the plugin's source node. This component renders the boxes. It does not emit `data-bs-otp`.
- `otp-connected`, `otp-sm`, and `otp-lg` go on the root. `state` adds `is-valid` or `is-invalid`. An omitted prop adds nothing.
- `v-model` is the joined string. `length` defaults to 6. `pattern` is passed through. `name` is `Otp.Root`'s hidden input.
- Each box is `input.otp-input.otp-slot.pe-auto` inside `div.otp-slots`. The slot class is what the pin sizes, joins, and paints. `.otp-slots` sets `pointer-events: none` for the plugin's decorative slots; `pe-auto` puts the hit target back on these inputs. `otp-rendered` is not added: that rule hides `.otp-input`. These boxes are the inputs, not decorative slots over one hidden field. `maxlength` is omitted so a pasted code is not truncated before it spreads. The input value ignores the slot's flex centering, so each box sets an inline style: `text-align: center` and the leftover slot height split above and below a line of `--bs-otp-font-size`. Conform ignores that `style` attribute.
- Group separators (`data-bs-groups`) and masking are not props.
