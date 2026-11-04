# BScrollSpy

Matches the pinned scrollspy examples, with these deltas:

- No `data-bs-spy` and no `data-bs-target`. Sections register with `useIntersectionObserver`.
- Links and sections pair by `id` through `register({ id, el })`. An `a` or `button` is the link; any other element is the section.
- The link for the section with the greatest intersection ratio gets `.active`.
- The scroll container is the `root` prop, or this component's element. It is not the viewport unless that element is the viewport.
- `smooth` defaults to false. `true` calls `element.scrollIntoView({ behavior: 'smooth' })` on the section. The pin's `data-bs-smooth-scroll` is not emitted.
- The component does not render `nav` or `list-group`. Those classes stay on the consumer's markup. Links are `a.nav-link`.
