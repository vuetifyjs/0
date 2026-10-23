# Widgets (MD1)

Spec page: `components/widgets.html`. Material Design 1 component: none. Ruling: **out of scope on the web** (see section 10).

## Sources

| Source | URL (snapshot) | Read |
|---|---|---|
| MD1 archived spec, Widgets | `https://web.archive.org/web/20181225002239/https://material.io/archive/guidelines/components/widgets.html` (requested `20181225002255`, archive resolved to `20181225002239`) | full text |
| Vuetify 1.5.24 | no stylus or component counterpart exists | n/a |

## Summary paragraph

Widgets are Android home-screen widgets: "Widgets display glanceable views of an app's most important data and functionality." They "display your app's new and interesting content in a consolidated form" and "link to richer detail within the app". Users "can move and, if supported, resize widgets across their home screen panels". The page is a usage and behavior guide for the Android launcher surface; it links to the Android developer documentation ("App widgets", "How to publish an app widget") for implementation, and it contains no visual metrics, colors, elevations, or motion values. Everything on the page presumes the Android launcher (home panels, long-press resize mode, drag handles, configuration dialogs shown on placement). None of that exists in a browser document, so Material Design 1 ships no `Md1Widget`; the ruling and the reason are recorded in section 10 and must be copied into `SPEC.md`'s coverage statement as a deliberate "out" item under DESIGN_SYSTEMS.md ruling 7.

## 1. Purpose and usage

| Rule | Spec text | Confidence |
|---|---|---|
| Purpose | "Widgets display glanceable views of an app's most important data and functionality." | high |
| Content | "Home screen widgets display your app's new and interesting content in a consolidated form. They link to richer detail within the app." | high |
| User control | "Users can move and, if supported, resize widgets across their home screen panels." | high |

## 2. Types and variants

| Type | Spec definition | Interaction | Confidence |
|---|---|---|---|
| Information widget | "display a few elements of importance to a user and track how that information changes over time, such as weather or sports scores" | "Tapping the widget launches the associated app into a detail view." | high |
| Collection widget | "display multiple elements of the same type, such as a collection of articles from a news app" | "Browsing a collection", "Opening an element's detail view"; "Collection widgets can scroll vertically." | high |
| Control widget | "display frequently used functions. These functions may be triggered from the home screen without opening the app" (music play / pause / skip example) | "Control widgets may or may not progress to a detail view." | high |
| Hybrid widget | "Many widgets are hybrids that combine elements of the different types above. Center your widget around one of these types and add elements of others as needed." | music player = control + information | high |

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Named parts | none; the page names no title, frame, or action area | not found |

## 4. Metrics and keylines

| Metric | Value | Confidence |
|---|---|---|
| Grid cells, padding, margins, text sizes | not found (the page has no spec section) | not found |
| Configuration elements | "don't present more than 2-3 configuration elements" | high |

## 5. Color

not found (no color guidance on the page).

## 6. Elevation

not found.

## 7. Motion

not found. The only motion-adjacent rule is behavioral: "A long press and subsequent release sets resizable widgets into resize mode."

## 8. States

| State | Spec text | Confidence |
|---|---|---|
| Resize mode | "A long press and subsequent release sets resizable widgets into resize mode. Users can use the drag handles or the widget corners to set the desired size." | high |
| Other states | not found | not found |

## 9. Behavior

| Rule | Spec text | Confidence |
|---|---|---|
| Navigation links | "Your widgets should provide navigation links to frequently used areas of your app, including: Functions that allow the user to create new content, such as a new document or message; Access to the top level of your app" | high |
| Resizing | "Resizing allows users to adjust the height or width of a widget." "Your app may be completely resizable or constrained to horizontal or vertical size changes." | high |
| Scrollable widgets | "List or grid-based collection widgets usually expand or contract the vertical scrolling area. Regardless of the widget's size, the user can still scroll all elements into view." "For smaller sizes concentrate on the essential and then add more contextual information as the widget grows." | high |
| Non-scrollable widgets | "Information widgets are not scrollable. All content and layout must dynamically fit as sized by the user." | high |
| Responsive resizing | "Widgets should accommodate different spacing requirements across devices, including cell number, size, and spacing variations." | high |
| Configuration | "Android widgets display their configuration choices once placed on a home panel." "Keep configuration light and don't present more than 2-3 configuration elements." "Present configuration choices using dialogs, rather than full-screen, to retain the user's context." "Once setup, widgets do not typically show a 'Setup' or 'Configuration' button." | high |

## 10. Web notes

- **Ruling: out of scope on the web.** The component is an Android launcher surface (home panels, resize mode via long press, placement-time configuration). A browser page has no host that places, resizes, or configures a widget, so there is nothing for Material Design 1 to render. Material Design 1 ships no `Md1Widget` and `SPEC.md` lists "Widgets" under deliberately-out coverage with this reason.
- Nothing maps 1:1; the page has no metrics, colors, or motion to port.
- Escape hatch (per DESIGN_SYSTEMS.md ruling 7): a consumer wanting a "glanceable summary card" composes `Md1Card` with their own layout; that composition is unsupported as a Material Design 1 component and must not be presented as the MD1 widget.
- WAI-ARIA pattern: none applies; there is no interactive web widget to implement.

## Vuetify 1.5 cross-check

Vuetify 1.5.24 has no widget component or stylus file. No discrepancies to list.
