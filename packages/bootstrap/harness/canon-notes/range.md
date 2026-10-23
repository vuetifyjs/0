# BRange

- Host is `div.form-range` > `input.form-range-input`. `min`, `max`, `step`, and the thumb come from `createSlider`. `v-model` is that number.
- `disabled` sets the native attribute and the slider's disabled flag.
- `--bs-range-fill` on the input is `(value - min) / (max - min)`, from 0 to 1. The pin's track reads it. Do not ship CSS for the fill.
- The pin's bubble is `data-bs-bubble` on `.form-range`. There is no bubble class and no bubble element. Do not render one. Do not emit `data-bs-bubble`.
- Do not build a tick-mark engine. A consumer `datalist` stays outside this component.
