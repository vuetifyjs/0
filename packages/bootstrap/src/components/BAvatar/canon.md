BAvatar was in the pinned catalog and missing from the SPEC bullet list.

`span.avatar` wraps `img.avatar-img` when `src` is set. Otherwise the default slot is the initials. `status` adds `span.avatar-status` plus `status-online`, `status-away`, `status-busy`, or `status-offline`, with `role="img"`. The name is `locale.ti('Avatar.status.online'|'away'|'busy'|'offline')`, or Online, Away, Busy, Offline. `subtle` adds `avatar-subtle`. Sizes in the pin are `avatar-xs`, `avatar-sm`, `avatar-lg`, and `avatar-xl`.

`.avatar-stack` is in the pin's class list, but no example renders that wrapper, so there is no stack part and no `stack` prop. A bare `img.avatar-img` (no span) also appears in the pin; this component always renders the span. Theme classes (`theme-primary` and the rest) stay on the consumer.
