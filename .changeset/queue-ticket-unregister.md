---
'@vuetify/v0': patch
---

fix(createQueue): ticket.unregister() clears its timer and advances the queue

Calling `unregister()` on a queue ticket now matches `dismiss()` and `queue.unregister(id)`: the ticket's timeout is cleared and the next ticket starts its countdown immediately instead of waiting for the removed ticket's timer to fire.
