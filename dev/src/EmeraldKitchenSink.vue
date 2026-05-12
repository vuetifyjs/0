<script setup lang="ts">
  import { EmeraldStyleSheetAdapter, EmListItemAction, EmListItemBody, EmListSeparator, EmListSubheader, emeraldColors } from '@paper/emerald'
  import { PhAirplaneTilt, PhArchive, PhBookOpen, PhCalendarBlank, PhCalendarDots, PhCaretCircleDown, PhCaretCircleUp, PhCaretDown, PhCaretLeft, PhCaretRight, PhCaretUp, PhCaretUpDown, PhChalkboardTeacher, PhChartPieSlice, PhChatsCircle, PhChatText, PhCheck, PhCheckCircle, PhCheckSquare, PhCube, PhDotsThree, PhDotsThreeCircle, PhFileArrowUp, PhFunnel, PhHouse, PhHouseLine, PhInfo, PhMapPin, PhNotePencil, PhPlusCircle, PhShareNetwork, PhUser, PhWarning, PhX, PhXCircle } from '@phosphor-icons/vue'

  const adapter = new EmeraldStyleSheetAdapter()
  adapter.upsert(adapter.generate({ emerald: emeraldColors }, false))

  // Stateful demos
  const dialogOpen = ref(false)
  const menuOpen = ref(true)

  const accordionModel = ref<string[]>(['overview'])
  const tabsModel = ref('overview')
  const stepperModel = ref('house')
  const paginationPage = ref(2)
  const carouselModel = ref('slide-1')

  const sliderSingle = ref(40)
  const sliderRange = ref([20, 70])

  const selectSingle = ref<string | undefined>()
  const autoCompleteSingle = ref<string | undefined>('vuetify')
  const datePickerValue = ref<Date | null>(new Date())

  const textFieldValue = ref('Emerald')
  const textareaValue = ref('Write about something nice…')

  const uploadFiles = ref<File[]>([])
  const formValid = ref<boolean | null>(null)
</script>

<template>
  <div class="emerald-sink" data-theme="emerald">
    <header class="sink-header">
      <h1>Emerald Kitchen Sink</h1>
      <p>Every component rendered at least once for visual verification.</p>
    </header>

    <section>
      <h2>Button</h2>
      <div class="row">
        <EmButton size="sm">Small</EmButton>
        <EmButton size="md">Medium</EmButton>
        <EmButton size="lg">Large</EmButton>
      </div>
      <div class="row">
        <EmButton disabled>Disabled</EmButton>
        <EmButton loading>Loading</EmButton>
        <EmButton href="#">Anchor</EmButton>
      </div>
    </section>

    <section>
      <h2>Container</h2>
      <EmContainer class="sink-demo-surface" size="md">
        <p>Container size=md (max-width 768px)</p>
      </EmContainer>
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
      <div class="row">
        <EmCard style="width: 520px;">
          <EmCardHeader>
            <EmCardTitle>Preferences</EmCardTitle>
            <EmCardSubtitle>Customize your Emerald experience</EmCardSubtitle>
          </EmCardHeader>
          <EmCardBody>
            Emerald introduces a token system structured in three levels: primitive, semantic, and component.
          </EmCardBody>
          <EmCardFooter>
            <EmButton>Save changes</EmButton>
          </EmCardFooter>
        </EmCard>

        <EmCard hoverable style="width: 520px;">
          <EmCardHeader>
            <EmCardTitle>Hoverable card</EmCardTitle>
            <EmCardSubtitle>Hover to see the primary-tinted border and shadow.</EmCardSubtitle>
          </EmCardHeader>
          <EmCardBody>
            When `hoverable` is set, the card lifts on mouseover with a neutral drop shadow and primary-500 border.
          </EmCardBody>
        </EmCard>
      </div>
    </section>

    <!-- ================= Layout ================= -->

    <h1 class="sink-group">Layout</h1>

    <section>
      <h2>Flex</h2>
      <EmFlex class="sink-demo-surface" :gap="12">
        <div class="sink-box">A</div>
        <div class="sink-box">B</div>
        <div class="sink-box">C</div>
      </EmFlex>
      <EmFlex class="sink-demo-surface" direction="column" :gap="8" style="margin-top: 0.75rem;">
        <div class="sink-box">Column 1</div>
        <div class="sink-box">Column 2</div>
      </EmFlex>
    </section>

    <section>
      <h2>Grid</h2>
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
    </section>

    <!-- ================= Content ================= -->

    <h1 class="sink-group">Content</h1>

    <section>
      <h2>Avatar</h2>

      <p class="muted">Image</p>
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

      <p class="muted">Text (initials)</p>
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

      <p class="muted">Icon</p>
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

      <p class="muted">Group</p>
      <div class="row">
        <div class="emerald-avatar-group">
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
        </div>
      </div>
    </section>

    <section>
      <h2>Badge</h2>
      <div class="row">
        <EmBadge>Primary</EmBadge>
        <EmBadge variant="success">Success</EmBadge>
        <EmBadge variant="warning">Warning</EmBadge>
        <EmBadge variant="error">Error</EmBadge>
        <EmBadge variant="info">Info</EmBadge>
        <EmBadge variant="neutral">Neutral</EmBadge>
      </div>
      <div class="row">
        <EmBadge size="sm">Small</EmBadge>
        <EmBadge size="md">Medium</EmBadge>
        <EmBadge size="lg">Large</EmBadge>
      </div>
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

      <p class="muted">Outlined elevated (lg) — white surface, colored shadow</p>
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

      <p class="muted">Outlined elevated (sm) — subtle drop shadow</p>
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
        <EmTag elevation="sm" variant="warning">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
        <EmTag elevation="sm" variant="info">
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
        <EmTag variant="error">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
        <EmTag variant="warning">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
        <EmTag variant="info">
          <PhCheckCircle :size="16" weight="fill" />
          chip text
        </EmTag>
      </div>

      <p class="muted">Text only — no icon</p>
      <div class="row">
        <EmTag variant="neutral">vue</EmTag>
        <EmTag variant="primary">typescript</EmTag>
        <EmTag variant="success">emerald</EmTag>
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
          </EmListItem>
          <EmListItem interactive>
            <EmListItemIcon>
              <PhCalendarDots :size="16" weight="duotone" />
            </EmListItemIcon>
            <EmListItemTitle>Scheduled</EmListItemTitle>
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
      <EmAccordion v-model="accordionModel" multiple style="width: 425px;">
        <EmAccordionItem value="overview">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              Accordion Title
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretCircleUp : PhCaretCircleDown"
                  :size="20"
                  weight="duotone"
                />
              </EmAccordionCue>
            </EmAccordionTrigger>
          </EmAccordionHeader>
          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>
        <EmAccordionItem value="tokens">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              Accordion Title
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretCircleUp : PhCaretCircleDown"
                  :size="20"
                  weight="duotone"
                />
              </EmAccordionCue>
            </EmAccordionTrigger>
          </EmAccordionHeader>
          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>
        <EmAccordionItem value="more">
          <EmAccordionHeader>
            <EmAccordionTrigger v-slot="{ isSelected }">
              Accordion Title
              <EmAccordionCue>
                <component
                  :is="isSelected ? PhCaretCircleUp : PhCaretCircleDown"
                  :size="20"
                  weight="duotone"
                />
              </EmAccordionCue>
            </EmAccordionTrigger>
          </EmAccordionHeader>
          <EmAccordionContent>
            This is the body of the accordion you can insert your accordion text or content in this section.
          </EmAccordionContent>
        </EmAccordionItem>
      </EmAccordion>
    </section>

    <!-- ================= Navigation ================= -->

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
      <EmTabs v-model="tabsModel">
        <EmTabsList label="Account settings">
          <EmTabsItem value="overview">Profile</EmTabsItem>
          <EmTabsItem value="tokens">Password</EmTabsItem>
          <EmTabsItem value="components">Billing</EmTabsItem>
        </EmTabsList>
        <EmTabsPanel value="overview">Profile settings content.</EmTabsPanel>
        <EmTabsPanel value="tokens">Password settings content.</EmTabsPanel>
        <EmTabsPanel value="components">Billing settings content.</EmTabsPanel>
      </EmTabs>
    </section>

    <section>
      <h2>Stepper</h2>
      <EmStepper v-model="stepperModel">
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
    </section>

    <section>
      <h2>Pagination</h2>
      <EmPagination v-model="paginationPage" :size="20" :total-visible="5">
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
    </section>

    <section>
      <h2>Menu</h2>
      <EmMenu v-model="menuOpen">
        <EmMenuActivator>
          <EmButton>Open Menu</EmButton>
        </EmMenuActivator>
        <EmMenuContent>
          <EmMenuLabel>Frameworks</EmMenuLabel>
          <EmMenuItem>Shadcn</EmMenuItem>
          <EmMenuItem active>Vuetify</EmMenuItem>
          <EmMenuItem>Base UI</EmMenuItem>
          <EmMenuItem>Reka UI</EmMenuItem>
          <EmMenuSeparator />
          <EmMenuLabel>More Options</EmMenuLabel>
          <EmMenuItem>Vuetify Zero</EmMenuItem>
          <EmMenuItem disabled>Radix UI</EmMenuItem>
        </EmMenuContent>
      </EmMenu>
    </section>

    <!-- ================= Forms ================= -->

    <h1 class="sink-group">Forms</h1>

    <section>
      <h2>TextField</h2>
      <div class="row" style="align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
        <EmTextField v-model="textFieldValue" label="Name" style="width: 217px;">
          <EmTextFieldLabel>Name</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Enter your email" />
          <EmTextFieldDescription>Your display name across the app.</EmTextFieldDescription>
        </EmTextField>
        <EmTextField label="Empty" style="width: 217px;">
          <EmTextFieldControl placeholder="Enter your email" />
        </EmTextField>
        <EmTextField :disabled="true" label="Disabled" style="width: 217px;">
          <EmTextFieldControl placeholder="Enter your email" />
        </EmTextField>
        <EmTextField
          error
          :error-messages="['Email is required']"
          label="Invalid"
          style="width: 217px;"
          validate-on="eager"
        >
          <EmTextFieldLabel>Email</EmTextFieldLabel>
          <EmTextFieldControl placeholder="Enter your email" />
          <EmTextFieldError v-slot="{ errors }">
            {{ errors[0] }}
          </EmTextFieldError>
        </EmTextField>
      </div>
    </section>

    <section>
      <h2>Textarea</h2>
      <div class="row" style="align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
        <EmTextarea v-model="textareaValue" label="Bio" style="width: 217px;">
          <EmTextareaLabel>Bio</EmTextareaLabel>
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
          <EmTextareaDescription>Markdown is supported.</EmTextareaDescription>
        </EmTextarea>
        <EmTextarea label="Empty" style="width: 217px;">
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
        </EmTextarea>
        <EmTextarea disabled label="Disabled" style="width: 217px;">
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
        </EmTextarea>
        <EmTextarea
          error
          :error-messages="['Bio is required']"
          label="Invalid"
          style="width: 217px;"
          validate-on="eager"
        >
          <EmTextareaLabel>Bio</EmTextareaLabel>
          <EmTextareaControl placeholder="Write your content here..." :rows="4" />
          <EmTextareaError v-slot="{ errors }">
            {{ errors[0] }}
          </EmTextareaError>
        </EmTextarea>
      </div>
    </section>

    <section>
      <h2>Checkbox</h2>
      <p class="muted">Unchecked</p>
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
      </div>
      <p class="muted">Checked</p>
      <div class="row" style="align-items: center; gap: 16px;">
        <EmCheckbox :model-value="true" size="sm">
          <EmCheckboxIndicator />
        </EmCheckbox>
        <EmCheckbox :model-value="true" size="md">
          <EmCheckboxIndicator />
        </EmCheckbox>
        <EmCheckbox :model-value="true" size="lg">
          <EmCheckboxIndicator />
        </EmCheckbox>
      </div>
    </section>

    <section>
      <h2>Radio</h2>
      <p class="muted">Unchecked</p>
      <div class="row" style="align-items: center; gap: 16px;">
        <EmRadioGroup>
          <EmRadio size="sm" :value="'a'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
        <EmRadioGroup>
          <EmRadio size="md" :value="'b'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
        <EmRadioGroup>
          <EmRadio size="lg" :value="'c'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
      </div>
      <p class="muted">Checked</p>
      <div class="row" style="align-items: center; gap: 16px;">
        <EmRadioGroup :model-value="'a'">
          <EmRadio size="sm" :value="'a'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
        <EmRadioGroup :model-value="'b'">
          <EmRadio size="md" :value="'b'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
        <EmRadioGroup :model-value="'c'">
          <EmRadio size="lg" :value="'c'">
            <EmRadioIndicator />
          </EmRadio>
        </EmRadioGroup>
      </div>
    </section>

    <section>
      <h2>Switch</h2>
      <p class="muted">Off</p>
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
      </div>
      <p class="muted">On</p>
      <div class="row" style="align-items: center; gap: 16px;">
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
      </div>
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
      </div>
    </section>

    <section>
      <h2>Select</h2>
      <EmSelect v-model="selectSingle" style="width: 217px;">
        <EmSelectActivator>
          <EmSelectValue />
          <EmSelectPlaceholder>Select your framework</EmSelectPlaceholder>
          <PhCaretDown :size="14" weight="duotone" />
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
      <EmAutoComplete v-model="autoCompleteSingle" style="width: 240px;">
        <EmAutoCompleteControl>
          <EmAutoCompleteInput placeholder="Search your framework" />
          <PhCaretDown :size="14" weight="duotone" />
        </EmAutoCompleteControl>
        <EmAutoCompleteContent eager>
          <EmAutoCompleteItem :value="'vuetify'">Vuetify</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'vue'">Vue</EmAutoCompleteItem>
          <EmAutoCompleteItem :value="'primevue'">Prime Vue</EmAutoCompleteItem>
          <EmAutoCompleteEmpty>No matches</EmAutoCompleteEmpty>
        </EmAutoCompleteContent>
      </EmAutoComplete>
    </section>

    <section>
      <h2>DatePicker</h2>
      <p class="muted">Visual scaffold only — replaces with the new DatePicker once v0 ships a calendar primitive (createCalendar / useDate-backed root).</p>
      <EmDatePicker v-model="datePickerValue">
        <EmDatePickerCalendar>
          <EmDatePickerHeader>
            <button aria-label="Previous month" type="button">
              <PhCaretLeft :size="12" weight="duotone" />
            </button>
            <span>July 2026</span>
            <button aria-label="Next month" type="button">
              <PhCaretRight :size="12" weight="duotone" />
            </button>
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
      <EmUpload v-model="uploadFiles" multiple style="width: 420px;">
        <EmUploadDropzone>
          <PhFileArrowUp :size="28" weight="regular" />
          <strong>Drag and drop your files</strong>
          <span class="muted" style="margin: 0;">or click to browse</span>
        </EmUploadDropzone>
      </EmUpload>
    </section>

    <section>
      <h2>Form</h2>
      <EmForm v-model="formValid" style="width: 217px;">
        <div class="emerald-form-field">
          <label class="emerald-form-field__label" for="em-form-default">Email</label>
          <div class="emerald-form-field__control">
            <input id="em-form-default" placeholder="Enter your email" type="email">
          </div>
          <span class="emerald-form-field__helper">Write your email in lowercase</span>
        </div>

        <div class="emerald-form-field" data-invalid>
          <label class="emerald-form-field__label" for="em-form-error">Email</label>
          <div class="emerald-form-field__control">
            <input id="em-form-error" placeholder="Enter your email" type="email">
          </div>
          <span class="emerald-form-field__error">Email is required</span>
        </div>

        <div class="emerald-form-field">
          <label class="emerald-form-field__label" for="em-form-active">Email</label>
          <div class="emerald-form-field__control">
            <input id="em-form-active" type="email" value="juanjcardona13@gmail.com">
          </div>
          <span class="emerald-form-field__helper">Write your email in lowercase</span>
        </div>

        <EmButton type="submit">Submit</EmButton>
      </EmForm>
    </section>

    <!-- ================= Feedback ================= -->

    <h1 class="sink-group">Feedback</h1>

    <section>
      <h2>Alert</h2>
      <div class="stack" style="max-width: 520px;">
        <EmAlert>
          <EmAlertIcon>
            <PhInfo :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Alert Title</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
        <EmAlert variant="error">
          <EmAlertIcon>
            <PhXCircle :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Error Alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
        <EmAlert variant="success">
          <EmAlertIcon>
            <PhCheckCircle :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Success Alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
        <EmAlert variant="info">
          <EmAlertIcon>
            <PhInfo :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Info Alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
        <EmAlert variant="warning">
          <EmAlertIcon>
            <PhWarning :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Warning Alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
        <EmAlert variant="neutral">
          <EmAlertIcon>
            <PhAirplaneTilt :size="24" weight="regular" />
          </EmAlertIcon>
          <EmAlertBody>
            <EmAlertTitle>Alert</EmAlertTitle>
            <EmAlertDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus!</EmAlertDescription>
          </EmAlertBody>
        </EmAlert>
      </div>
    </section>

    <section>
      <h2>Loading</h2>
      <EmLoading>Loading…</EmLoading>
    </section>

    <section>
      <h2>Progress</h2>
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <EmProgress size="sm" :value="30">
          <EmProgressTrack>
            <EmProgressFill />
          </EmProgressTrack>
        </EmProgress>

        <EmProgress v-slot="{ value }" size="md" :value="30">
          <EmProgressTrack>
            <EmProgressFill>
              <EmProgressValue inside>{{ value }}</EmProgressValue>
            </EmProgressFill>
          </EmProgressTrack>
        </EmProgress>

        <EmProgress v-slot="{ value }" :max="100" size="md" :value="30">
          <EmProgressTrack>
            <EmProgressFill>
              <EmProgressValue inside>{{ value }}</EmProgressValue>
            </EmProgressFill>
          </EmProgressTrack>
          <EmProgressValue>100</EmProgressValue>
        </EmProgress>
      </div>
    </section>

    <section>
      <h2>Toast</h2>
      <div class="stack" style="max-width: 360px;">
        <EmToast>
          <EmToastIcon>
            <PhInfo :size="16" weight="duotone" />
          </EmToastIcon>
          <EmToastBody>
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's a violet notification state</EmToastDescription>
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
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's a red notification state</EmToastDescription>
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
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's a green notification state</EmToastDescription>
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
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's a blue notification state</EmToastDescription>
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
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's an amber notification state</EmToastDescription>
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
            <EmToastTitle>Successful toast</EmToastTitle>
            <EmToastDescription>It's a neutral notification state</EmToastDescription>
          </EmToastBody>
          <EmToastClose>
            <PhX :size="12" weight="bold" />
          </EmToastClose>
        </EmToast>
      </div>
    </section>

    <section>
      <h2>Tooltip</h2>
      <EmTooltip>
        <EmTooltipContent position-area="top">
          Hello, I'm Tooltip
        </EmTooltipContent>
        <EmTooltipActivator>
          <EmButton>Hover for tooltip</EmButton>
        </EmTooltipActivator>
      </EmTooltip>
    </section>

    <!-- ================= Overlay ================= -->

    <h1 class="sink-group">Overlay</h1>

    <section>
      <h2>Dialog</h2>
      <EmButton @click="dialogOpen = true">Open dialog</EmButton>
      <EmDialog v-model="dialogOpen">
        <EmDialogContent>
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
              <EmButton>Confirm</EmButton>
            </EmDialogClose>
          </EmDialogFooter>
        </EmDialogContent>
      </EmDialog>
    </section>

    <!-- ================= Data ================= -->

    <h1 class="sink-group">Data</h1>

    <section>
      <h2>Table</h2>
      <p class="muted">Default — sortable headers, selected row, status cells</p>
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
          <EmTableRow>
            <EmTableCell>David Wilson</EmTableCell>
            <EmTableCell>Active</EmTableCell>
            <EmTableCell>COO</EmTableCell>
            <EmTableCell>coo10@gmail.com</EmTableCell>
            <EmTableCell align="end">555-098-7654</EmTableCell>
          </EmTableRow>
        </EmTableBody>
      </EmTable>

      <p class="muted" style="margin-top: 1.5rem;">Compact — fewer columns, no border</p>
      <EmTable :bordered="false">
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
      <EmCarousel v-model="carouselModel" circular label="Demo carousel" style="width: 557px;">
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

  .emerald-avatar-group {
    display: inline-flex;
    align-items: center;
  }

  .emerald-avatar-group > :deep(.emerald-avatar) {
    border: none;
    box-shadow:
      0 0 0 2px var(--emerald-background, #faf9ff),
      0 1px 2px 0 rgba(5, 0, 18, 0.1);
  }

  .emerald-avatar-group > :deep(.emerald-avatar) + :deep(.emerald-avatar) {
    margin-left: -16px;
  }

  .muted {
    margin: 0.5rem 0 0.25rem;
    font-size: 0.75rem;
    color: var(--emerald-neutral-500);
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
