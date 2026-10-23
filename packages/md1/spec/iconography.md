# Material Design 1 iconography, imagery, and writing

Pinned spec for the `@paper/md1` icon system (`Md1Icon` and every component that places a glyph), plus the imagery and writing rules that constrain component APIs and default copy. Values are copied from the archived guidelines; Vuetify 1.5.24 is the cross-check and the spec wins where they differ.

Units: `dp` is `px` at 1:1 on the web (family convention).

## Sources

Fetched 2026-10-22 with `curl`; HTML stripped to text. The icon tables on these pages are real HTML tables, so no images were needed.

| Source | URL | Copy read |
|---|---|---|
| Icons page | https://m1.material.io/style/icons.html | 2018-12-25 00:22:55 |
| Imagery page | https://m1.material.io/style/imagery.html | 2018-12-25 00:22:55 |
| Writing page | https://m1.material.io/style/writing.html (the 2018-12-25 URL redirects here; the 2018-02-23 and 2016 fallbacks did not respond) | 2019-08-03 03:31:54 |
| Color page, "Icons and other elements" (cross-reference) | https://m1.material.io/style/color.html | 2018-12-25 00:21:49 |
| Vuetify 1.5.24 | `/home/john/sites/vuetify1/packages/vuetify/src/stylus/components/_icons.styl`, `settings/_theme.styl`, `settings/_variables.styl`, `components/_buttons.styl`, `_lists.styl`, `_chips.styl`, `_steppers.styl`, `_data-table.styl`, `_breadcrumbs.styl`, `_alerts.styl`, `_pagination.styl` | local checkout |

Confidence legend: `high` = read from the spec page; `moderate` = Vuetify 1.5 stylus only; `low` = memory.

## Sizing summary

| Icon class | Size | Confidence |
|---|---|---|
| Product icons | 48dp | high |
| System icons | 24dp | high |
| System icons, dense desktop layouts | 20dp | high |

## System icons

"A system icon, or UI icon, symbolizes a command, file, device, or directory. System icons are also used to represent common actions like trash, print, and save." Design principles: simple, intuitive, actionable, consistent; shapes are bold, geometric, symmetric.

### Grid and content area

| Metric | Standard (24dp) | Dense (20dp) | Confidence |
|---|---|---|---|
| Trim area (final file size) | 24 x 24dp | 20 x 20dp | high |
| Live area (content limit) | 20 x 20dp | 16 x 16dp | high |
| Padding between live and trim | 4dp on every side | 2dp on every side | high |
| Design scale | design at 100% for pixel accuracy; shown at 800% for inspection | same | high |
| When to use dense | mouse and keyboard are the primary input; "icons can be scaled down to 20dp" | | high |

Content may extend into the padding only when extra visual weight is needed; nothing may extend outside the trim area. (high)

### Keyline shapes (system icon grid)

| Shape | Height | Width | Confidence |
|---|---|---|---|
| Square | 18dp | 18dp | high |
| Circle | 20dp diameter | | high |
| Vertical rectangle | 20dp | 16dp | high |
| Horizontal rectangle | 16dp | 20dp | high |

Geometry presets: circle, square, rectangle, orthogonals, diagonals. The page names them with construction and composition images and gives no further numbers. (high)

### Anatomy, corners, strokes

| Item | Rule | Confidence |
|---|---|---|
| Anatomy terms | stroke terminal, corner, counter area, stroke, counter stroke, bounding area | high |
| Exterior corner radius | 2dp on the silhouette | high |
| Stroke corners | do not round corners of strokes (shapes 2dp wide or less) | high |
| Interior corners | square; never rounded | high |
| Stroke weight | 2dp for every stroke: curves, angles, interior, exterior | high |
| Optical correction | 1.5dp stroke allowed when complex detail must fit the 24 x 24dp space (paperclip, microphone sound waves); keep the geometric forms, never skew or distort | high |
| Stroke terminals | squared, not rounded | high |
| Placement | "on pixel": integer X and Y; equal width and height (24 x 24) | high |
| Perspective | front-facing, flat; no tilt, rotation, or dimensional look | high |
| Weight | graphic and bold; no delicate thin strokes; no gestural or loose organic shapes | high |

### Clearance and touch targets

| Icon | Touch target | Confidence |
|---|---|---|
| 24dp standard | 48dp | high |
| 20dp dense | 40dp | high |

"Adequate space around the icon is needed to allow for legibility and touch. When the mouse and keyboard are the primary input methods, measurements may be condensed to accommodate denser layouts." (high)

### Icon color and opacity

Icons page header tables (state includes focus):

| State | Dark icons (#000000) on light backgrounds | Light icons (#FFFFFF) on dark backgrounds | Confidence |
|---|---|---|---|
| Active, focused | 87% | 100% | high |
| Active, unfocused | 54% | 70% | high |
| Inactive | 38% | 50% | high |

Icons page "Color" section and color page "Icons and other elements" (two-state form):

| State | Dark icons (#000000) on light | Light icons (#FFFFFF) on dark | Confidence |
|---|---|---|---|
| Active | 54% | 100% | high |
| Inactive | 38% | 50% | high |

The color page adds: "Elements like icons benefit from having a hex value of black or white at 38% opacity so that they work on backgrounds of any color." (high)

The two tables agree where they overlap (54 and 38 on light, 100 and 50 on dark); the three-state table adds the focused value (87% light, 100% dark) and the unfocused active value on dark (70%). Material Design 1 needs tokens for all three states.

Vuetify 1.5 `$material-light.icons`: active rgba(0,0,0,.54), inactive rgba(0,0,0,.38); `$material-dark.icons`: active #fff, inactive rgba(255,255,255,.5). `.v-icon--disabled` additionally sets `opacity: .6` (Vuetify's own, not in the spec). No focused-state value. (moderate)

### Vuetify 1.5 icon sizing cross-check

| Context | Vuetify 1.5 value | Spec | Confidence |
|---|---|---|---|
| `.v-icon` default | font-size 24px, line-height 1, `vertical-align: text-bottom`, `font-feature-settings: 'liga'` | 24dp | moderate |
| `.v-icon--is-component` | height 24px | 24dp | moderate |
| `.v-icon--left`, `--right` margin | 16px (`$grid-gutters.lg`) | not found on the icons page | moderate |
| Floating button icon | 24px; small FAB 18px; large FAB 30px | 24dp (FAB sizes are the buttons page's) | moderate |
| Chip icon | 20px; small chip icon 20px | not found | moderate |
| Dense list icon | 22px | spec dense icon is 20dp | moderate, disagrees |
| Stepper icon | 18px; completed icon 24px | not found | moderate |
| Data table sort icon | 16px | not found | moderate |
| Breadcrumbs divider icon | 16px | not found | moderate |
| Alert icon | 24px | not found | moderate |
| Pagination nav icon | 2rem (28px at a 14px root) | not found | moderate |

## Product icons

Product icons are the visual expression of a brand's products, services, and tools: cut, folded, and lit like paper, with clean folds, crisp edges, and a matte finish. Android expects them at 48dp with 1dp edges; design them on the same 48-unit grid scaled 400% to 192 x 192dp so the edge becomes 4dp, and any later scaling stays proportional (high). Keyline shapes on the product grid: square 152 x 152dp, circle 176dp diameter, vertical rectangle 176dp high by 128dp wide, horizontal rectangle 128dp high by 176dp wide (high). Anatomy, stacked from back to front and always viewed straight on: finish, material background, material foreground, color, shadow; color is either a spot color on part of an element or a flood across a whole element, and colored elements sit flush with the surface with no edges or shadows of their own (high). Material elements are 1dp thick; the top edge carries a tint (1dp, 20% opacity, white #FFFFFF) and the bottom edge a shade (1dp, 20% opacity, color from the tint, shade, and shadow value charts); left and right edges carry neither (high). A top light casts a contact shadow: mode Normal, opacity 20%, X offset 0dp, Y offset 4dp, blur 4dp, contained inside the icon silhouette (high). The finish is a radial gradient from a virtual 45 degree light: white, midpoint at 33%, 10% opacity at location 0% fading to 0% opacity at 100%, confined to the silhouette (high). Composition patterns: layer (few overlaps), elevate (never crop an elevated element inside another shape), score (one centered score on symmetric shapes), fold (no spot colors on folds), overlap (at most two), accordion (at most two folds), and never distort, skew, rotate, bow, warp, or bend an element (high). Human iconography follows the same keyline shapes with simple background silhouettes, balanced curved and straight edges, and no circular arm terminals or cropped arms (high). Product icons are a brand asset, not a component concern; Material Design 1 ships none and `Md1Icon` renders system icons only.

## App shortcut and Android launcher icons

Platform-only; recorded for completeness, out of scope for a web design system.

| Item | Value | Confidence |
|---|---|---|
| Shortcut icon total area | 48dp circle | high |
| Shortcut icon live area | 44dp circle with 2dp padding | high |
| Shortcut background | solid Material Grey 100 (#F5F5F5), no shadow | high |
| Standard shortcut system icon | 24 x 24dp, centered, colored like the app's primary color with enough contrast | high |
| Single avatar | fills the 44dp live area | high |
| Group avatar | 2 to 4 images, each within 30 x 30dp, centered | high |
| Android O adaptive icon layers | foreground and background 108 x 108dp, 72dp masked section, background opaque, all layers exceed the base shape by 50% | high |
| Adaptive keylines | square 44dp (radius 4dp), circle 52dp, tall rectangle 52 x 36dp (radius 4dp), wide rectangle 36 x 52dp (radius 4dp); OEM mask 72 x 72dp convex | high |
| Cast shadow gradient | 45 degrees, radial: 15% at 32%, 2% at 62%, 0% at 100% | high |
| Contact shadow | Normal, 20%, 0dp x, 4dp y, 4dp blur | high |
| Finishing layer | 45 degrees, midpoint 32%, 10% at 0% to 0% at 100% | high |

## Imagery guidance that touches component APIs

Principles: images should carry personal relevance, information, and delight; be context-relevant; backgrounds may be obscured by color or content overlays when foreground content is engaged. Prefer photography for specific entities and illustration for concepts; avoid stock; keep a single point of focus; tell a story. (high)

| Topic | Rule | API implication | Confidence |
|---|---|---|---|
| Resolution | size assets for the display; Material emphasizes large images; nothing pixelated | image components need density-aware sources (`srcset`), no spec value | high |
| Scale | mix thumbnail sizes in a gallery to convey hierarchy; multiple container sizes may coexist | grid list and card media accept varied sizes | high |
| Text protection scrim | a lightweight translucent layer under text on imagery; gradient length 3x the standard app bar height; gradient center point 3/10 of the way toward the dark end; end point opacity 0; dark end opacity depends on context | card, grid-list tile bar, and app-bar-over-image need a scrim option with a gradient, not a flat fill | high |
| Scrim opacity | dark scrims ideally 20% to 40%; light scrims ideally 40% to 60%; some imagery takes 60% black; some contexts as low as 10% to 20% | scrim opacity is a token with a range, default `not found` on the page | high |
| Scrim extent | for large real estate protect only the text area; do not blanket the whole image; do not obscure the image | scrim is positioned, not full-bleed | high |
| Color overlays | distinct from scrims; a design element; derive the scheme from the image with the Palette API | separate from the scrim option | high |
| Avatars and thumbnails | represent entities or content; generally tap targets leading to a primary view; personal avatars get personalization and delightful defaults; brand avatars carry a logo | avatar is interactive by default in lists; default avatar artwork required | high |
| Hero images | anchored above the fold; "feature" is the bold primary focus in a heterogeneous layout; "integrated" sets a scene and is not the focus | a card or toolbar media slot, no numbers given | high |
| Gallery | bold hero images in homogeneous layouts, either a grid or a single image | grid list | high |
| Aspect ratios | not found on the imagery page (they live on the cards and grid lists component pages) | | not found |

## Writing guidance that touches component APIs

Style: Google follows Associated Press (AP) style; text is simple, concise, and direct; the page defers to the Errors, Dialogs, Settings, and Data formats pattern pages for element-specific rules. (high)

### Default button labels

From the "Text for buttons and related elements" table. These are the only sanctioned stock labels; they are the defaults for dialog actions, snackbars, onboarding, and steppers.

| Label | Usage | Confidence |
|---|---|---|
| [Action] | a verb for the specific action; use the same verb everywhere the action is described | high |
| Back | allows multi-step processes | high |
| Cancel | cancels an action | high |
| Dismiss | causes a message or dialog to disappear without any consequences | high |
| Done | confirms the completion of a multi-step process | high |
| Got it | causes a message or dialog to disappear without any consequences (similar to OK) | high |
| Learn more | takes the user to additional content | high |
| Next | takes the user to the next step of a multi-step process | high |
| No thanks | allows a user to decline | high |
| Not now | lets a user postpone an action or decision; only when the call to action is essential to the product, for legal reasons, or another urgent reason; never a substitute for offering "No thanks" | high |
| OK | allows the user to confirm an action that is relevant to the task at hand | high |
| Skip | gives the user a way to avoid an interruption and proceed with a task | high |

"Buttons appear in dialogs and as blue or underlined text." (high)

### Capitalization and punctuation rules per element

| Element | Rule | Example (Do / Don't) | Confidence |
|---|---|---|---|
| Titles, headings, labels, menu items | sentence-style capitalization; all caps only where the Material spec requires it (Button text) | "Search settings" / "Search Settings" | high |
| Button text | all caps is the spec's exception (see typography.md) | | high |
| Dialog titles | short; a question when confirming; no "Are you sure"; reveal detail later | "Remove photo?" / "Remove photo from page?"; "Remove downloaded book?" / "Are you sure you want to remove this downloaded book? You won't be able to access it unless you're online." | high |
| Dialog body, single sentence | no period | "If you undo this bulk edit, everything you changed will go back to its previous state" | high |
| Labels, hover text (tooltips), bulleted lists | no period on solitary sentences | | high |
| Multiple sentences, or a sentence followed by a link | periods; the period goes before the link | "Share your photos with friends. Learn more" / "Share your photos with friends. Learn more." | high |
| Labels | no colon | "Share with" / "Share with:" | high |
| Menu items and buttons that open a dialog or start a process | no ellipsis | | high |
| Progress and truncation | ellipsis without a preceding space | "Downloading…" | high |
| Exclamation points | avoid, except greetings or congratulations | "Welcome!" / "Learn about the new features of Calendar!" | high |
| Numbers | numerals, not words, except mixed cases such as "Enter two 3s" | "You have 3 messages" / "You have three messages" | high |
| Contractions | use them when they ease reading; "do not" when emphasis is needed | "it's, can't, wouldn't" / "it is, cannot, would not" | high |

### Error, status, and empty-state copy

| Rule | Do | Don't | Confidence |
|---|---|---|---|
| Positive framing | "Use 24 characters or fewer for file names" | "Your file name must be less than 25 characters" | high |
| Recovery over failure | "Try again" | "The action failed" | high |
| Friendly, focused on the user | "MyApp isn't responding" with "Do you want to close it?" | "Sorry! Activity in MyAppActivity (in the MyApp app) is not responding" | high |
| Essential detail only | "Signing in... Your phone is contacting Google. This can take up to five minutes." | "Signing in... Your phone needs to communicate with Google servers to sign in to your account. This may take up to five minutes." | high |
| Simple present tense, omit introductory phrases | "Save changes?"; "Message sent"; "Register to vote" | "Would you like to save your changes?"; "Message has been sent"; "You must register before you can vote" | high |
| Refer to labels, not control types | "Click Continue" | "Click the Continue button" | high |
| Plain words, no jargon | "Turn on Location History"; "Preparing video…" | "Enable Location History"; "Buffering…" | high |
| Consistent verbs | "Remove photo" everywhere for one action | mixing "Remove photo" and "Delete photo" | high |
| No absolutes | "Your circle names aren't shared" | "We'll never share your circle names" | high |
| Objective first | "To remove a photo from this album, drag it to the trash" | "Drag a photo to the trash to remove it from this album" | high |
| Address the user | second person "you"/"your" for most copy; first person "I"/"my" only to stress ownership ("My Account"); never mix them in one context; avoid "we" except when a person acts for the user ("We'll review your appeal") | "Change your preferences in My Account" | high |
| Humble, inviting | "All your savings in one place"; "More restaurant reviews" | "Great deals at places you'll love"; "All restaurant reviews" | high |

### Punctuation glyph table

| Character | Entity / Unicode | Rule | Example | Confidence |
|---|---|---|---|---|
| Colon | `&#58;` U+003A | omit on labels; use above lists | "Two things:" then a list | high |
| Comma | | inside quotation marks; serial comma in lists of three or more, except with an ampersand | | high |
| Double angle brackets | `&laquo;` `&raquo;` U+00AB U+00BB | omit from links or buttons that open another page or step | | high |
| Em dash | `&mdash;` U+2014 | do not use; use en dashes | | high |
| En dash | `&ndash;` U+2013 | ranges without spaces; if a dash must separate text, an en dash with spaces | `3–5 kg` | high |
| Ellipsis | `&hellip;` | action in progress or truncated text, no space before; not on menu items or buttons that open a dialog | "Downloading…" | high |
| Exclamation point | | avoid | | high |
| Hyphen | | negative numbers and compound words | "-5", "5-mile walk" | high |
| Midline ellipsis | `• • •` | numeric truncation and redaction of sensitive data | "SSN • • • 5678" | high |
| Parentheses | | define acronyms or jargon | "SSL (secure socket layer)" | high |
| Period | | omit on fragments and single sentences; use in groups of two or more; inside quotation marks | | high |
| Prime, double prime | `&prime;` `&Prime;` U+2032 U+2033 | feet, arcminutes, minutes; inches, arcseconds, seconds; never straight quotes or accents | "3° 15′ 35″" | high |
| Quotation marks | `&ldquo;` `&rdquo;` `&lsquo;` `&rsquo;` U+201C U+201D U+2018 U+2019 | curly quotes; right single quote for apostrophes; never straight quotes or free-standing accents | | high |

### Global writing

| Rule | Confidence |
|---|---|
| Simple, clear English: all ages, cultures, and education levels rely on the English version | high |
| Avoid "left" and "right" in copy; RTL interfaces mirror (an Arabic layout is the mirror of the English one), so component copy and icons must respect `dir` | high |
| Gender: use "they" when the gender is unknown in English; never combine options such as "his/her"; when a specific gender is required, provide translation instructions and use ICU APIs | high |

## Implications for the Material Design 1 icon plugin (derived from ruling 6 of DESIGN_SYSTEMS.md)

Guidance only; no new values.

1. Glyphs are drawn on the 24 x 24dp trim grid with the 20dp live area, 2dp strokes, 2dp exterior radius, squared terminals; the dense variant is the same artwork rendered at 20dp with 2dp padding, not a second set.
2. `Md1Icon` sizes: 24 (default) and 20 (dense); every interactive icon gets a 48dp (40dp dense) target from its host component, not from the glyph.
3. Opacity tokens per theme: active-focused, active-unfocused, inactive; light values 87 / 54 / 38 percent of black, dark values 100 / 70 / 50 percent of white.
4. Roles map to glyphs through `createTokens`; components never inline artwork (ruling 6).
5. Default action labels in dialogs, snackbars, steppers, and onboarding come from the button label table; titles are sentence case and only Button text is uppercased, by CSS, in the Button style.
