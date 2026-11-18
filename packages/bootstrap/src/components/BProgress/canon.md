`div.progress` (`role="progressbar"`, `aria-valuemin` / `aria-valuemax` / `aria-valuenow`) wraps one `div.progress-bar`. The bar width is `createProgress({ min, max }).fromValue(value)` after that value is registered as the single segment. `aria-valuenow` is the model, not a second copy of the percent.

`striped` adds `progress-bar-striped`. `animated` adds `progress-bar-animated`. The label is the default slot inside the bar.

`div.progress-stacked` is in the pin. This component does not render it. Conform comparisons pass `ignoreAttrs: ['style']` because the width is an inline style.
