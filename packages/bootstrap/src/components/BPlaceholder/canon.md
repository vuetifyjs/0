The component is `span.placeholder`. A column class such as `col-6` is passed by the consumer. It is not a width prop. A `bg-*` class replaces `currentColor`.

The pin puts `placeholder-wave` and `placeholder-pulse` on the parent. `placeholder-glow` is an alias of pulse. Those classes are not applied to the span. `placeholder-xs`, `placeholder-sm`, and `placeholder-lg` are on the span, via `size`.

There is no wrapper. Animation markup in examples is the parent's class. `aria-hidden` sits on the loading region (the parent, or the card), not on the span. A button skeleton is an anchor with `placeholder` on it, not this span.
