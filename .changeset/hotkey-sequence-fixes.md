---
"@vuetify/v0": patch
---

fix(useHotkey): make key sequences tolerate IME, modifiers, and key repeat

IME composition keydowns are ignored. A modifier press or a held key's auto-repeat no longer resets or advances a sequence, and a wrong key that matches the first step restarts the sequence instead of dropping it.
