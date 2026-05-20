<script setup lang="ts">
  import { EmeraldStyleSheetAdapter, emeraldColors } from '@paper/emerald'
  import {
    PhAirplaneTilt,
    PhArchive,
    PhArrowSquareOut,
    PhBookOpen,
    PhCalendarBlank,
    PhCalendarDots,
    PhCaretDown,
    PhCaretLeft,
    PhCaretRight,
    PhCaretUp,
    PhCaretUpDown,
    PhChalkboardTeacher,
    PhChartPieSlice,
    PhChatsCircle,
    PhChatText,
    PhCheck,
    PhCheckCircle,
    PhCheckSquare,
    PhCopy,
    PhCube,
    PhDotsThree,
    PhDotsThreeCircle,
    PhDotsThreeOutlineVertical,
    PhEnvelope,
    PhFileArrowUp,
    PhFunnel,
    PhGear,
    PhHouse,
    PhHouseLine,
    PhInfo,
    PhMagnifyingGlass,
    PhMapPin,
    PhNotePencil,
    PhPencilSimple,
    PhPlus,
    PhPlusCircle,
    PhShareNetwork,
    PhStar,
    PhTrash,
    PhUser,
    PhUserPlus,
    PhWarning,
    PhX,
    PhXCircle,
  } from '@phosphor-icons/vue'

  const adapter = new EmeraldStyleSheetAdapter()
  adapter.upsert(adapter.generate({ emerald: emeraldColors }, false))

  // ────────────── Stateful demos ──────────────
  // Overlays
  const dialogSmOpen = ref(false)
  const dialogMdOpen = ref(false)
  const dialogLgOpen = ref(false)
  const dialogFullOpen = ref(false)
  const dialogFormOpen = ref(false)
  const menuOpen = ref(false)
  const menuRowOpen = ref(false)

  // Disclosure
  const accordion = ref<string[]>(['overview'])

  // Navigation
  const tabsSegmented = ref('overview')
  const tabsLine = ref('overview')
  const tabsPill = ref('overview')
  const tabsBoxed = ref('overview')
  const tabsVertical = ref('overview')

  const stepperHorizontal = ref('house')
  const stepperVertical = ref('plan')
  const stepperNumbered = ref('billing')
  const stepperError = ref('payment')

  const paginationFull = ref(2)
  const paginationSimple = ref(3)

  // Forms
  const textFieldDefault = ref('Emerald')
  const textFieldSearch = ref('')
  const textFieldPassword = ref('hunter2')
  const textFieldClearable = ref('Clear me')
  const textFieldCounter = ref('Counted')
  const textareaDefault = ref('Write about something nice…')
  const textareaCounter = ref('A few words.')

  const checkboxModel = ref(true)
  const checkboxIndeterminate = ref<unknown[]>(['a'])
  const checkboxAll = ref<unknown[]>([])

  const radioHorizontal = ref('vue')
  const switchSingle = ref(true)
  const switchGroup = ref<unknown[]>(['email'])

  const sliderSingle = ref(40)
  const sliderRange = ref([20, 70])
  const sliderTicks = ref(50)
  const sliderTooltip = ref(60)

  const selectSingle = ref<string | undefined>()
  const selectMulti = ref<string[]>(['vuetify', 'baseui'])
  const selectDisabled = ref<string | undefined>('vuetify')
  const frameworkLabels: Record<string, string> = {
    vuetify: 'Vuetify',
    shadcn: 'Shadcn',
    baseui: 'Base UI',
    rekaui: 'Reka UI',
  }

  const autoCompleteSingle = ref<string | undefined>('Vuetify')
  const autoCompleteMulti = ref<string[]>(['Vuetify', 'Vue'])

  const datePickerValue = ref<Date | null>(new Date())

  const uploadFiles = ref<File[]>([])
  const uploadFilledFiles = ref<File[]>([
    new File([new ArrayBuffer(1024 * 1024 * 2.4)], 'figma-export.zip', { type: 'application/zip' }),
    new File([new ArrayBuffer(1024 * 184)], 'palette.png', { type: 'image/png' }),
  ])

  const formValid = ref<boolean | null>(null)
  const formEmail = ref('')
  const formPassword = ref('')
  const formBio = ref('')

  function onFormReset () {
    formEmail.value = ''
    formPassword.value = ''
    formBio.value = ''
    formValid.value = null
  }

  // Feedback
  const alertDismissed = ref(false)
  const toastStackVisible = ref<Record<string, boolean>>({
    update: true,
    saved: true,
    failed: true,
  })

  function onToastStack (key: string) {
    toastStackVisible.value[key] = false
  }

  // Data
  const tableSelected = ref<Record<string, boolean>>({
    1: false,
    2: true,
    3: false,
    4: false,
  })
  const tableSelectAll = ref<unknown[]>([])
  const tableExpanded = ref<Record<string, boolean>>({ 2: true })
  const tableRowMenuOpen = ref<Record<string, boolean>>({})

  function onTableExpand (id: string) {
    tableExpanded.value[id] = !tableExpanded.value[id]
  }

  const carouselDefault = ref('slide-1')
  const carouselAutoplay = ref('slide-1')
</script>

<template>
  <div class="emerald-sink" data-theme="emerald">
    <header class="sink-header">
      <h1>Emerald Kitchen Sink</h1>
      <p>Every Emerald component, every variant, every state — composed entirely from <code>Em*</code> primitives.</p>
    </header>

    <!-- ╔══════════════════ FOUNDATION ══════════════════╗ -->

    <h1 class="sink-group">Foundation</h1>

    <section>
      <h2>Button</h2>

      <p class="muted">Variants × default size</p>

      <div class="row">
        <EmButton variant="primary">Primary</EmButton>
        <EmButton variant="secondary">Secondary</EmButton>
        <EmButton variant="ghost">Ghost</EmButton>
        <EmButton variant="destructive">Destructive</EmButton>
      </div>

      <p class="muted">Sizes (primary)</p>

      <div class="row">
        <EmButton size="sm">Small</EmButton>
        <EmButton size="md">Medium</EmButton>
        <EmButton size="lg">Large</EmButton>
      </div>

      <p class="muted">Sizes (secondary)</p>

      <div class="row">
        <EmButton size="sm" variant="secondary">Small</EmButton>
        <EmButton size="md" variant="secondary">Medium</EmButton>
        <EmButton size="lg" variant="secondary">Large</EmButton>
      </div>

      <p class="muted">States</p>

      <div class="row">
        <EmButton disabled>Disabled</EmButton>
        <EmButton loading>Loading</EmButton>
        <EmButton disabled variant="secondary">Disabled</EmButton>
        <EmButton loading variant="destructive">Loading</EmButton>
        <EmButton href="#button-anchor">Anchor link</EmButton>
      </div>

      <p class="muted">With prepend / append / loader</p>

      <div class="row">
        <EmButton>
          <EmButtonPrepend>
            <PhPlus :size="14" weight="bold" />
          </EmButtonPrepend>

          <EmButtonContent>Add item</EmButtonContent>
        </EmButton>

        <EmButton variant="secondary">
          <EmButtonContent>Open in new tab</EmButtonContent>

          <EmButtonAppend>
            <PhArrowSquareOut :size="14" weight="bold" />
          </EmButtonAppend>
        </EmButton>

        <EmButton loading variant="destructive">
          <EmButtonLoader />
          <EmButtonContent>Deleting…</EmButtonContent>
        </EmButton>
      </div>

      <p class="muted">Icon-only</p>

      <div class="row">
        <EmButton aria-label="Settings" variant="ghost">
          <PhGear :size="16" weight="duotone" />
        </EmButton>

        <EmButton aria-label="Edit" size="sm" variant="secondary">
          <PhPencilSimple :size="14" weight="duotone" />
        </EmButton>

        <EmButton aria-label="Delete" variant="destructive">
          <PhTrash :size="14" weight="duotone" />
        </EmButton>
      </div>
    </section>

    <section>
      <h2>Container</h2>

      <div class="stack" style="max-width: none;">
        <EmContainer class="sink-demo-surface" size="sm">
          <p>Container size=sm</p>
        </EmContainer>

        <EmContainer class="sink-demo-surface" size="md">
          <p>Container size=md</p>
        </EmContainer>

        <EmContainer class="sink-demo-surface" size="lg">
          <p>Container size=lg (default)</p>
        </EmContainer>

        <EmContainer class="sink-demo-surface" size="xl">
          <p>Container size=xl</p>
        </EmContainer>

        <EmContainer class="sink-demo-surface" size="2xl">
          <p>Container size=2xl</p>
        </EmContainer>

        <EmContainer class="sink-demo-surface" size="fluid">
          <p>Container size=fluid</p>
        </EmContainer>
      </div>
    </section>

    <section>
      <h2>Divider</h2>

      <div class="stack">
        <EmDivider>
          <EmDividerLine />
        </EmDivider>

        <EmDivider variant="dashed">
          <EmDividerLine />
        </EmDivider>

        <EmDivider>
          <EmDividerLine />
          <EmDividerLabel>Or</EmDividerLabel>
          <EmDividerLine />
        </EmDivider>
      </div>

      <div class="row vertical-dividers">
        <span>Left</span>

        <EmDivider orientation="vertical">
          <EmDividerLine />
        </EmDivider>

        <span>Middle</span>

        <EmDivider orientation="vertical">
          <EmDividerLine />
          <EmDividerLabel>Or</EmDividerLabel>
          <EmDividerLine />
        </EmDivider>

        <span>Right</span>
      </div>
    </section>

    <section>
      <h2>Card</h2>

      <div class="row" style="align-items: stretch;">
        <EmCard style="width: 320px;">
          <EmCardHeader>
            <EmCardTitle>Preferences</EmCardTitle>
            <EmCardSubtitle>Customize your Emerald experience</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            Emerald introduces a token system structured in three levels: primitive, semantic, and component.
          </EmCardBody>

          <EmCardFooter>
            <EmButton size="sm">Save changes</EmButton>
          </EmCardFooter>
        </EmCard>

        <EmCard hoverable style="width: 320px;">
          <EmCardHeader>
            <EmCardTitle>Hoverable card</EmCardTitle>
            <EmCardSubtitle>Lifts on mouseover</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            When <code>hoverable</code> is set, the card lifts on mouseover with a primary-tinted border and drop shadow.
          </EmCardBody>
        </EmCard>

        <EmCard style="width: 320px;">
          <EmCardMedia>
            <img alt="Mountain landscape" src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=640&auto=format&fit=crop&q=60">
          </EmCardMedia>

          <EmCardHeader>
            <EmCardTitle>With media</EmCardTitle>
            <EmCardSubtitle>EmCardMedia at the top</EmCardSubtitle>
          </EmCardHeader>

          <EmCardBody>
            Media inherits the card's rounded top corners.
          </EmCardBody>
        </EmCard>
      </div>
    </section>

    <!-- ╔══════════════════ LAYOUT ══════════════════╗ -->

    <h1 class="sink-group">Layout</h1>

    <section>
      <h2>Flex</h2>

      <p class="muted">direction=row, gap=12 (default)</p>

      <EmFlex class="sink-demo-surface" :gap="12">
        <div class="sink-box">A</div>
        <div class="sink-box">B</div>
        <div class="sink-box">C</div>
      </EmFlex>

      <p class="muted">direction=column, gap=8</p>

      <EmFlex class="sink-demo-surface" direction="column" :gap="8">
        <div class="sink-box">Column 1</div>
        <div class="sink-box">Column 2</div>
      </EmFlex>

      <p class="muted">justify=between, align=center</p>

      <EmFlex align="center" class="sink-demo-surface" :gap="8" justify="between">
        <div class="sink-box">Left</div>
        <div class="sink-box">Right</div>
      </EmFlex>

      <p class="muted">wrap=wrap (overflowing children)</p>

      <EmFlex class="sink-demo-surface" :gap="8" wrap="wrap">
        <div v-for="n in 8" :key="n" class="sink-box" style="min-width: 96px;">Item {{ n }}</div>
      </EmFlex>
    </section>

    <section>
      <h2>Grid</h2>

      <p class="muted">columns=4, gap=8</p>

      <EmGrid class="sink-demo-surface" :columns="4" :gap="8">
        <EmGridItem v-for="n in 4" :key="n" class="sink-box">
          Cell {{ n }}
        </EmGridItem>

        <EmGridItem class="sink-box" :span="2">
          Span 2
        </EmGridItem>

        <EmGridItem class="sink-box" :span="2">
          Span 2
        </EmGridItem>
      </EmGrid>

      <p class="muted">columns=3, gap=12</p>

      <EmGrid class="sink-demo-surface" :columns="3" :gap="12">
        <EmGridItem v-for="n in 6" :key="n" class="sink-box">{{ n }}</EmGridItem>
      </EmGrid>
    </section>

    <!-- ╔══════════════════ CONTENT ══════════════════╗ -->

    <h1 class="sink-group">Content</h1>

    <section>
      <h2>Avatar</h2>

      <p class="muted">Image (sm/md/lg)</p>

      <div class="row">
        <EmAvatar size="sm">
          <EmAvatarImage alt="Small avatar" src="https://i.pravatar.cc/80?img=32" />
          <EmAvatarFallback>SM</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="md">
          <EmAvatarImage alt="Medium avatar" src="https://i.pravatar.cc/80?img=12" />
          <EmAvatarFallback>JD</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarImage alt="Large avatar" src="https://i.pravatar.cc/96?img=47" />
          <EmAvatarFallback>LG</EmAvatarFallback>
        </EmAvatar>
      </div>

      <p class="muted">Initials fallback</p>

      <div class="row">
        <EmAvatar size="sm">
          <EmAvatarFallback>AB</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="md">
          <EmAvatarFallback>CD</EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarFallback>EF</EmAvatarFallback>
        </EmAvatar>
      </div>

      <p class="muted">Icon fallback</p>

      <div class="row">
        <EmAvatar size="sm">
          <EmAvatarFallback>
            <PhUser :size="16" weight="regular" />
          </EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="md">
          <EmAvatarFallback>
            <PhUser :size="20" weight="regular" />
          </EmAvatarFallback>
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarFallback>
            <PhUser :size="24" weight="regular" />
          </EmAvatarFallback>
        </EmAvatar>
      </div>

      <p class="muted">EmAvatarGroup (overlap stack)</p>

      <div class="row">
        <EmAvatarGroup>
          <EmAvatar size="md">
            <EmAvatarImage alt="Member 1" src="https://i.pravatar.cc/80?img=12" />
            <EmAvatarFallback>JD</EmAvatarFallback>
          </EmAvatar>

          <EmAvatar size="md">
            <EmAvatarImage alt="Member 2" src="https://i.pravatar.cc/80?img=32" />
            <EmAvatarFallback>SM</EmAvatarFallback>
          </EmAvatar>

          <EmAvatar size="md">
            <EmAvatarImage alt="Member 3" src="https://i.pravatar.cc/80?img=47" />
            <EmAvatarFallback>LG</EmAvatarFallback>
          </EmAvatar>

          <EmAvatar size="md">
            <EmAvatarFallback>+3</EmAvatarFallback>
          </EmAvatar>
        </EmAvatarGroup>
      </div>

      <p class="muted">EmAvatarBadge (status overlay, all 4 positions)</p>

      <div class="row">
        <EmAvatar size="lg">
          <EmAvatarImage alt="bottom-right badge" src="https://i.pravatar.cc/96?img=8" />
          <EmAvatarFallback>BR</EmAvatarFallback>
          <EmAvatarBadge />
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarImage alt="bottom-left badge" src="https://i.pravatar.cc/96?img=15" />
          <EmAvatarFallback>BL</EmAvatarFallback>
          <EmAvatarBadge position="bottom-left" />
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarImage alt="top-right badge" src="https://i.pravatar.cc/96?img=27" />
          <EmAvatarFallback>TR</EmAvatarFallback>
          <EmAvatarBadge position="top-right" />
        </EmAvatar>

        <EmAvatar size="lg">
          <EmAvatarImage alt="top-left badge" src="https://i.pravatar.cc/96?img=37" />
          <EmAvatarFallback>TL</EmAvatarFallback>
          <EmAvatarBadge position="top-left" />
        </EmAvatar>
      </div>
    </section>

    <section>
      <h2>Badge</h2>

      <p class="muted">Variants</p>

      <div class="row">
        <EmBadge>Primary</EmBadge>
        <EmBadge variant="success">Success</EmBadge>
        <EmBadge variant="warning">Warning</EmBadge>
        <EmBadge variant="error">Error</EmBadge>
        <EmBadge variant="info">Info</EmBadge>
        <EmBadge variant="neutral">Neutral</EmBadge>
      </div>

      <p class="muted">Sizes</p>

      <div class="row">
        <EmBadge size="sm">Small</EmBadge>
        <EmBadge size="md">Medium</EmBadge>
        <EmBadge size="lg">Large</EmBadge>
      </div>

      <p class="muted">Shapes (dot, indicator, count)</p>

      <div class="row">
        <EmBadge shape="dot" variant="success" />
        <EmBadge shape="indicator" variant="success" />
        <EmBadge shape="count" variant="success">1</EmBadge>
        <EmBadge shape="count" variant="success">9</EmBadge>
        <EmBadge shape="count" variant="error">99+</EmBadge>
        <EmBadge shape="dot" variant="error" />
        <EmBadge shape="indicator" variant="warning" />
        <EmBadge shape="count" variant="info">3</EmBadge>
      </div>
    </section>

    <section>
      <h2>Tag</h2>

      <p class="muted">Tinted — filled surface, semantic luminosity/50 background</p>

      <div class="row">
        <EmTag tone="tinted" variant="neutral">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag tone="tinted" variant="primary">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag tone="tinted" variant="success">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag tone="tinted" variant="error">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag tone="tinted" variant="warning">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag tone="tinted" variant="info">
          <PhPlusCircle :size="16" weight="fill" />
          chip text
        </EmTag>
      </div>

      <p class="muted">Outlined elevated (lg)</p>

      <div class="row">
        <EmTag elevation="lg" variant="neutral">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="lg" variant="primary">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="lg" variant="success">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="lg" variant="error">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="lg" variant="warning">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="lg" variant="info">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
      </div>

      <p class="muted">Outlined elevated (sm)</p>

      <div class="row">
        <EmTag elevation="sm" variant="neutral">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="sm" variant="primary">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="sm" variant="success">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag elevation="sm" variant="error">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
      </div>

      <p class="muted">Outlined flat — bordered, no shadow</p>

      <div class="row">
        <EmTag variant="neutral">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag variant="primary">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag variant="success">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>

        <EmTag variant="info">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
      </div>

      <p class="muted">Text only</p>

      <div class="row">
        <EmTag variant="neutral">vue</EmTag>
        <EmTag variant="primary">typescript</EmTag>
        <EmTag tone="tinted" variant="success">emerald</EmTag>
      </div>

      <p class="muted">Removable (EmTagClose)</p>

      <div class="row">
        <EmTag tone="tinted" variant="primary">
          design-system
          <EmTagClose>
            <PhX weight="bold" />
          </EmTagClose>
        </EmTag>

        <EmTag tone="tinted" variant="info">
          accessibility
          <EmTagClose>
            <PhX weight="bold" />
          </EmTagClose>
        </EmTag>

        <EmTag variant="error">
          archived
          <EmTagClose>
            <PhX weight="bold" />
          </EmTagClose>
        </EmTag>
      </div>
    </section>

    <section>
      <h2>List</h2>

      <div class="row" style="align-items: flex-start; gap: 24px;">
        <EmList style="width: 281px;">
          <EmListItem header>
            <EmListItemBody>
              <EmListItemTitle>Inbox</EmListItemTitle>
              <EmListItemSubtitle>hello@vuetifyjs.com</EmListItemSubtitle>
            </EmListItemBody>

            <EmListItemAction>
              <PhDotsThreeCircle :size="16" weight="duotone" />
            </EmListItemAction>
          </EmListItem>

          <EmListItem interactive>
            <EmListItemIcon>
              <PhChatsCircle :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>My Inbox</EmListItemTitle>

            <EmListItemBadge>12</EmListItemBadge>
          </EmListItem>

          <EmListItem interactive>
            <EmListItemIcon>
              <PhCalendarDots :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Scheduled</EmListItemTitle>

            <EmListItemBadge>3</EmListItemBadge>
          </EmListItem>

          <EmListItem interactive>
            <EmListItemIcon>
              <PhChatText :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Chats</EmListItemTitle>
          </EmListItem>

          <EmListItem active interactive>
            <EmListItemIcon>
              <PhArchive :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Archived</EmListItemTitle>
          </EmListItem>

          <EmListItem interactive>
            <EmListItemIcon>
              <PhCheckSquare :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Closed</EmListItemTitle>
          </EmListItem>

          <EmListSeparator />
          <EmListSubheader>Account</EmListSubheader>

          <EmListItem interactive>
            <EmListItemTitle>View Profile</EmListItemTitle>
          </EmListItem>

          <EmListItem disabled interactive>
            <EmListItemTitle>Sign Out</EmListItemTitle>
          </EmListItem>
        </EmList>

        <EmList style="width: 224px;">
          <EmListSubheader>Configurations</EmListSubheader>

          <EmListItem indent interactive>
            <EmListItemIcon>
              <PhNotePencil :size="14" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>To-do</EmListItemTitle>
          </EmListItem>

          <EmListItem active interactive>
            <EmListItemIcon>
              <PhShareNetwork :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Share</EmListItemTitle>
          </EmListItem>

          <EmListItem indent interactive>
            <EmListItemIcon>
              <PhChalkboardTeacher :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Leaderboard</EmListItemTitle>
          </EmListItem>

          <EmListItem indent interactive>
            <EmListItemIcon>
              <PhChartPieSlice :size="16" weight="duotone" />
            </EmListItemIcon>

            <EmListItemTitle>Analytics</EmListItemTitle>
          </EmListItem>
        </EmList>
      </div>
    </section>

    <section>
      <h2>Accordion</h2>

      <EmAccordion v-model="accordion" multiple style="width: 425px;">
        <EmAccordionItem value="overview">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretUp : PhCaretDown"
                  :size="14"
                  weight="bold"
                />
              </EmAccordionCue>

              <span style="flex: 1;">Accordion Title</span>
            </EmAccordionTrigger>
          </EmAccordionHeader>

          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>

        <EmAccordionItem value="tokens">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretUp : PhCaretDown"
                  :size="14"
                  weight="bold"
                />
              </EmAccordionCue>

              <span style="flex: 1;">Accordion Title</span>
            </EmAccordionTrigger>
          </EmAccordionHeader>

          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>

        <EmAccordionItem value="more">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretUp : PhCaretDown"
                  :size="14"
                  weight="bold"
                />
              </EmAccordionCue>

              <span style="flex: 1;">Accordion Title</span>
            </EmAccordionTrigger>
          </EmAccordionHeader>

          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>
      </EmAccordion>
    </section>

    <!-- ╔══════════════════ NAVIGATION ══════════════════╗ -->

    <h1 class="sink-group">Navigation</h1>

    <section>
      <h2>Breadcrumb</h2>

      <EmBreadcrumb>
        <EmBreadcrumbList>
          <EmBreadcrumbItem id="1" value="home">
            <EmBreadcrumbLink aria-label="Home" href="#">
              <PhHouseLine weight="duotone" />
            </EmBreadcrumbLink>
          </EmBreadcrumbItem>

          <EmBreadcrumbDivider>
            <PhCaretRight weight="light" />
          </EmBreadcrumbDivider>

          <EmBreadcrumbItem id="2" value="docs">
            <EmBreadcrumbLink href="#">
              <PhBookOpen weight="duotone" />
              Docs
            </EmBreadcrumbLink>
          </EmBreadcrumbItem>

          <EmBreadcrumbDivider>
            <PhCaretRight weight="light" />
          </EmBreadcrumbDivider>

          <EmBreadcrumbItem id="3" value="components">
            <EmBreadcrumbLink href="#">
              <PhCube weight="duotone" />
              Components
            </EmBreadcrumbLink>
          </EmBreadcrumbItem>

          <EmBreadcrumbDivider>
            <PhCaretRight weight="light" />
          </EmBreadcrumbDivider>

          <EmBreadcrumbItem id="4" value="more">
            <EmBreadcrumbLink aria-label="More" href="#">
              <PhDotsThree weight="duotone" />
            </EmBreadcrumbLink>
          </EmBreadcrumbItem>

          <EmBreadcrumbDivider>
            <PhCaretRight weight="light" />
          </EmBreadcrumbDivider>

          <EmBreadcrumbItem id="5" value="breadcrumbs">
            <EmBreadcrumbPage>Breadcrumbs</EmBreadcrumbPage>
          </EmBreadcrumbItem>
        </EmBreadcrumbList>
      </EmBreadcrumb>
    </section>

    <section>
      <h2>Tabs</h2>

      <p class="muted">variant=segmented (default, Figma-canonical)</p>

      <EmTabs v-model="tabsSegmented">
        <EmTabsList label="Account settings (segmented)">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
      </EmTabs>

      <p class="muted">variant=line</p>

      <EmTabs v-model="tabsLine" variant="line">
        <EmTabsList label="Account settings (line)">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
      </EmTabs>

      <p class="muted">variant=pill</p>

      <EmTabs v-model="tabsPill" variant="pill">
        <EmTabsList label="Account settings (pill)">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
      </EmTabs>

      <p class="muted">variant=boxed</p>

      <EmTabs v-model="tabsBoxed" variant="boxed">
        <EmTabsList label="Account settings (boxed)">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
      </EmTabs>

      <p class="muted">variant=vertical</p>

      <EmTabs v-model="tabsVertical" variant="vertical">
        <EmTabsList label="Account settings (vertical)">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
          <EmTabsItem disabled value="disabled">Disabled</EmTabsItem>
        </EmTabsList>

        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
        <EmTabsPanel value="disabled">Disabled tab content.</EmTabsPanel>
      </EmTabs>
    </section>

    <section>
      <h2>Stepper</h2>

      <p class="muted">orientation=horizontal (icon steps)</p>

      <EmStepper v-model="stepperHorizontal">
        <EmStepperItem value="date">
          <PhCalendarBlank weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Choose Date<EmStepperLabelDescription>Lorem Ipsum</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem value="house">
          <PhHouse weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Choose House<EmStepperLabelDescription>Lorem Ipsum</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem value="flight">
          <PhAirplaneTilt weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Choose Flight<EmStepperLabelDescription>Lorem Ipsum</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem value="destination">
          <PhMapPin weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Destination<EmStepperLabelDescription>Lorem Ipsum</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>
      </EmStepper>

      <p class="muted">orientation=vertical</p>

      <EmStepper v-model="stepperVertical" orientation="vertical">
        <EmStepperItem value="plan">
          <PhCalendarBlank weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Plan trip<EmStepperLabelDescription>Pick destination &amp; dates</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem value="book">
          <PhAirplaneTilt weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Book flight<EmStepperLabelDescription>Compare options</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem value="pack">
          <PhMapPin weight="duotone" />

          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Pack &amp; go<EmStepperLabelDescription>Almost there</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>
      </EmStepper>

      <p class="muted">numbered steps</p>

      <EmStepper v-model="stepperNumbered">
        <EmStepperItem numbered value="account">
          1
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Account<EmStepperLabelDescription>Create your account</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem numbered value="profile">
          2
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Profile<EmStepperLabelDescription>Tell us about you</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem numbered value="billing">
          3
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Billing<EmStepperLabelDescription>Add payment</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem numbered value="done">
          4
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Done<EmStepperLabelDescription>You&apos;re all set</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>
      </EmStepper>

      <p class="muted">error step</p>

      <EmStepper v-model="stepperError">
        <EmStepperItem numbered value="cart">
          1
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Cart<EmStepperLabelDescription>Review items</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem error numbered value="payment">
          2
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Payment<EmStepperLabelDescription>Card declined</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>

        <EmStepperSeparator />

        <EmStepperItem disabled numbered value="confirm">
          3
          <template #completed>
            <PhCheck weight="duotone" />
          </template>

          <template #label>
            <EmStepperLabel>Confirm<EmStepperLabelDescription>Review &amp; submit</EmStepperLabelDescription></EmStepperLabel>
          </template>
        </EmStepperItem>
      </EmStepper>
    </section>

    <section>
      <h2>Pagination</h2>

      <p class="muted">Full — first/prev/numbers/ellipsis/last/next</p>

      <EmPagination v-model="paginationFull" :items-per-page="1" :size="20" :total-visible="5">
        <EmPaginationPrev>
          <PhCaretLeft weight="duotone" />
        </EmPaginationPrev>

        <template v-for="page in 5" :key="page">
          <EmPaginationItem :value="page">{{ page }}</EmPaginationItem>
        </template>

        <EmPaginationEllipsis>
          <PhDotsThree weight="duotone" />
        </EmPaginationEllipsis>

        <EmPaginationItem :value="20">20</EmPaginationItem>

        <EmPaginationNext>
          <PhCaretRight weight="duotone" />
        </EmPaginationNext>
      </EmPagination>

      <p class="muted">Simple — prev/next only</p>

      <EmPagination v-model="paginationSimple" :items-per-page="1" :size="10">
        <EmPaginationPrev aria-label="Previous page">
          <PhCaretLeft weight="duotone" />
        </EmPaginationPrev>

        <span style="font-size: 12px; color: var(--emerald-neutral-600);">
          Page {{ paginationSimple }} of 10
        </span>

        <EmPaginationNext aria-label="Next page">
          <PhCaretRight weight="duotone" />
        </EmPaginationNext>
      </EmPagination>
    </section>

    <section>
      <h2>Menu</h2>

      <div class="row">
        <EmMenu v-model="menuOpen">
          <EmMenuActivator>
            <EmButton variant="secondary">
              <EmButtonContent>Open menu</EmButtonContent>

              <EmButtonAppend>
                <PhCaretDown :size="12" weight="bold" />
              </EmButtonAppend>
            </EmButton>
          </EmMenuActivator>

          <EmMenuContent>
            <EmMenuLabel>Account</EmMenuLabel>

            <EmMenuItem>
              <EmMenuItemIcon>
                <PhUser weight="duotone" />
              </EmMenuItemIcon>
              Profile
              <EmMenuItemShortcut>⌘P</EmMenuItemShortcut>
            </EmMenuItem>

            <EmMenuItem active>
              <EmMenuItemIcon>
                <PhGear weight="duotone" />
              </EmMenuItemIcon>
              Settings
              <EmMenuItemShortcut>⌘,</EmMenuItemShortcut>
            </EmMenuItem>

            <EmMenuItem>
              <EmMenuItemIcon>
                <PhCopy weight="duotone" />
              </EmMenuItemIcon>
              Duplicate
              <EmMenuItemShortcut>⌘D</EmMenuItemShortcut>
            </EmMenuItem>

            <EmMenuSeparator />

            <EmMenuLabel>Frameworks</EmMenuLabel>
            <EmMenuItem>Vuetify</EmMenuItem>
            <EmMenuItem>Shadcn</EmMenuItem>
            <EmMenuItem disabled>Radix UI (disabled)</EmMenuItem>

            <EmMenuSeparator />

            <EmMenuItem destructive>
              <EmMenuItemIcon>
                <PhTrash weight="duotone" />
              </EmMenuItemIcon>
              Delete account
              <EmMenuItemShortcut>⌘⌫</EmMenuItemShortcut>
            </EmMenuItem>
          </EmMenuContent>
        </EmMenu>

        <EmMenu v-model="menuRowOpen">
          <EmMenuActivator>
            <EmButton aria-label="Row actions" variant="ghost">
              <PhDotsThreeOutlineVertical :size="14" weight="duotone" />
            </EmButton>
          </EmMenuActivator>

          <EmMenuContent>
            <EmMenuItem>
              <EmMenuItemIcon><PhPencilSimple weight="duotone" /></EmMenuItemIcon>
              Edit
            </EmMenuItem>

            <EmMenuItem>
              <EmMenuItemIcon><PhCopy weight="duotone" /></EmMenuItemIcon>
              Duplicate
            </EmMenuItem>

            <EmMenuSeparator />

            <EmMenuItem destructive>
              <EmMenuItemIcon><PhTrash weight="duotone" /></EmMenuItemIcon>
              Delete
            </EmMenuItem>
          </EmMenuContent>
        </EmMenu>
      </div>
    </section>

    <!-- ╔══════════════════ FORMS ══════════════════╗ -->

    <h1 class="sink-group">Forms</h1>

    <section>
      <h2>TextField</h2>

      <p class="muted">States</p>

      <div class="row" style="align-items: flex-start;">
        <EmTextField v-model="textFieldDefault" style="width: 217px;">
          <EmTextFieldLabel>Name</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Enter your name" />
          <EmTextFieldDescription>Your display name across the app.</EmTextFieldDescription>
        </EmTextField>

        <EmTextField style="width: 217px;">
          <EmTextFieldLabel>Empty</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Enter your email" />
        </EmTextField>

        <EmTextField :disabled="true" style="width: 217px;">
          <EmTextFieldLabel>Disabled</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Cannot edit" />
        </EmTextField>

        <EmTextField :readonly="true" style="width: 217px;">
          <EmTextFieldLabel>Readonly</EmTextFieldLabel>
          <EmTextFieldControl placeholder="readonly@vuetifyjs.com" />
        </EmTextField>

        <EmTextField
          error
          :error-messages="['Email is required']"
          style="width: 217px;"
          validate-on="eager"
        >
          <EmTextFieldLabel>Invalid</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Enter your email" />

          <EmTextFieldError v-slot="{ errors }">
            {{ errors[0] }}
          </EmTextFieldError>
        </EmTextField>
      </div>

      <p class="muted">Prepend / Append icon</p>

      <div class="row" style="align-items: flex-start;">
        <EmTextField v-model="textFieldSearch" style="width: 280px;">
          <EmTextFieldLabel>Search</EmTextFieldLabel>

          <EmTextFieldControl placeholder="Find anything…">
            <EmTextFieldPrepend>
              <PhMagnifyingGlass :size="14" weight="duotone" />
            </EmTextFieldPrepend>
          </EmTextFieldControl>
        </EmTextField>

        <EmTextField v-model="textFieldPassword" style="width: 280px;" type="password">
          <EmTextFieldLabel>Password</EmTextFieldLabel>
          <EmTextFieldControl placeholder="••••••••" />
          <EmTextFieldDescription>At least 8 characters.</EmTextFieldDescription>
        </EmTextField>
      </div>

      <p class="muted">Clear button + counter</p>

      <div class="row" style="align-items: flex-start;">
        <EmTextField v-model="textFieldClearable" style="width: 280px;">
          <EmTextFieldLabel>Clearable</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Type something" />
          <EmTextFieldClear />
        </EmTextField>

        <EmTextField v-model="textFieldCounter" style="width: 280px;">
          <EmTextFieldLabel>With counter</EmTextFieldLabel>
          <EmTextFieldControl :maxlength="40" placeholder="Up to 40 chars" />
          <EmTextFieldCounter :max="40" />
        </EmTextField>
      </div>
    </section>

    <section>
      <h2>Textarea</h2>

      <div class="row" style="align-items: flex-start;">
        <EmTextarea v-model="textareaDefault" style="width: 280px;">
          <EmTextareaLabel>Bio</EmTextareaLabel>
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
          <EmTextareaDescription>Markdown is supported.</EmTextareaDescription>
        </EmTextarea>

        <EmTextarea style="width: 280px;">
          <EmTextareaLabel>Empty</EmTextareaLabel>
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
        </EmTextarea>

        <EmTextarea disabled style="width: 280px;">
          <EmTextareaLabel>Disabled</EmTextareaLabel>
          <EmTextareaControl placeholder="Cannot edit" :rows="4" />
        </EmTextarea>

        <EmTextarea
          error
          :error-messages="['Bio is required']"
          style="width: 280px;"
          validate-on="eager"
        >
          <EmTextareaLabel>Invalid</EmTextareaLabel>
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />

          <EmTextareaError v-slot="{ errors }">
            {{ errors[0] }}
          </EmTextareaError>
        </EmTextarea>

        <EmTextarea v-model="textareaCounter" style="width: 280px;">
          <EmTextareaLabel>With counter</EmTextareaLabel>
          <EmTextareaControl :maxlength="200" placeholder="Up to 200 chars" :rows="4" />
          <EmTextareaCounter :max="200" />
        </EmTextarea>
      </div>
    </section>

    <section>
      <h2>Checkbox</h2>

      <p class="muted">Sizes — unchecked / checked / indeterminate / disabled</p>

      <div class="row" style="align-items: center; gap: 16px;">
        <EmCheckbox :model-value="false" size="sm">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :model-value="false" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :model-value="false" size="lg">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :model-value="true" size="sm">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :model-value="true" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :model-value="true" size="lg">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox :indeterminate="true" :model-value="false" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox disabled :model-value="false" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>

        <EmCheckbox disabled :model-value="true" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>
      </div>

      <p class="muted">With label (EmCheckboxLabel)</p>

      <div class="row" style="align-items: center; gap: 24px;">
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <EmCheckbox v-model="checkboxModel">
            <EmCheckboxIndicator />
          </EmCheckbox>

          <EmCheckboxLabel>Accept terms &amp; conditions</EmCheckboxLabel>
        </div>

        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <EmCheckbox disabled :model-value="true">
            <EmCheckboxIndicator />
          </EmCheckbox>

          <EmCheckboxLabel>Disabled (checked)</EmCheckboxLabel>
        </div>
      </div>

      <p class="muted">Checkbox group with select-all</p>

      <EmCheckboxGroup v-model="checkboxAll" name="permissions">
        <div style="display: flex; align-items: center; gap: 8px;">
          <EmCheckboxSelectAll />
          <EmCheckboxLabel>Select all permissions</EmCheckboxLabel>
        </div>

        <div style="margin-left: 16px; display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'read'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Read</EmCheckboxLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'write'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Write</EmCheckboxLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'admin'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Admin</EmCheckboxLabel>
          </div>
        </div>
      </EmCheckboxGroup>

      <p class="muted">Indeterminate group (some selected)</p>

      <EmCheckboxGroup v-model="checkboxIndeterminate" name="features">
        <div style="display: flex; align-items: center; gap: 8px;">
          <EmCheckboxSelectAll />
          <EmCheckboxLabel>Features</EmCheckboxLabel>
        </div>

        <div style="margin-left: 16px; display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'a'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Feature A</EmCheckboxLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'b'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Feature B</EmCheckboxLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmCheckbox :value="'c'">
              <EmCheckboxIndicator />
            </EmCheckbox>

            <EmCheckboxLabel>Feature C</EmCheckboxLabel>
          </div>
        </div>
      </EmCheckboxGroup>
    </section>

    <section>
      <h2>Radio</h2>

      <p class="muted">Sizes — unchecked (sm / md / lg)</p>

      <EmRadioGroup>
        <div class="row" style="align-items: center; gap: 16px;">
          <EmRadio size="sm" :value="'sm'">
            <EmRadioIndicator />
          </EmRadio>

          <EmRadio size="md" :value="'md'">
            <EmRadioIndicator />
          </EmRadio>

          <EmRadio size="lg" :value="'lg'">
            <EmRadioIndicator />
          </EmRadio>
        </div>
      </EmRadioGroup>

      <p class="muted">Sizes — checked (sm / md / lg)</p>

      <EmRadioGroup :model-value="'md'">
        <div class="row" style="align-items: center; gap: 16px;">
          <EmRadio size="sm" :value="'sm'">
            <EmRadioIndicator />
          </EmRadio>

          <EmRadio size="md" :value="'md'">
            <EmRadioIndicator />
          </EmRadio>

          <EmRadio size="lg" :value="'lg'">
            <EmRadioIndicator />
          </EmRadio>
        </div>
      </EmRadioGroup>

      <p class="muted">Disabled</p>

      <EmRadioGroup disabled :model-value="'a'">
        <EmRadio size="md" :value="'a'">
          <EmRadioIndicator />
        </EmRadio>
      </EmRadioGroup>

      <p class="muted">Group with labels (horizontal)</p>

      <EmRadioGroup v-model="radioHorizontal" name="framework">
        <div style="display: flex; gap: 16px; flex-wrap: wrap;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmRadio :value="'vue'">
              <EmRadioIndicator />
            </EmRadio>

            <EmRadioLabel>Vue</EmRadioLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmRadio :value="'react'">
              <EmRadioIndicator />
            </EmRadio>

            <EmRadioLabel>React</EmRadioLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmRadio :value="'svelte'">
              <EmRadioIndicator />
            </EmRadio>

            <EmRadioLabel>Svelte</EmRadioLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmRadio disabled :value="'angular'">
              <EmRadioIndicator />
            </EmRadio>

            <EmRadioLabel>Angular (disabled)</EmRadioLabel>
          </div>
        </div>
      </EmRadioGroup>
    </section>

    <section>
      <h2>Switch</h2>

      <p class="muted">Sizes — off / on / disabled</p>

      <div class="row" style="align-items: center; gap: 16px;">
        <EmSwitch :model-value="false" size="sm">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch :model-value="false" size="md">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch :model-value="false" size="lg">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch :model-value="true" size="sm">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch :model-value="true" size="md">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch :model-value="true" size="lg">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch disabled :model-value="false">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>

        <EmSwitch disabled :model-value="true">
          <EmSwitchTrack>
            <EmSwitchThumb />
          </EmSwitchTrack>
        </EmSwitch>
      </div>

      <p class="muted">With label (EmSwitchLabel)</p>

      <div class="row" style="align-items: center; gap: 24px;">
        <div style="display: inline-flex; align-items: center; gap: 8px;">
          <EmSwitch v-model="switchSingle">
            <EmSwitchTrack>
              <EmSwitchThumb />
            </EmSwitchTrack>
          </EmSwitch>

          <EmSwitchLabel>Enable notifications</EmSwitchLabel>
        </div>
      </div>

      <p class="muted">Switch group</p>

      <EmSwitchGroup v-model="switchGroup" name="channels">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmSwitch :value="'email'">
              <EmSwitchTrack>
                <EmSwitchThumb />
              </EmSwitchTrack>
            </EmSwitch>

            <EmSwitchLabel>Email</EmSwitchLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmSwitch :value="'sms'">
              <EmSwitchTrack>
                <EmSwitchThumb />
              </EmSwitchTrack>
            </EmSwitch>

            <EmSwitchLabel>SMS</EmSwitchLabel>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 8px;">
            <EmSwitch :value="'push'">
              <EmSwitchTrack>
                <EmSwitchThumb />
              </EmSwitchTrack>
            </EmSwitch>

            <EmSwitchLabel>Push</EmSwitchLabel>
          </div>
        </div>
      </EmSwitchGroup>
    </section>

    <section>
      <h2>Slider</h2>

      <div class="stack">
        <div class="em-slider-row">
          <span class="em-slider-label">Default</span>

          <EmSlider v-model="sliderSingle">
            <EmSliderTrack />
            <EmSliderThumb aria-label="Value" />
          </EmSlider>

          <span class="em-slider-value">{{ sliderSingle }}</span>
        </div>

        <div class="em-slider-row">
          <span class="em-slider-label">Fill</span>

          <EmSlider v-model="sliderSingle">
            <EmSliderTrack>
              <EmSliderRange />
            </EmSliderTrack>

            <EmSliderThumb aria-label="Value" />
          </EmSlider>

          <span class="em-slider-value">{{ sliderSingle }}</span>
        </div>

        <div class="em-slider-row">
          <span class="em-slider-label">Range</span>

          <EmSlider v-model="sliderRange">
            <EmSliderTrack>
              <EmSliderRange />
            </EmSliderTrack>

            <EmSliderThumb aria-label="Min" />
            <EmSliderThumb aria-label="Max" />
          </EmSlider>

          <span class="em-slider-value">{{ sliderRange.join(' – ') }}</span>
        </div>

        <div class="em-slider-row">
          <span class="em-slider-label">Ticks</span>

          <EmSlider v-model="sliderTicks" :step="10">
            <EmSliderTrack>
              <EmSliderRange />
            </EmSliderTrack>

            <EmSliderTicks :step="10" />
            <EmSliderThumb aria-label="Value" />
          </EmSlider>

          <span class="em-slider-value">{{ sliderTicks }}</span>
        </div>

        <div class="em-slider-row">
          <span class="em-slider-label">Tooltip</span>

          <EmSlider v-model="sliderTooltip">
            <EmSliderTrack>
              <EmSliderRange />
            </EmSliderTrack>

            <EmSliderThumb aria-label="Value">
              <EmSliderTooltip always />
            </EmSliderThumb>
          </EmSlider>

          <span class="em-slider-value">{{ sliderTooltip }}</span>
        </div>

        <div class="em-slider-row">
          <span class="em-slider-label">Disabled</span>

          <EmSlider :disabled="true" :model-value="50">
            <EmSliderTrack>
              <EmSliderRange />
            </EmSliderTrack>

            <EmSliderThumb aria-label="Value" />
          </EmSlider>

          <span class="em-slider-value">50</span>
        </div>
      </div>
    </section>

    <section>
      <h2>Select</h2>

      <p class="muted">Single</p>

      <div class="row" style="align-items: flex-start;">
        <EmSelect v-model="selectSingle" style="width: 217px;">
          <EmSelectActivator>
            <EmSelectValue v-slot="{ selectedValue }">{{ frameworkLabels[selectedValue as string] ?? selectedValue }}</EmSelectValue>
            <EmSelectPlaceholder>Select your framework</EmSelectPlaceholder>
            <PhCaretDown :size="14" weight="bold" />
          </EmSelectActivator>

          <EmSelectContent>
            <EmSelectItem :value="'vuetify'">Vuetify</EmSelectItem>
            <EmSelectItem :value="'shadcn'">Shadcn</EmSelectItem>
            <EmSelectItem :value="'baseui'">Base UI</EmSelectItem>
            <EmSelectItem :value="'rekaui'">Reka UI</EmSelectItem>
          </EmSelectContent>
        </EmSelect>

        <EmSelect v-model="selectDisabled" disabled style="width: 217px;">
          <EmSelectActivator>
            <EmSelectValue v-slot="{ selectedValue }">{{ frameworkLabels[selectedValue as string] ?? selectedValue }}</EmSelectValue>
            <EmSelectPlaceholder>Disabled select</EmSelectPlaceholder>
            <PhCaretDown :size="14" weight="bold" />
          </EmSelectActivator>

          <EmSelectContent>
            <EmSelectItem :value="'vuetify'">Vuetify</EmSelectItem>
          </EmSelectContent>
        </EmSelect>
      </div>

      <p class="muted">Multiple (with chips)</p>

      <EmSelect v-model="selectMulti" multiple style="width: 360px;">
        <EmSelectActivator>
          <EmSelectChips :formatter="(value) => frameworkLabels[value as string] ?? String(value)" />
          <EmSelectPlaceholder>Pick frameworks</EmSelectPlaceholder>
          <PhCaretDown :size="14" weight="bold" />
        </EmSelectActivator>

        <EmSelectContent>
          <EmSelectItem :value="'vuetify'">Vuetify</EmSelectItem>
          <EmSelectItem :value="'shadcn'">Shadcn</EmSelectItem>
          <EmSelectItem :value="'baseui'">Base UI</EmSelectItem>
          <EmSelectItem :value="'rekaui'">Reka UI</EmSelectItem>
        </EmSelectContent>
      </EmSelect>
    </section>

    <section>
      <h2>AutoComplete</h2>

      <p class="muted">Single</p>

      <EmAutoComplete v-model="autoCompleteSingle" style="width: 280px;">
        <EmAutoCompleteControl>
          <EmAutoCompleteInput placeholder="Search your framework" />
          <EmAutoCompleteCue><PhCaretDown :size="14" weight="bold" /></EmAutoCompleteCue>
        </EmAutoCompleteControl>

        <EmAutoCompleteContent eager>
          <EmAutoCompleteItem :value="'Vuetify'">Vuetify</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Vue'">Vue</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Prime Vue'">Prime Vue</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Shadcn'">Shadcn</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Base UI'">Base UI</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Reka UI'">Reka UI</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Radix UI'">Radix UI</EmAutoCompleteItem>
          <EmAutoCompleteEmpty>No matches</EmAutoCompleteEmpty>
        </EmAutoCompleteContent>
      </EmAutoComplete>

      <p class="muted">Multiple (with chips)</p>

      <EmAutoComplete v-model="autoCompleteMulti" multiple style="width: 360px;">
        <EmAutoCompleteControl>
          <EmAutoCompleteChips />
          <EmAutoCompleteInput placeholder="Add frameworks…" />
          <EmAutoCompleteCue><PhCaretDown :size="14" weight="bold" /></EmAutoCompleteCue>
        </EmAutoCompleteControl>

        <EmAutoCompleteContent eager>
          <EmAutoCompleteItem :value="'Vuetify'">Vuetify</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Vue'">Vue</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Prime Vue'">Prime Vue</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Shadcn'">Shadcn</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Base UI'">Base UI</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'Reka UI'">Reka UI</EmAutoCompleteItem>
          <EmAutoCompleteEmpty>No matches</EmAutoCompleteEmpty>
        </EmAutoCompleteContent>
      </EmAutoComplete>
    </section>

    <section>
      <h2>DatePicker</h2>

      <p class="muted">Visual scaffold only — replaced once v0 ships <code>createCalendar</code>.</p>

      <EmDatePicker v-model="datePickerValue">
        <EmDatePickerCalendar>
          <EmDatePickerHeader>
            <EmButton aria-label="Previous month" size="sm" variant="ghost">
              <PhCaretLeft :size="12" weight="duotone" />
            </EmButton>

            <span>July 2026</span>

            <EmButton aria-label="Next month" size="sm" variant="ghost">
              <PhCaretRight :size="12" weight="duotone" />
            </EmButton>
          </EmDatePickerHeader>

          <EmDatePickerGrid>
            <EmDatePickerCell v-for="weekday in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="weekday" weekday>
              {{ weekday }}
            </EmDatePickerCell>

            <EmDatePickerCell v-for="day in 31" :key="`jul-${day}`" :selected="day === 22" :today="day === 22">
              {{ day }}
            </EmDatePickerCell>

            <EmDatePickerCell v-for="day in 4" :key="`aug-${day}`" outside>
              {{ day }}
            </EmDatePickerCell>
          </EmDatePickerGrid>
        </EmDatePickerCalendar>
      </EmDatePicker>
    </section>

    <section>
      <h2>Upload</h2>

      <p class="muted">Empty</p>

      <EmUpload v-model="uploadFiles" multiple style="width: 420px;">
        <EmUploadDropzone>
          <PhFileArrowUp :size="28" weight="regular" />
          <strong>Drag and drop your files</strong>
          <span class="muted" style="margin: 0;">or click to browse</span>
        </EmUploadDropzone>
      </EmUpload>

      <p class="muted">With file list (EmUploadList / EmUploadItem)</p>

      <EmUpload v-model="uploadFilledFiles" multiple style="width: 420px;">
        <EmUploadDropzone>
          <PhFileArrowUp :size="28" weight="regular" />
          <strong>Drag and drop your files</strong>
          <span class="muted" style="margin: 0;">or click to browse</span>
        </EmUploadDropzone>

        <EmUploadList>
          <EmUploadItem
            v-for="file in uploadFilledFiles"
            :key="file.name"
            :name="file.name"
            :size="file.size"
          />
        </EmUploadList>
      </EmUpload>
    </section>

    <section>
      <h2>Form</h2>

      <p class="muted">Composed with EmForm + EmFormGroup + EmFormField (no raw inputs)</p>

      <EmForm v-model="formValid" style="width: 360px;">
        <EmFormGroup>
          <EmFormField>
            <EmTextField v-model="formEmail" :rules="[(v: string) => Boolean(v) || 'Email required']" type="email" validate-on="blur">
              <EmTextFieldLabel>Email</EmTextFieldLabel>

              <EmTextFieldControl placeholder="you@vuetifyjs.com">
                <EmTextFieldPrepend>
                  <PhEnvelope :size="14" weight="duotone" />
                </EmTextFieldPrepend>
              </EmTextFieldControl>

              <EmTextFieldDescription>We&apos;ll never share your email.</EmTextFieldDescription>

              <EmTextFieldError v-slot="{ errors }">
                {{ errors[0] }}
              </EmTextFieldError>
            </EmTextField>
          </EmFormField>

          <EmFormField>
            <EmTextField v-model="formPassword" :rules="[(v: string) => v?.length >= 8 || 'At least 8 characters']" type="password" validate-on="blur">
              <EmTextFieldLabel>Password</EmTextFieldLabel>
              <EmTextFieldControl placeholder="••••••••" />

              <EmTextFieldError v-slot="{ errors }">
                {{ errors[0] }}
              </EmTextFieldError>
            </EmTextField>
          </EmFormField>

          <EmFormField>
            <EmTextarea v-model="formBio">
              <EmTextareaLabel>Bio</EmTextareaLabel>
              <EmTextareaControl :maxlength="200" placeholder="Tell us about yourself" :rows="3" />
              <EmTextareaCounter :max="200" />
            </EmTextarea>
          </EmFormField>

          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <EmButton type="reset" variant="ghost" @click="onFormReset">Reset</EmButton>
            <EmButton type="submit">Submit</EmButton>
          </div>
        </EmFormGroup>
      </EmForm>

      <p class="muted">Form valid: <strong>{{ String(formValid) }}</strong></p>
    </section>

    <!-- ╔══════════════════ FEEDBACK ══════════════════╗ -->

    <h1 class="sink-group">Feedback</h1>

    <section>
      <h2>Alert</h2>

      <p class="muted">Variants</p>

      <div class="stack" style="max-width: 520px;">
        <EmAlert>
          <EmAlertIcon>
            <PhInfo :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Default alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>

        <EmAlert variant="error">
          <EmAlertIcon>
            <PhXCircle :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Error alert</EmAlertTitle>
            <EmAlertDescription>Something went wrong. Please try again.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>

        <EmAlert variant="success">
          <EmAlertIcon>
            <PhCheckCircle :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Success alert</EmAlertTitle>
            <EmAlertDescription>Your changes have been saved.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>

        <EmAlert variant="info">
          <EmAlertIcon>
            <PhInfo :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Info alert</EmAlertTitle>
            <EmAlertDescription>Just so you know — this is informational.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>

        <EmAlert variant="warning">
          <EmAlertIcon>
            <PhWarning :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Warning alert</EmAlertTitle>
            <EmAlertDescription>Watch your step — proceed with caution.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>

        <EmAlert variant="neutral">
          <EmAlertIcon>
            <PhAirplaneTilt :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Neutral alert</EmAlertTitle>
            <EmAlertDescription>For low-priority context messages.</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
      </div>

      <p class="muted">Title only (no description)</p>

      <div class="stack" style="max-width: 520px;">
        <EmAlert variant="success">
          <EmAlertIcon>
            <PhCheckCircle :size="20" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Saved successfully</EmAlertTitle>
          </EmAlertBody>
        </EmAlert>
      </div>

      <p class="muted">Dismissible (EmAlertClose)</p>

      <div class="stack" style="max-width: 520px;">
        <EmAlert v-if="!alertDismissed" variant="info">
          <EmAlertIcon>
            <PhInfo :size="24" weight="regular" />
          </EmAlertIcon>

          <EmAlertBody>
            <EmAlertTitle>Heads up</EmAlertTitle>
            <EmAlertDescription>You can dismiss this alert with the close button.</EmAlertDescription>
          </EmAlertBody>

          <EmAlertClose @click="alertDismissed = true">
            <PhX :size="14" weight="bold" />
          </EmAlertClose>
        </EmAlert>

        <EmButton v-if="alertDismissed" size="sm" variant="ghost" @click="alertDismissed = false">
          Restore alert
        </EmButton>
      </div>
    </section>

    <section>
      <h2>Loading</h2>

      <p class="muted">Sizes</p>

      <div class="row">
        <EmLoading size="sm">Loading…</EmLoading>
        <EmLoading size="md">Loading…</EmLoading>
        <EmLoading size="lg">Loading…</EmLoading>
      </div>

      <p class="muted">Spinner only (no label)</p>

      <div class="row">
        <EmLoading aria-label="Loading" size="sm" />
        <EmLoading aria-label="Loading" size="md" />
        <EmLoading aria-label="Loading" size="lg" />
      </div>
    </section>

    <section>
      <h2>Progress</h2>

      <p class="muted">Linear</p>

      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
        <EmProgress size="sm" :value="30">
          <EmProgressTrack>
            <EmProgressFill />
          </EmProgressTrack>
        </EmProgress>

        <EmProgress v-slot="{ value }" size="md" :value="60">
          <EmProgressTrack>
            <EmProgressFill>
              <EmProgressValue inside>{{ value }}</EmProgressValue>
            </EmProgressFill>
          </EmProgressTrack>
        </EmProgress>

        <EmProgress v-slot="{ value }" :max="100" size="md" :value="80">
          <EmProgressTrack>
            <EmProgressFill>
              <EmProgressValue inside>{{ value }}</EmProgressValue>
            </EmProgressFill>
          </EmProgressTrack>

          <EmProgressValue>100</EmProgressValue>
        </EmProgress>
      </div>

      <p class="muted">Circular</p>

      <div class="row">
        <EmProgressCircular :size="24" :value="25" />
        <EmProgressCircular :size="32" :value="50" />
        <EmProgressCircular :size="48" :value="75" />
        <EmProgressCircular indeterminate :size="48" />
      </div>
    </section>

    <section>
      <h2>Toast</h2>

      <p class="muted">Variants</p>

      <div class="stack" style="max-width: 360px;">
        <EmToast>
          <EmToastIcon>
            <PhInfo :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Default toast</EmToastTitle>
            <EmToastDescription>Violet/primary notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="error">
          <EmToastIcon>
            <PhXCircle :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Error toast</EmToastTitle>
            <EmToastDescription>Red notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="success">
          <EmToastIcon>
            <PhCheckCircle :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Success toast</EmToastTitle>
            <EmToastDescription>Green notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="info">
          <EmToastIcon>
            <PhInfo :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Info toast</EmToastTitle>
            <EmToastDescription>Blue notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="warning">
          <EmToastIcon>
            <PhWarning :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Warning toast</EmToastTitle>
            <EmToastDescription>Amber notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="neutral">
          <EmToastIcon>
            <PhCheckCircle :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Neutral toast</EmToastTitle>
            <EmToastDescription>Neutral notification state.</EmToastDescription>
          </EmToastBody>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>
      </div>

      <p class="muted">With action (EmToastAction)</p>

      <div class="stack" style="max-width: 360px;">
        <EmToast variant="info">
          <EmToastIcon>
            <PhInfo :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Update available</EmToastTitle>
            <EmToastDescription>v0.3.0 is ready to install.</EmToastDescription>
          </EmToastBody>

          <EmToastAction>Install</EmToastAction>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>

        <EmToast variant="error">
          <EmToastIcon>
            <PhXCircle :size="16" weight="duotone" />
          </EmToastIcon>

          <EmToastBody>
            <EmToastTitle>Failed to save</EmToastTitle>
            <EmToastDescription>Network error.</EmToastDescription>
          </EmToastBody>

          <EmToastAction>Retry</EmToastAction>

          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>
      </div>

      <p class="muted">EmToastStack — fixed bottom-right (look at the corner)</p>

      <div style="position: relative; height: 220px; border: 1px dashed rgb(var(--emerald-neutral-channels) / 0.2); border-radius: 6px;">
        <p class="muted" style="padding: 12px;">A relative parent — toasts portal-like at the bottom-right of this box.</p>

        <EmToastStack style="position: absolute;">
          <EmToast v-if="toastStackVisible.update" variant="info">
            <EmToastIcon>
              <PhInfo :size="16" weight="duotone" />
            </EmToastIcon>

            <EmToastBody>
              <EmToastTitle>Update available</EmToastTitle>
              <EmToastDescription>Restart to apply.</EmToastDescription>
            </EmToastBody>

            <EmToastAction>Restart</EmToastAction>

            <EmToastClose @click="onToastStack('update')">
              <PhX :size="12" weight="bold" />
            </EmToastClose>
          </EmToast>

          <EmToast v-if="toastStackVisible.saved" variant="success">
            <EmToastIcon>
              <PhCheckCircle :size="16" weight="duotone" />
            </EmToastIcon>

            <EmToastBody>
              <EmToastTitle>Saved</EmToastTitle>
              <EmToastDescription>Your design is up to date.</EmToastDescription>
            </EmToastBody>

            <EmToastClose @click="onToastStack('saved')">
              <PhX :size="12" weight="bold" />
            </EmToastClose>
          </EmToast>

          <EmToast v-if="toastStackVisible.failed" variant="error">
            <EmToastIcon>
              <PhXCircle :size="16" weight="duotone" />
            </EmToastIcon>

            <EmToastBody>
              <EmToastTitle>Sync failed</EmToastTitle>
              <EmToastDescription>Check connection.</EmToastDescription>
            </EmToastBody>

            <EmToastAction>Retry</EmToastAction>

            <EmToastClose @click="onToastStack('failed')">
              <PhX :size="12" weight="bold" />
            </EmToastClose>
          </EmToast>
        </EmToastStack>
      </div>
    </section>

    <!-- ╔══════════════════ OVERLAY ══════════════════╗ -->

    <h1 class="sink-group">Overlay</h1>

    <section>
      <h2>Tooltip</h2>

      <p class="muted">Positions × variants — light = white surface / dark text; dark = inverse</p>

      <div class="row" style="gap: 24px;">
        <EmTooltip>
          <EmTooltipContent position-area="top">Top (light)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton variant="secondary">Top</EmButton>
          </EmTooltipActivator>
        </EmTooltip>

        <EmTooltip>
          <EmTooltipContent position-area="right">Right (light)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton variant="secondary">Right</EmButton>
          </EmTooltipActivator>
        </EmTooltip>

        <EmTooltip>
          <EmTooltipContent position-area="bottom">Bottom (light)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton variant="secondary">Bottom</EmButton>
          </EmTooltipActivator>
        </EmTooltip>

        <EmTooltip>
          <EmTooltipContent position-area="left">Left (light)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton variant="secondary">Left</EmButton>
          </EmTooltipActivator>
        </EmTooltip>

        <EmTooltip>
          <EmTooltipContent position-area="top" variant="dark">Top (dark)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton>Dark top</EmButton>
          </EmTooltipActivator>
        </EmTooltip>

        <EmTooltip>
          <EmTooltipContent position-area="bottom" variant="dark">Bottom (dark)</EmTooltipContent>

          <EmTooltipActivator>
            <EmButton>Dark bottom</EmButton>
          </EmTooltipActivator>
        </EmTooltip>
      </div>
    </section>

    <section>
      <h2>Dialog</h2>

      <p class="muted">Sizes — sm / md / lg / fullscreen</p>

      <div class="row">
        <EmButton variant="secondary" @click="dialogSmOpen = true">Open small</EmButton>
        <EmButton variant="secondary" @click="dialogMdOpen = true">Open medium</EmButton>
        <EmButton variant="secondary" @click="dialogLgOpen = true">Open large</EmButton>
        <EmButton variant="secondary" @click="dialogFullOpen = true">Open fullscreen</EmButton>
        <EmButton @click="dialogFormOpen = true">Open form dialog</EmButton>
      </div>

      <EmDialog v-model="dialogSmOpen">
        <EmDialogContent size="sm">
          <EmDialogHeader>
            <EmDialogTitle>Small dialog</EmDialogTitle>
          </EmDialogHeader>

          <EmDialogBody>
            <EmDialogDescription>
              A compact sm-size dialog suitable for confirmations.
            </EmDialogDescription>
          </EmDialogBody>

          <EmDialogFooter>
            <EmDialogClose renderless>
              <EmButton variant="secondary">Cancel</EmButton>
            </EmDialogClose>

            <EmDialogClose renderless>
              <EmButton>Confirm</EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>

      <EmDialog v-model="dialogMdOpen">
        <EmDialogContent size="md">
          <EmDialogHeader>
            <EmDialogTitle>Delete design system?</EmDialogTitle>
          </EmDialogHeader>

          <EmDialogBody>
            <EmDialogDescription>
              This will permanently remove Emerald and all its tokens. Cannot be undone.
            </EmDialogDescription>
          </EmDialogBody>

          <EmDialogFooter>
            <EmDialogClose renderless>
              <EmButton variant="secondary">Cancel</EmButton>
            </EmDialogClose>

            <EmDialogClose renderless>
              <EmButton variant="destructive">Delete</EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>

      <EmDialog v-model="dialogLgOpen">
        <EmDialogContent size="lg">
          <EmDialogHeader>
            <EmDialogTitle>Large dialog</EmDialogTitle>
          </EmDialogHeader>

          <EmDialogBody>
            <EmDialogDescription>
              Wider lg-size dialog for content-heavy flows. Has scrollable body.
            </EmDialogDescription>

            <div style="margin-top: 12px; max-height: 200px; overflow: auto;">
              <p v-for="n in 12" :key="n" style="margin: 0 0 8px;">
                Paragraph {{ n }} — Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit.
              </p>
            </div>
          </EmDialogBody>

          <EmDialogFooter>
            <EmDialogClose renderless>
              <EmButton>Got it</EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>

      <EmDialog v-model="dialogFullOpen">
        <EmDialogContent size="fullscreen">
          <EmDialogHeader>
            <EmDialogTitle>Fullscreen dialog</EmDialogTitle>
          </EmDialogHeader>

          <EmDialogBody>
            <EmDialogDescription>
              Edge-to-edge surface for immersive workflows on mobile or focused tasks.
            </EmDialogDescription>
          </EmDialogBody>

          <EmDialogFooter>
            <EmDialogClose renderless>
              <EmButton variant="secondary">Close</EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>

      <EmDialog v-model="dialogFormOpen">
        <EmDialogContent size="md">
          <EmDialogHeader>
            <EmDialogTitle>Invite a teammate</EmDialogTitle>
          </EmDialogHeader>

          <EmDialogBody>
            <EmDialogDescription>
              Send an invitation by email — they&apos;ll be able to view and edit the workspace.
            </EmDialogDescription>

            <EmFormGroup style="margin-top: 16px;">
              <EmFormField>
                <EmTextField>
                  <EmTextFieldLabel>Email</EmTextFieldLabel>

                  <EmTextFieldControl placeholder="teammate@vuetifyjs.com">
                    <EmTextFieldPrepend>
                      <PhEnvelope :size="14" weight="duotone" />
                    </EmTextFieldPrepend>
                  </EmTextFieldControl>
                </EmTextField>
              </EmFormField>

              <EmFormField>
                <EmTextField>
                  <EmTextFieldLabel>Note (optional)</EmTextFieldLabel>
                  <EmTextFieldControl placeholder="Hey! Joining this workspace…" />
                </EmTextField>
              </EmFormField>
            </EmFormGroup>
          </EmDialogBody>

          <EmDialogFooter>
            <EmDialogClose renderless>
              <EmButton variant="secondary">Cancel</EmButton>
            </EmDialogClose>

            <EmDialogClose renderless>
              <EmButton>
                <EmButtonPrepend>
                  <PhUserPlus :size="14" weight="bold" />
                </EmButtonPrepend>

                <EmButtonContent>Send invite</EmButtonContent>
              </EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>
    </section>

    <!-- ╔══════════════════ DATA ══════════════════╗ -->

    <h1 class="sink-group">Data</h1>

    <section>
      <h2>Table — default (sortable / filterable / status)</h2>

      <EmTable>
        <EmTableHead>
          <EmTableRow>
            <EmTableHeader sort="none" sortable>
              User
              <template #sort-icon>
                <PhCaretUpDown :size="12" weight="duotone" />
              </template>
            </EmTableHeader>

            <EmTableHeader sort="ascending" sortable>
              Status
              <template #sort-icon>
                <PhCaretUp :size="12" weight="duotone" />
              </template>
            </EmTableHeader>

            <EmTableHeader filterable sort="descending" sortable>
              Role
              <template #sort-icon>
                <PhCaretDown :size="12" weight="duotone" />
              </template>

              <template #filter-icon>
                <PhFunnel :size="14" weight="duotone" />
              </template>

              <template #filter>
                <div style="display: flex; flex-direction: column; gap: 8px; min-width: 180px;">
                  <strong style="font-size: 12px;">Filter by role</strong>

                  <div style="display: inline-flex; align-items: center; gap: 6px;">
                    <EmCheckbox :model-value="true">
                      <EmCheckboxIndicator />
                    </EmCheckbox>

                    <EmCheckboxLabel>CEO</EmCheckboxLabel>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 6px;">
                    <EmCheckbox :model-value="false">
                      <EmCheckboxIndicator />
                    </EmCheckbox>

                    <EmCheckboxLabel>Editor</EmCheckboxLabel>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 6px;">
                    <EmCheckbox :model-value="true">
                      <EmCheckboxIndicator />
                    </EmCheckbox>

                    <EmCheckboxLabel>Manager</EmCheckboxLabel>
                  </div>
                </div>
              </template>
            </EmTableHeader>

            <EmTableHeader>Email</EmTableHeader>
            <EmTableHeader align="end">Phone</EmTableHeader>
          </EmTableRow>
        </EmTableHead>

        <EmTableBody>
          <EmTableRow>
            <EmTableCell>John Doe</EmTableCell>
            <EmTableCell>Active</EmTableCell>
            <EmTableCell>CEO</EmTableCell>
            <EmTableCell>john.doe@gmail.com</EmTableCell>
            <EmTableCell align="end">555-123-4567</EmTableCell>
          </EmTableRow>

          <EmTableRow>
            <EmTableCell>Laura Kroft</EmTableCell>
            <EmTableCell>Inactive</EmTableCell>
            <EmTableCell>Editor</EmTableCell>
            <EmTableCell>laurak@email.com</EmTableCell>
            <EmTableCell align="end">555-098-7654</EmTableCell>
          </EmTableRow>

          <EmTableRow selected>
            <EmTableCell>Ahmed Khan</EmTableCell>
            <EmTableCell>Active</EmTableCell>
            <EmTableCell>Manager</EmTableCell>
            <EmTableCell>ahmed.k@gmail.com</EmTableCell>
            <EmTableCell align="end">555-234-5678</EmTableCell>
          </EmTableRow>

          <EmTableRow>
            <EmTableCell>Jane Smith</EmTableCell>
            <EmTableCell>Inactive</EmTableCell>
            <EmTableCell>CFO</EmTableCell>
            <EmTableCell>jane.s@gmail.com</EmTableCell>
            <EmTableCell align="end">555-078-7654</EmTableCell>
          </EmTableRow>
        </EmTableBody>

        <EmTableFooter>
          <EmPagination v-model="paginationFull" :items-per-page="4" :size="20" :total-visible="3">
            <EmPaginationPrev>
              <PhCaretLeft weight="duotone" />
            </EmPaginationPrev>

            <template v-for="page in 3" :key="page">
              <EmPaginationItem :value="page">{{ page }}</EmPaginationItem>
            </template>

            <EmPaginationNext>
              <PhCaretRight weight="duotone" />
            </EmPaginationNext>
          </EmPagination>
        </EmTableFooter>
      </EmTable>
    </section>

    <section>
      <h2>Table — selection + expandable rows + actions</h2>

      <EmCheckboxGroup v-model="tableSelectAll" name="rows">
        <EmTable>
          <EmTableHead>
            <EmTableRow>
              <EmTableCheckboxAll />
              <EmTableHeader>Plan</EmTableHeader>
              <EmTableHeader>Status</EmTableHeader>
              <EmTableHeader align="end">MRR</EmTableHeader>
              <EmTableHeader align="end">&nbsp;</EmTableHeader>
              <EmTableHeader align="end">&nbsp;</EmTableHeader>
            </EmTableRow>
          </EmTableHead>

          <EmTableBody>
            <template
              v-for="row in [
                { id: '1', plan: 'Starter', status: 'active', mrr: '$120', detail: 'Trialed Mar 12, converted Mar 19. 12 seats activated.' },
                { id: '2', plan: 'Pro', status: 'trial', mrr: '$960', detail: '14-day trial ends Apr 28. 48 seats provisioned.' },
                { id: '3', plan: 'Enterprise', status: 'churned', mrr: '—', detail: 'Cancelled May 1. Data retained 90 days.' },
                { id: '4', plan: 'Team', status: 'active', mrr: '$320', detail: 'Active since Feb 2026. 16 seats.' },
              ]"
              :key="row.id"
            >
              <EmTableRow>
                <EmTableCheckbox v-model="tableSelected[row.id]" :value="row.id" />
                <EmTableCell>{{ row.plan }}</EmTableCell>

                <EmTableCell>
                  <EmTag tone="tinted" :variant="row.status === 'active' ? 'success' : row.status === 'trial' ? 'warning' : 'error'">
                    <PhCheckCircle v-if="row.status === 'active'" :size="14" weight="fill" />
                    <PhWarning v-else-if="row.status === 'trial'" :size="14" weight="fill" />
                    <PhXCircle v-else :size="14" weight="fill" />
                    {{ row.status }}
                  </EmTag>
                </EmTableCell>

                <EmTableCell align="end">{{ row.mrr }}</EmTableCell>

                <EmTableActions>
                  <EmMenu v-model="tableRowMenuOpen[row.id]">
                    <EmMenuActivator>
                      <EmButton aria-label="Row actions" variant="ghost">
                        <PhDotsThreeOutlineVertical :size="14" weight="duotone" />
                      </EmButton>
                    </EmMenuActivator>

                    <EmMenuContent>
                      <EmMenuItem>
                        <EmMenuItemIcon><PhPencilSimple weight="duotone" /></EmMenuItemIcon>
                        Edit
                      </EmMenuItem>

                      <EmMenuItem>
                        <EmMenuItemIcon><PhCopy weight="duotone" /></EmMenuItemIcon>
                        Duplicate
                      </EmMenuItem>

                      <EmMenuSeparator />

                      <EmMenuItem destructive>
                        <EmMenuItemIcon><PhTrash weight="duotone" /></EmMenuItemIcon>
                        Delete
                      </EmMenuItem>
                    </EmMenuContent>
                  </EmMenu>
                </EmTableActions>

                <EmTableActions>
                  <EmTableExpandTrigger
                    :expanded="!!tableExpanded[row.id]"
                    @toggle="onTableExpand(row.id)"
                  />
                </EmTableActions>
              </EmTableRow>

              <EmTableExpandRow :colspan="6" :expanded="!!tableExpanded[row.id]">
                <strong>Plan details:</strong> {{ row.detail }}
              </EmTableExpandRow>
            </template>
          </EmTableBody>
        </EmTable>
      </EmCheckboxGroup>
    </section>

    <section>
      <h2>Table — sticky header + scrollable</h2>

      <EmTable sticky>
        <EmTableHead>
          <EmTableRow>
            <EmTableHeader>ID</EmTableHeader>
            <EmTableHeader>Customer</EmTableHeader>
            <EmTableHeader>Status</EmTableHeader>
            <EmTableHeader align="end">Amount</EmTableHeader>
          </EmTableRow>
        </EmTableHead>

        <EmTableBody>
          <EmTableRow v-for="n in 30" :key="n">
            <EmTableCell>#{{ String(n).padStart(4, '0') }}</EmTableCell>
            <EmTableCell>Customer {{ n }}</EmTableCell>

            <EmTableCell>
              <EmTag tone="tinted" :variant="n % 3 === 0 ? 'warning' : 'success'">
                {{ n % 3 === 0 ? 'pending' : 'paid' }}
              </EmTag>
            </EmTableCell>

            <EmTableCell align="end">${{ (n * 47).toLocaleString() }}</EmTableCell>
          </EmTableRow>
        </EmTableBody>
      </EmTable>
    </section>

    <section>
      <h2>Table — compact (no border)</h2>

      <EmTable :bordered="false" compact>
        <EmTableHead>
          <EmTableRow>
            <EmTableHeader>Plan</EmTableHeader>
            <EmTableHeader>Status</EmTableHeader>
            <EmTableHeader align="end">Seats</EmTableHeader>
            <EmTableHeader align="end">MRR</EmTableHeader>
          </EmTableRow>
        </EmTableHead>

        <EmTableBody>
          <EmTableRow>
            <EmTableCell>Starter</EmTableCell>

            <EmTableCell>
              <EmTag tone="tinted" variant="success">
                <PhCheckCircle :size="14" weight="fill" />
                active
              </EmTag>
            </EmTableCell>

            <EmTableCell align="end">12</EmTableCell>
            <EmTableCell align="end">$120</EmTableCell>
          </EmTableRow>

          <EmTableRow>
            <EmTableCell>Pro</EmTableCell>

            <EmTableCell>
              <EmTag tone="tinted" variant="warning">
                <PhWarning :size="14" weight="fill" />
                trial
              </EmTag>
            </EmTableCell>

            <EmTableCell align="end">48</EmTableCell>
            <EmTableCell align="end">$960</EmTableCell>
          </EmTableRow>

          <EmTableRow>
            <EmTableCell>Enterprise</EmTableCell>

            <EmTableCell>
              <EmTag tone="tinted" variant="error">
                <PhXCircle :size="14" weight="fill" />
                churned
              </EmTag>
            </EmTableCell>

            <EmTableCell align="end">120</EmTableCell>
            <EmTableCell align="end">—</EmTableCell>
          </EmTableRow>
        </EmTableBody>
      </EmTable>
    </section>

    <section>
      <h2>Carousel</h2>

      <p class="muted">Default — circular, indicators, prev/next</p>

      <EmCarousel v-model="carouselDefault" circular label="Demo carousel" style="width: 557px;">
        <EmCarouselPrevious>
          <PhCaretLeft :size="16" weight="duotone" />
        </EmCarouselPrevious>

        <EmCarouselViewport>
          <EmCarouselItem value="slide-1">
            <div class="sink-carousel-slide">1</div>
          </EmCarouselItem>

          <EmCarouselItem value="slide-2">
            <div class="sink-carousel-slide">2</div>
          </EmCarouselItem>

          <EmCarouselItem value="slide-3">
            <div class="sink-carousel-slide">3</div>
          </EmCarouselItem>
        </EmCarouselViewport>

        <EmCarouselNext>
          <PhCaretRight :size="16" weight="duotone" />
        </EmCarouselNext>

        <EmCarouselIndicator label="Slides">
          <template #default="{ items }">
            <button
              v-for="item in items"
              :key="item.index"
              v-bind="item.attrs"
              class="emerald-carousel__indicator"
              type="button"
            />
          </template>
        </EmCarouselIndicator>
      </EmCarousel>

      <p class="muted">Autoplay (4s) — auto-advances</p>

      <EmCarousel
        v-model="carouselAutoplay"
        :autoplay="4000"
        circular
        label="Autoplay carousel"
        style="width: 557px;"
      >
        <EmCarouselPrevious>
          <PhCaretLeft :size="16" weight="duotone" />
        </EmCarouselPrevious>

        <EmCarouselViewport>
          <EmCarouselItem value="slide-1">
            <div class="sink-carousel-slide" style="background: var(--emerald-primary-100);">
              <PhStar :size="48" weight="duotone" />
            </div>
          </EmCarouselItem>

          <EmCarouselItem value="slide-2">
            <div class="sink-carousel-slide" style="background: var(--emerald-success-100);">
              <PhCheckCircle :size="48" weight="duotone" />
            </div>
          </EmCarouselItem>

          <EmCarouselItem value="slide-3">
            <div class="sink-carousel-slide" style="background: var(--emerald-warning-100);">
              <PhAirplaneTilt :size="48" weight="duotone" />
            </div>
          </EmCarouselItem>
        </EmCarouselViewport>

        <EmCarouselNext>
          <PhCaretRight :size="16" weight="duotone" />
        </EmCarouselNext>

        <EmCarouselIndicator label="Slides">
          <template #default="{ items }">
            <button
              v-for="item in items"
              :key="item.index"
              v-bind="item.attrs"
              class="emerald-carousel__indicator"
              type="button"
            />
          </template>
        </EmCarouselIndicator>
      </EmCarousel>
    </section>
  </div>
</template>

<style scoped>
  .emerald-sink {
    min-height: 100vh;
    padding: 2rem;
    background: var(--emerald-background);
    color: var(--emerald-on-background);
    font-family: Manrope, system-ui, -apple-system, sans-serif;
  }

  .sink-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--emerald-divider);
  }

  .sink-header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .sink-header p {
    margin: 0;
    color: var(--emerald-neutral-500);
    font-size: 0.875rem;
  }

  .sink-header code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.8125rem;
    padding: 0.05rem 0.3rem;
    border-radius: 3px;
    background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.06);
  }

  .em-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .em-slider-label {
    width: 60px;
    font-size: 0.75rem;
    color: var(--emerald-neutral-500);
  }

  .em-slider-value {
    font-size: 0.75rem;
    color: var(--emerald-neutral-700);
    font-variant-numeric: tabular-nums;
  }

  .sink-group {
    margin: 2.5rem 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--emerald-primary-500);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  section {
    margin-bottom: 2rem;
  }

  section h2 {
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .sink-subhead {
    margin: 0 0 8px;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--emerald-neutral-700);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.75rem;
    align-items: center;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 480px;
    margin-bottom: 1rem;
  }

  .vertical-dividers {
    height: 80px;
    align-items: stretch;
  }

  .sink-demo-surface {
    padding: 12px 16px;
    border: 1px dashed rgb(var(--emerald-neutral-channels, 26 28 30) / 0.2);
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }

  :deep(.sink-box) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 8px 12px;
    background: rgb(var(--emerald-primary-500-channels, 24 180 140) / 0.12);
    border: 1px solid rgb(var(--emerald-primary-500-channels, 24 180 140) / 0.3);
    border-radius: 6px;
    font-size: 0.875rem;
  }

  :deep(.sink-slide) {
    width: 100%;
    min-height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    font-size: 1.25rem;
  }

  .muted {
    margin: 0.5rem 0 0.25rem;
    font-size: 0.75rem;
    color: var(--emerald-neutral-500);
  }

  .muted code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    padding: 0.05rem 0.25rem;
    border-radius: 3px;
    background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.06);
  }

  :deep(.sink-carousel-slide) {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 8px;
    color: #000;
    font-weight: 600;
    font-size: 24px;
    letter-spacing: 0.48px;
    font-family: Manrope, system-ui, -apple-system, sans-serif;
  }
</style>
