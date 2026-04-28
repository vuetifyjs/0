# Emerald → v0 Component Mapping

Per-component pattern assignments, v0 primitives to wrap, and sub-component splits.

## EmAccordion
- Pattern: 2 (root) + 5 (subs)
- v0 components: ExpansionPanelGroup, ExpansionPanelRoot, ExpansionPanelHeader, ExpansionPanelActivator, ExpansionPanelContent, ExpansionPanelCue
- v0 composable: none (exposed via ExpansionPanelGroup internally)
- Sub-components: EmAccordion (wraps ExpansionPanelGroup), EmAccordionItem (wraps ExpansionPanelRoot), EmAccordionHeader, EmAccordionTrigger (wraps ExpansionPanelActivator), EmAccordionContent, EmAccordionCue
- Notes: v0 uses "ExpansionPanel" naming; Emerald renames to Accordion.

## EmAlert
- Pattern: 1
- v0 components: none
- v0 composable: none
- Sub-components: EmAlert, EmAlertTitle, EmAlertDescription, EmAlertIcon, EmAlertClose
- Notes: No v0 Alert primitive — styled V0Paper shell with role="alert" + DS sub-components.

## EmAutoComplete
- Pattern: 2 (root) + 5 (subs)
- v0 components: ComboboxRoot, ComboboxControl, ComboboxActivator, ComboboxContent, ComboboxItem, ComboboxEmpty, ComboboxError, ComboboxDescription, ComboboxCue, ComboboxHiddenInput
- v0 composable: createCombobox (consumed via ComboboxRoot)
- Sub-components: EmAutoComplete, EmAutoCompleteControl, EmAutoCompleteInput, EmAutoCompleteContent, EmAutoCompleteItem, EmAutoCompleteEmpty
- Notes: Combobox is the autocomplete primitive in v0.

## EmAvatar
- Pattern: 1 (root) + 5 (subs)
- v0 components: AvatarRoot, AvatarImage, AvatarFallback
- v0 composable: useImage (consumed via AvatarRoot)
- Sub-components: EmAvatar (wraps AvatarRoot via V0Paper), EmAvatarImage, EmAvatarFallback
- Notes: AvatarRoot renders an element so V0Paper can wrap or swap-in via `as`.

## EmBadge
- Pattern: 1
- v0 components: none
- v0 composable: none
- Sub-components: EmBadge (optionally EmBadgeDot)
- Notes: No v0 Badge — styled V0Paper shell, positional variants via data attrs.

## EmBreadcrumb
- Pattern: 2 (root) + 5 (subs)
- v0 components: BreadcrumbsRoot, BreadcrumbsList, BreadcrumbsItem, BreadcrumbsLink, BreadcrumbsPage, BreadcrumbsDivider, BreadcrumbsEllipsis
- v0 composable: createBreadcrumbs (consumed via BreadcrumbsRoot)
- Sub-components: EmBreadcrumb, EmBreadcrumbList, EmBreadcrumbItem, EmBreadcrumbLink, EmBreadcrumbPage, EmBreadcrumbDivider, EmBreadcrumbEllipsis
- Notes: v0 is plural "Breadcrumbs"; Emerald drops the "s".

## EmCarousel
- Pattern: 2 (root) + 5 (subs)
- v0 components: CarouselRoot, CarouselViewport, CarouselItem, CarouselPrevious, CarouselNext, CarouselIndicator, CarouselProgress, CarouselLiveRegion
- v0 composable: none (logic in CarouselRoot)
- Sub-components: EmCarousel, EmCarouselViewport, EmCarouselItem, EmCarouselPrevious, EmCarouselNext, EmCarouselIndicator
- Notes: LiveRegion/Progress optional — only wrap if spec styles them.

## EmCheckbox
- Pattern: 2 (root) + 5 (subs)
- v0 components: CheckboxRoot, CheckboxIndicator, CheckboxHiddenInput, CheckboxGroup, CheckboxSelectAll
- v0 composable: none (CheckboxRoot internalizes)
- Sub-components: EmCheckbox (wraps CheckboxRoot), EmCheckboxIndicator, EmCheckboxGroup, EmCheckboxSelectAll
- Notes: HiddenInput stays raw (no styling). Group is separate top-level sub for multi-select UX.

## EmDatePicker
- Pattern: 1 (styled-shell fallback)
- v0 components: none (no DatePicker primitive yet)
- v0 composable: useDate (for formatting/calendar math)
- Sub-components: EmDatePicker, EmDatePickerCalendar, EmDatePickerHeader, EmDatePickerGrid, EmDatePickerCell, EmDatePickerInput
- Notes: No v0 primitive — styled shell using useDate. Flag for v0 roadmap; may integrate Popover + Input later.

## EmDialog
- Pattern: 3 (root renderless) + 1/5 (subs)
- v0 components: DialogRoot, DialogActivator, DialogContent, DialogTitle, DialogDescription, DialogClose
- v0 composable: none
- Sub-components: EmDialog (wraps renderless DialogRoot), EmDialogActivator, EmDialogContent (V0Paper goes here), EmDialogTitle, EmDialogDescription, EmDialogClose
- Notes: Canonical Pattern 3 per rules doc.

## EmFlex
- Pattern: 1
- v0 components: none (uses Atom)
- v0 composable: none
- Sub-components: EmFlex
- Notes: Layout primitive — spec rule says Atom may be used directly when no styling surface needed, but V0Paper still valid for consistent prop API (gap/direction via data attrs).

## EmForm
- Pattern: 2
- v0 components: Form
- v0 composable: createForm (consumed via Form)
- Sub-components: EmForm
- Notes: v0 Form is a single component (no sub tree). Field validation wiring lives on EmTextField/EmSelect/etc.

## EmGrid
- Pattern: 1
- v0 components: none
- v0 composable: none
- Sub-components: EmGrid, EmGridItem (if spec supports spans)
- Notes: Pure layout shell — display:grid styled via V0Paper + props-to-utility mapping.

## EmList
- Pattern: 1 (root) + 4 (subs)
- v0 components: none
- v0 composable: none (could opt into createSelection if spec wants selectable list)
- Sub-components: EmList, EmListItem, EmListItemTitle, EmListItemSubtitle, EmListItemIcon
- Notes: No v0 List primitive — styled <ul>/<li> shell. If spec needs selection, layer createSelection on EmList.

## EmLoading
- Pattern: 1
- v0 components: none
- v0 composable: none
- Sub-components: EmLoading (EmLoadingSpinner/EmLoadingDots as variants via prop)
- Notes: No v0 primitive — pure CSS spinner shell. Consider Progress (indeterminate) if spec merges them.

## EmMenu
- Pattern: 3 (root renderless) + 1/5 (subs)
- v0 components: PopoverRoot, PopoverActivator, PopoverContent (+ optional Selection/Single for menu item state)
- v0 composable: usePopover (consumed via PopoverRoot)
- Sub-components: EmMenu (wraps PopoverRoot), EmMenuActivator, EmMenuContent (V0Paper), EmMenuItem, EmMenuSeparator
- Notes: No dedicated v0 Menu primitive — composed from Popover + manual item roving focus (consider useRovingFocus in EmMenuContent).

## EmPagination
- Pattern: 2 (root) + 5 (subs)
- v0 components: PaginationRoot, PaginationItem, PaginationFirst, PaginationPrev, PaginationNext, PaginationLast, PaginationEllipsis, PaginationStatus
- v0 composable: createPagination (via PaginationRoot)
- Sub-components: EmPagination, EmPaginationItem, EmPaginationFirst, EmPaginationPrev, EmPaginationNext, EmPaginationLast, EmPaginationEllipsis
- Notes: Status sub optional; skip unless spec styles it.

## EmProgress
- Pattern: 2 (root) + 5 (subs)
- v0 components: ProgressRoot, ProgressTrack, ProgressFill, ProgressBuffer, ProgressLabel, ProgressValue, ProgressHiddenInput
- v0 composable: createProgress (via ProgressRoot)
- Sub-components: EmProgress, EmProgressTrack, EmProgressFill (Buffer/Label/Value optional per spec)
- Notes: Linear vs circular handled via variant prop + CSS — same v0 primitives.

## EmRadio
- Pattern: 2 (root) + 5 (subs)
- v0 components: RadioRoot, RadioGroup, RadioIndicator, RadioHiddenInput
- v0 composable: none
- Sub-components: EmRadio (wraps RadioRoot), EmRadioIndicator, EmRadioGroup
- Notes: Group required for single-selection semantics.

## EmSelect
- Pattern: 2 (root) + 5 (subs)
- v0 components: SelectRoot, SelectActivator, SelectContent, SelectItem, SelectValue, SelectPlaceholder, SelectCue, SelectHiddenInput
- v0 composable: createSelection/createSingle (via SelectRoot)
- Sub-components: EmSelect, EmSelectActivator, EmSelectContent, EmSelectItem, EmSelectValue
- Notes: Differs from EmAutoComplete (no typeahead input).

## EmSlider
- Pattern: 2 (root) + 5 (subs)
- v0 components: SliderRoot, SliderTrack, SliderRange, SliderThumb, SliderHiddenInput
- v0 composable: createSlider (via SliderRoot)
- Sub-components: EmSlider, EmSliderTrack, EmSliderRange, EmSliderThumb
- Notes: Multi-thumb via v-for on EmSliderThumb.

## EmStepper
- Pattern: 2 (root) + 5 (subs)
- v0 components: StepRoot, StepItem
- v0 composable: createStep (via StepRoot)
- Sub-components: EmStepper, EmStepperItem, EmStepperSeparator (DS-only), EmStepperLabel (DS-only)
- Notes: v0 only ships Root+Item; Emerald adds Separator/Label/Content sub-components.

## EmSwitch
- Pattern: 2 (root) + 5 (subs)
- v0 components: SwitchRoot, SwitchThumb, SwitchTrack, SwitchHiddenInput, SwitchGroup, SwitchSelectAll
- v0 composable: none
- Sub-components: EmSwitch, EmSwitchThumb, EmSwitchTrack, EmSwitchGroup
- Notes: Track + Thumb explicit in v0 (unlike Checkbox), simplifies styling.

## EmTable
- Pattern: 1 (styled-shell)
- v0 components: none (no table component)
- v0 composable: createDataTable (logic-only: sort/filter/paginate state)
- Sub-components: EmTable, EmTableHead, EmTableBody, EmTableRow, EmTableCell, EmTableHeader
- Notes: No v0 Table primitive — styled <table> shell. createDataTable drives headless sort/pagination if spec requires.

## EmTabs
- Pattern: 2 (root) + 5 (subs)
- v0 components: TabsRoot, TabsList, TabsItem, TabsPanel
- v0 composable: none (TabsRoot internalizes)
- Sub-components: EmTabs, EmTabsList, EmTabsItem, EmTabsPanel
- Notes: Clean 1:1 mapping.

## EmTag
- Pattern: 1
- v0 components: none
- v0 composable: none
- Sub-components: EmTag, EmTagClose (if dismissible)
- Notes: No v0 Tag/Chip primitive — styled V0Paper shell. Dismissible variant gets a close sub.

## EmTextField
- Pattern: 2 (root) + 5 (subs)
- v0 components: InputRoot, InputControl, InputDescription, InputError
- v0 composable: createInput (via InputRoot)
- Sub-components: EmTextField, EmTextFieldControl, EmTextFieldDescription, EmTextFieldError, EmTextFieldPrepend (DS-only), EmTextFieldAppend (DS-only)
- Notes: Canonical Pattern 2 per rules doc. Prepend/Append are DS additions.

## EmTextarea
- Pattern: 2 (root) + 5 (subs)
- v0 components: InputRoot, InputControl (as textarea), InputDescription, InputError
- v0 composable: createInput (via InputRoot)
- Sub-components: EmTextarea, EmTextareaControl, EmTextareaDescription, EmTextareaError
- Notes: Reuses Input primitives — InputControl accepts `as="textarea"` or equivalent prop.

## EmToast
- Pattern: 3 (root renderless) + 1/5 (subs)
- v0 components: SnackbarQueue, SnackbarRoot, SnackbarContent, SnackbarClose, SnackbarPortal
- v0 composable: createQueue + useNotifications (via SnackbarQueue)
- Sub-components: EmToast (wraps SnackbarRoot), EmToastQueue, EmToastContent, EmToastClose, EmToastPortal
- Notes: v0 calls it Snackbar; Emerald renames to Toast. SnackbarRoot is renderless → Pattern 3.

## EmTooltip
- Pattern: 3 (root renderless) + 1/5 (subs)
- v0 components: PopoverRoot, PopoverActivator, PopoverContent
- v0 composable: usePopover (via PopoverRoot)
- Sub-components: EmTooltip (wraps PopoverRoot), EmTooltipActivator, EmTooltipContent (V0Paper + role="tooltip")
- Notes: No dedicated v0 Tooltip — reuses Popover with role/hover-trigger semantics. Flag whether hover-only trigger belongs in v0.

## EmUpload
- Pattern: 1 (styled-shell)
- v0 components: none
- v0 composable: none (could layer createQueue for upload progress list)
- Sub-components: EmUpload, EmUploadDropzone, EmUploadInput, EmUploadList, EmUploadItem
- Notes: No v0 Upload primitive — styled shell around `<input type="file">` with drag-and-drop handlers. Candidate for future v0 primitive.
