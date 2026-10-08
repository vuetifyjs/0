# @paper/bootstrap

Vue behavior for [Bootstrap 6](https://getbootstrap.com/)'s markup. Bootstrap ships the CSS; this package is the JavaScript — real Bootstrap 6 classes, driven by [Vuetify0](https://0.vuetifyjs.com).

Nothing about your stylesheet changes. There is no plugin, no `theme.css`, and no CSS in the package.

`BDialog` is implemented. The rest of the catalog lands against the commit in `harness/PIN.md`. Bootstrap 6 is not on npm yet.

## Install

```bash
pnpm add @paper/bootstrap
```

Bootstrap itself is an **optional** peer (`bootstrap@>=6.0.0-0`). Load it from npm once 6.x is published, or from the pinned commit:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/twbs/bootstrap@f6cc0f2cde9cbf3d73759ada24a39555d2de3a12/dist/css/bootstrap.min.css"
>
```

The package never imports it. Do not load `bootstrap.bundle.js`.
