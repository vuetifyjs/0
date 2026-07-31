<template>
  <!-- Step navigation is app chrome, not page content: it is pinned to the viewport and
       spans the full width — including over the preview aside — so it mirrors the header
       at the other end of the screen. AppShell shortens the aside's scroll area to match,
       so nothing ends up underneath it. -->
  <div class="fixed inset-x-0 bottom-0 z-30 border-t border-divider bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
    <!-- min-h-16 sets the row at 4rem; py-2.5 leaves the 40px buttons room to spare inside
         it. Total bar height is therefore 4rem + the 1px border above — which is what
         AppShell subtracts from the aside. -->
    <div class="px-4 sm:px-6 min-h-16 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <slot />
    </div>
  </div>
</template>
