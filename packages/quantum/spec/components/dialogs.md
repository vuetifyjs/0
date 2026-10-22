# Dialogs (Material Design 1)

Spec note for `QuDialog` (alert, simple, confirmation and full-screen dialogs, with side-by-side and stacked actions). Pins the archived MD1 "Dialogs" page so implementers never guess.

Confidence tags: `high` = stated on the spec page or a companion spec page (text or a labelled figure); `moderate` = from Vuetify 1.5 stylus only; `low` = read off an unlabelled figure or from memory. `not found` means the spec does not state it.

## Sources

- Spec page (authoritative): `http://web.archive.org/web/20181225002200/https://material.io/archive/guidelines/components/dialogs.html` (Wayback snapshot 2018-12-25 00:22:00 of the MD1 archive; full text read).
- Same page on Google's live MD1 mirror: `https://m1.material.io/components/dialogs.html` (read 2026-10-22; text identical to the snapshot line for line; figures served from `https://storage.googleapis.com/material-io-design/m1/assets/<id>/<name>.png`).
- Earlier revisions, read for drift: `http://web.archive.org/web/20160530205032/http://www.google.com/design/spec/components/dialogs.html` (2016-05-30; one difference: the simple dialog section states "The width of a dialog on mobile is defined as a multiple of a unit. Each unit is 56dp wide. Minimum width on mobile = 56dp * 5 = 280dp", which the 2018 text replaced with "a multiple of a unit. That unit can be either: an increment; a specific distance from the screen edge" plus a figure labelled "x = 56dp, width = 5x") and `http://web.archive.org/web/20180119194023/https://material.io/guidelines/components/dialogs.html` (2018-01-19, identical to the archive).
- Figures read from the page: components-dialogs-updates1 (content padding), -actions, -updates8 (scrolled state), -updates2 (button widths), -updates3 (button area), -consistent-placement3 (stroke), -sidebyside, -stacked, -updates5 (simple dialog keylines), -simple-redlines, -updates10 (full-screen app bar), -updates11, -updates12, -usage2, -simple2 (width unit), -dialogs-1 (pinned title).
- Companion spec pages (m1.material.io): `style/typography.html`, `style/color.html`, `material-design/elevation-shadows.html`, `motion/duration-easing.html`, `layout/metrics-keylines.html`, `components/buttons.html` (Flat buttons specs, "Flat buttons in dialogs"), `components/lists.html`, `components/menus.html`, `components/bottom-sheets.html` (Specs: "Transparent overlay fill"), `patterns/navigation-drawer.html` (Elevation: scrim sentence), `components/dividers.html`.
- Vuetify 1.5.24: `src/stylus/components/_dialogs.styl`, `_overlay.styl`, `_cards.styl`, `_buttons.styl`, `_lists.styl`, `_toolbar.styl` (not read beyond `$toolbar-height`), `src/stylus/generic/_transitions.styl`, `src/stylus/settings/_variables.styl`, `_theme.styl`, `_elevations.styl`; behavior from `src/components/VDialog/VDialog.js`, `src/mixins/overlayable.ts`.

## 1. Purpose and usage

- Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks. They contain text and UI controls, retain focus until dismissed or a required action has been taken, and are interruptive, so they are used sparingly.
- Scope: standard material system dialogs. Other modal windows (branded purchase flows, non-standard form elements, unique layouts) are out of scope.
- Reduce interruption: not every choice, setting or detail warrants a dialog; menus and inline expansion keep the current context.
- Prominence: dialogs are never obscured by other elements or the screen edge and never appear partially on screen.
- Dialogs avoid opening dialogs from within a dialog and avoid scrolling content. Exceptions: full-screen dialogs may open additional dialogs such as pickers; some content such as a list of ringtones must scroll.
- Additional content is disclosed with inline expansion inside the content area, or a different component is used.
- Alerts versus snackbars: snackbars present optional information after an action and often allow undo; alerts are urgent interruptions that require acknowledgement.
- Simple menus are preferred over simple dialogs because they are less disruptive; if any simple-menu text wraps, use a simple dialog.
- Full-screen dialogs are mobile only and suit complex tasks: components that need an input method editor, changes not saved in real time, no draft capability, batch operations or queued changes.

## 2. Types and variants

| Type | Platform | Title | Content | Actions | Dismissal | Confidence |
|---|---|---|---|---|---|---|
| Alert without title bar | all | none (most alerts) | one or two sentences: a question ("Delete this conversation?") or a statement related to the actions | two: dismissive left, affirmative right; acknowledgement alerts may carry one action, used sparingly | tap outside or Back, unless dismissal is disabled | high |
| Alert with title bar | all | high-risk situations only; a clear question or statement ("Erase USB storage?"); never "Warning!" or "Are you sure?" | explanation of impact | two | same | high |
| Simple dialog | all; on mobile and tablet a simple menu is preferred | recommended, may be omitted | list items with avatars, icons, clarifying subtext or orthogonal actions ("add account"); row heights may vary | none: no explicit accept or cancel buttons | choosing an option commits it and closes; tapping outside or Back cancels and closes | high |
| Confirmation dialog | all | typical ("Phone Ringtone") | list with selection controls (radio buttons), or a single-value picker (date, time); confirms one value only | explicit confirm (OK) and cancel buttons | Cancel, Back or leaving discards changes | high |
| Full-screen dialog | mobile only | in the app bar (20sp), one or two lines; long or variable-length titles move into the content area | complex layouts; may launch simple menus, simple dialogs and pickers | app bar: discard "X" at the top left; confirmation verb at the top right (save, send, share, update, create; never done, ok or close) | X or Back discards; a discard confirmation is prompted when changes were made; nothing is saved until the verb is tapped | high |

Action layouts: side-by-side (default) when each label fits the maximum button width; stacked full-width buttons when a label exceeds it, affirmative stacked above dismissive.

## 3. Anatomy

| Part | Notes | Confidence |
|---|---|---|
| Container | a sheet at 24dp elevation; mobile width in 56dp units | high |
| Title (optional) | Title style, one line; always displayed in its entirety | high |
| Content | text and or UI controls (lists, selection controls, pickers); 24dp keylines; icon or avatar content aligns at 80dp | high |
| Actions | 52dp area of flat buttons; affirmative at the right, dismissive directly to its left | high |
| Stroke | a divider between content and actions in the scrolled state; it sits within the button area (figure) | high |
| Scrim | the background is dimmed in every figure; opacity not found | low |
| Full-screen app bar | X at 16dp from the left edge, title at the 72dp keyline, verb action with 16dp side padding | high |

## 4. Metrics and keylines

| Element | Value | Confidence | Source and notes |
|---|---|---|---|
| Padding around the content area | 24dp | high | text |
| Title top padding | 24dp | high | simple dialog content guidelines; figures |
| Padding between title and body text (title bottom padding) | 20dp | high | text |
| Title line height | 28dp | high | text |
| Content bottom padding (separates content from actions) | 24dp | high | text |
| Button height | 36dp | high | text |
| Action area height | 52dp (8dp + 36dp + 8dp) | high | text and figures |
| Padding around buttons | 8dp | high | text |
| Padding between buttons | 8dp | high | text |
| Minimum button width in a dialog | 64dp (the general flat-button minimum on the buttons page is 88dp) | high | text |
| Internal button padding | 8dp | high | text |
| Left button padding | 24dp | high | text; the figure does not label it |
| Right button padding | 8dp | high | text |
| Maximum button width | (dialog width - 8dp - 8dp - 8dp) / 2; a 280dp dialog gives 128dp | high | text |
| Stacked buttons: touch target height | 48dp per button | high | text and figure |
| Stacked buttons: content text to first touch target | 24dp | high | text |
| Stacked buttons: last touch target to dialog edge | 8dp | high | text |
| Stacked buttons: button text right edge to dialog edge | 16dp | high | text |
| Distance from the screen edge | at least 40dp left and right; at least 24dp top and bottom | high | simple dialog specifications |
| Width unit on mobile | 56dp; minimum width 5 units = 280dp | high | 2016 text; 2018 figure "x = 56dp, width = 5x" |
| Tablet and desktop widths; maximum width | not found | | |
| Corner radius | not found | | |
| Simple dialog keylines | 24dp from the left and right edges; content associated with an icon or avatar aligns 80dp from the left edge | high | text |
| Simple dialog row height, single-line list with avatars | 56dp | high | text |
| Simple dialog bottom edge padding | 8dp | high | text |
| Avatar | 40dp | high | keylines page |
| Full-screen app bar height | 56dp with one line of title; 80dp with two lines | high | text |
| Full-screen title keyline | 72dp | high | text |
| Full-screen title text | 20sp; 20dp top and bottom padding | high | text |
| Full-screen dismissive action (X) padding from the left edge | 16dp | high | text |
| Full-screen affirmative action text | 14sp; 16dp padding left and right | high | text |
| Touch targets | 48dp minimum | high | keylines page |
| Dialog elevation | 24dp | high | text |

Type styles:

| Text element | Spec | Type style | Confidence |
|---|---|---|---|
| Title | Roboto Medium 20sp, 28dp line height | Title | high |
| Content text | size not found on the page; figures show body copy in secondary grey | not determinable (Body 1 14sp or Subheading 16sp); Vuetify inherits 14px | not found |
| List rows inside simple and confirmation dialogs | 16sp Regular, 48dp rows, 56dp with avatars (lists page) | Subheading | high |
| Actions | Medium 14sp, all caps (buttons page) | Button | high |
| Full-screen app bar title | 20sp | Title | high |
| Full-screen affirmative action | 14sp | Button | high |

## 5. Color

| Part | Light theme | Dark theme | Confidence |
|---|---|---|---|
| Surface | "Cards/Dialogs" White #FFFFFF (color page theme figure) | Grey 800 #424242 | high |
| Title | 87% black (color page primary text; figures consistent) | 100% white | high (rule); low (that the title uses it) |
| Content text | figures show secondary grey; 54% black is the color page secondary text | 70% white | low |
| Actions | system colors by default; should reflect the product palette; a contrasting color such as the accent color distinguishes actions from content | same | high |
| Disabled affirmative action | 26% #000000 (flat disabled text, buttons page) | 30% #FFFFFF | high |
| Pressed action | 40% #999999 | 25% #CCCCCC | high |
| Focused action | 12% overlay ("Flat buttons with 12% opacity on focus") | 12% | high |
| Stroke in the scrolled state | 12% black (dividers page) | 12% white | high |
| Scrim | not found on this page. Adjacent evidence: bottom sheets "Transparent overlay fill: #000 20%"; navigation drawer "darkened by a scrim" with no value | not found | not found |
| Selection controls inside confirmation dialogs | accent color in the figures | not found | low |
| Full-screen app bar | primary color with white title and icons in the figures | not found | low |

## 6. Elevation

| Surface | Value | Confidence | Source |
|---|---|---|---|
| Dialog | 24dp | high | page; elevation page ("Dialog, Picker: 24dp") |
| Picker dialogs | 24dp | high | elevation page |
| Desktop | resting elevations are 2dp below the listed values (general rule) | high (rule); low (application to dialogs) | elevation page |
| Full-screen dialog | "temporarily reset the app's perceived elevation to a higher baseline"; numeric value not found; its app bar is an App Bar (4dp) | high (sentence); low (4dp) | page; elevation page |
| Dialog above a dialog | avoided; full-screen dialogs may host pickers | high | page |

## 7. Motion

| Transition | Spec | Confidence |
|---|---|---|
| Open and close transition | not found on the page | |
| Durations | elements entering the screen 225ms, leaving 195ms, mobile baseline 300ms, large full-screen transitions 375ms, tablet about 30% longer, desktop 150ms to 200ms (duration page) | high |
| Easing | deceleration `cubic-bezier(0.0, 0.0, 0.2, 1)` for entering elements, which may fade in and slightly shrink from a larger size; acceleration `cubic-bezier(0.4, 0.0, 1, 1)` for leaving; standard `cubic-bezier(0.4, 0.0, 0.2, 1)` for in-place changes (duration page) | high |
| Scrim fade | not found | |
| Vuetify 1.5 | `dialog-transition`: scale(0.5) and opacity 0 to scale(1) and opacity 1 over `.3s cubic-bezier(.25, .8, .25, 1)`, transform origin center; overlay to opacity .46 over `.3s cubic-bezier(.25, .8, .5, 1)` after a 150ms delay; persistent dialogs pulse to scale 1.03 and back over 150ms on an outside click | moderate |

## 8. States

| State | Rendering | Confidence |
|---|---|---|
| Open | retains focus until dismissed or a required action is taken | high |
| Scrolled content | a stroke delineates content from actions; the title stays pinned for scrollable option lists, otherwise scrolls off with the content; actions stay in place | high |
| Affirmative action disabled | until a choice is made (confirmation) or all mandatory fields are met (full-screen); disabled text 26% black, 30% white | high |
| Dismissive action | never disabled | high |
| Action hover | not found on the page; Vuetify uses the 12% overlay for hover, focus and active | not found; moderate |
| Action focus | 12% overlay (buttons page) | high |
| Action pressed | flat buttons fill with color on press: 40% #999999 light, 25% #CCCCCC dark | high |
| Dismissal disabled (persistent) | the user must choose one of the actions | high |
| Full-screen title overflow | wraps to a second line, then truncates; no dynamic type | high |
| Error | not found | |

## 9. Behavior

- Dismissal: tap outside the dialog or press the system Back button (Android); the ability to dismiss may be disabled so that an action must be chosen. Confirmation dialogs: Cancel, Back or leaving the dialog discards changes. Simple dialogs: choosing an option commits it immediately and closes the dialog; outside or Back cancels. Full-screen dialogs: X and Back close and discard; when changes were made the user is prompted to confirm the discard; nothing is saved until the confirmation verb; the verb is disabled until mandatory fields are met.
- Number of actions: at most two. A third action such as "Learn more" navigates away and is prohibited; use inline expansion or provide the information before the dialog. Acknowledgement alerts may have exactly one action, used sparingly.
- Order (LTR): affirmative on the right, dismissive directly to its left; stacked layout: affirmative above dismissive. Affirmative actions may be destructive ("Delete", "Remove"). Labels are "Cancel" and "OK" or specific verbs that indicate the outcome; a dismissive label must not merely answer the question ("No").
- Scrolling: avoid scrolling content. When a list must scroll, pin the title so the title and the selected item stay visible together; actions always remain in place; dialogs are separate from the parent material and do not scroll with it.
- Nesting: dialogs do not open dialogs; confirmation dialogs do not launch simple dialogs or simple menus (use a full-screen dialog instead); full-screen dialogs may open simple dialogs, simple menus and pickers.
- Titles: displayed in their entirety and only when necessary; full-screen titles wrap to two lines then truncate; long or variable-length titles go into the content area.
- Full-screen navigation: X means discard; an up arrow means changes are saved continuously (Settings pattern); the two are not interchangeable.
- Languages without capitalization: keep action placement, spacing and color consistent so actions remain distinguishable from text.
- Mobile width: a multiple of the 56dp unit, minimum five units, or a fixed distance from the screen edge (2018 wording).

## 10. Web notes

- Maps 1:1: all paddings, the 36px button and 52px action area, the 24dp elevation shadow, the 280px minimum width, 40px and 24px screen margins, 48px stacked targets.
- Needs interpretation: "system Back" has no web equivalent beyond the Escape key (treat Escape as the dismissive gesture; binding browser history is optional); "tap outside" is a scrim click; full-screen dialogs are a mobile-breakpoint presentation because the page says mobile only; desktop widths are unspecified (56dp increments such as 280px, 336px, 392px, 448px, 504px and 560px are consistent with the unit rule); maximum height is the viewport minus two 24dp margins (derived); scrim color and opacity are unspecified (Vuetify uses #212121 at 46%; the only numeric MD1 overlay is the bottom-sheet 20% #000); content text size is unspecified (Vuetify inherits 14px); the stacked layout needs runtime label measurement against (W - 24dp) / 2 or an explicit prop; the stroke between content and actions appears only while the content scrolls; the pinned-title exception needs a sticky title inside the scroll region.
- WAI-ARIA: APG "Dialog (Modal)" pattern for all four types (role dialog, aria-modal, aria-labelledby the title or aria-label, initial focus inside, focus kept inside, Escape closes unless persistent, focus returns to the invoker); APG "Alert Dialog" (role alertdialog, aria-describedby the content) for alerts; a simple dialog's list is a list of buttons that commit on activation; a confirmation list is an APG "Radio Group" inside the dialog; the full-screen app bar is an APG "Toolbar".
- v0 primitives: Dialog.Root for all types, Button.Root for actions, Radio and Checkbox for confirmation controls.

## Vuetify 1.5 cross-check

| Item | Spec | Vuetify 1.5.24 | File | Verdict |
|---|---|---|---|---|
| Elevation | 24dp | `.v-dialog elevation(24)` | `_dialogs.styl` | match |
| Corner radius | not found | `border-radius: $card-border-radius` (2px) | `_dialogs.styl`, `_variables.styl` | spec silent |
| Distance from the screen edge | at least 40dp sides, 24dp top and bottom (mobile) | `.v-dialog margin: 24px` on all sides | `_dialogs.styl` | differs (sides) |
| Maximum height | not found | `max-height: 90%` when not fullscreen | `_dialogs.styl` | spec silent |
| Width | 56dp unit; 280dp minimum on mobile | `width: auto`, `max-width: none`; consumer sets `width` or `max-width` props | `VDialog.js` | not enforced |
| Content padding | 24dp around the content area | `.v-card__text padding: 16px`; `.v-card__title padding: 16px` (`--primary` adds `padding-top: 24px`) | `_cards.styl` | differs |
| Title to body text | 20dp | title bottom 16px plus text top 16px = 32px | `_cards.styl` | differs |
| Title type | Medium 20sp, 28dp line height | no dialog title style; `$headings.h6` is 20px/500 with line-height 1 | `_variables.styl` | differs |
| Actions area | 52dp; 8dp padding; 36dp buttons; 8dp between buttons; 64dp minimum width | `.v-card__actions padding: 8px`; `.v-btn height: 36px`; `.v-btn + .v-btn margin-left: 8px`; `min-width: 88px` | `_cards.styl`, `_variables.styl` | match except minimum width (88px versus 64dp) |
| Action type and colors | Button 14sp Medium caps; disabled 26% black, 30% white; focus 12%; pressed 40% #999999, 25% #CCCCCC | `.v-btn` 14px/500 uppercase; disabled `rgba(0,0,0,.26)`, dark `rgba(255,255,255,.3)`; `:before` overlay `opacity: .12` on hover, focus and active; tokens `pressed: rgba(#999, .4)`, dark `rgba(#ccc, .25)` | `_buttons.styl`, `_theme.styl` | match (hover overlay is an addition) |
| Stacked buttons | 48dp targets, 24dp above, 8dp below, 16dp right text padding | not implemented | | n/a |
| Scrolled state | title pinned (lists) or scrolls; actions fixed; stroke | `--scrollable`: `.v-card__title` and `.v-card__actions flex: 1 0 auto`, `.v-card__text overflow-y: auto`; stroke not automatic | `_dialogs.styl` | partial |
| Dismissal | outside tap, Back; may be disabled | click outside closes; Esc closes; `persistent` disables both and pulses the dialog | `VDialog.js` | match (Esc is an addition) |
| Focus | retains focus | content `tabIndex="-1"` receives focus on open; focus returns to the activator on Esc; no focus trap | `VDialog.js` | partial |
| Scrim | not found | `.v-overlay:before background-color: rgba(33, 33, 33, 1)` at `opacity: .46`; `.3s` with a 150ms delay | `_overlay.styl`, `overlayable.ts` | spec silent |
| Open transition | not found; 225ms and 195ms mobile, 150ms to 200ms desktop (companion) | scale 0.5 and fade over 300ms `cubic-bezier(.25, .8, .25, 1)` | `_transitions.styl`, `_dialogs.styl` | spec silent; slower than the desktop guidance |
| Full-screen | app bar 56dp or 80dp; X 16dp; title keyline 72dp; verb 14sp | `--fullscreen`: radius 0, margin 0, 100% height, fixed; app bar not included (`v-toolbar`, `$toolbar-height := 56px`) | `_dialogs.styl`, `_variables.styl` | partial |
| Simple dialog list | 56dp avatar rows; 80dp content keyline | `v-list` avatar tile 56px; text keyline 72px | `_lists.styl`, `_variables.styl` | differs (72px versus 80dp) |
| Maximum two actions | at most two | not enforced | | n/a |
| Click pulse on persistent dialogs | not found | `animate-dialog` scale 1.03 over 150ms | `_dialogs.styl` | Vuetify addition |
| Dark surface | #424242 | `$material-dark.cards` grey darken-3 #424242 | `_theme.styl` | match |
