---
'@vuetify/v0': patch
---
fix(createForm): submit no longer reports failure when a field validation was superseded by a newer concurrent call

A superseded validate() now resolves to the latest validation's outcome instead of false, so double-submits and concurrent field validation report the form's actual validity.
