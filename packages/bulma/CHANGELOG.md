# @paper/bulma

## 0.2.0

### Minor Changes

- [#946](https://github.com/vuetifyjs/0/pull/946) [`068219a`](https://github.com/vuetifyjs/0/commit/068219ad3510adfe44d079f750bc6368385e7e58) Thanks [@johnleider](https://github.com/johnleider)! - feat(bulma): reach a compound's parts from the parent import

  Importing `BuModal` now brings its whole tree with it — `<BuModal.Head />`, `<BuModal.Title />`, and the rest — so a compound costs one import instead of eight. The sub-key drops the parent prefix (`BuModalHead` is `BuModal.Head`, `BuNumberFieldInput` is `BuNumberField.Input`).

  ```vue
  <script setup lang="ts">
  import { BuModal } from "@paper/bulma";
  </script>

  <template>
    <BuModal>
      <BuModal.Card>
        <BuModal.Head>
          <BuModal.Title />
        </BuModal.Head>
      </BuModal.Card>
    </BuModal>
  </template>
  ```

  Nothing is removed: every flat name (`BuModalHead`, `BuDropdownMenu`, …) is still exported and resolves to the same component, so existing imports keep working and the two styles can be mixed.

### Patch Changes

- [#961](https://github.com/vuetifyjs/0/pull/961) [`3b3734e`](https://github.com/vuetifyjs/0/commit/3b3734e3572d24bfcdc5d45af9358254b5574f80) Thanks [@johnleider](https://github.com/johnleider)! - fix(BuModal): skip the global Scrim so `.modal-background` is the only dim

  BuModal already paints Bulma's `.modal-background`. It now passes `:scrim="false"` on `Dialog.Content` so an app-level `<Scrim>` does not stack a second backdrop.

- [#1037](https://github.com/vuetifyjs/0/pull/1037) [`edf2af9`](https://github.com/vuetifyjs/0/commit/edf2af977bcc852f52f0084268421048b74c9e09) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(Input): export parseValidateOn from the Input barrel

  `parseValidateOn` and its `ParsedValidateOn` return type are now public, so wrappers that re-implement the `validateOn` surface can reuse the parser instead of copying it. NumberField and `@paper/bulma` now use the shared parser.

- Updated dependencies [[`ff80dd2`](https://github.com/vuetifyjs/0/commit/ff80dd2d5ae05e9b3c3452c2ee4c4ff6a4c77d4c), [`0184058`](https://github.com/vuetifyjs/0/commit/018405893e702bba2eb6d30e390b2008ee49506a), [`8302695`](https://github.com/vuetifyjs/0/commit/830269534d890fb56d05e10fcec27bbe91063235), [`1a5cbce`](https://github.com/vuetifyjs/0/commit/1a5cbce149ca1b08301ce3f76b8783af70c8c106), [`3b3734e`](https://github.com/vuetifyjs/0/commit/3b3734e3572d24bfcdc5d45af9358254b5574f80), [`bec776d`](https://github.com/vuetifyjs/0/commit/bec776dee57cbb0812278b6c9cd5e5953942c2b2), [`18eb798`](https://github.com/vuetifyjs/0/commit/18eb7981f29613afebb968573abc8556abceabee), [`f990bbb`](https://github.com/vuetifyjs/0/commit/f990bbbb14e3b87122f77be021cac400e55704cb), [`8670f30`](https://github.com/vuetifyjs/0/commit/8670f30730b9a4404e2fe5430e8e530767178a14), [`edf2af9`](https://github.com/vuetifyjs/0/commit/edf2af977bcc852f52f0084268421048b74c9e09), [`0621413`](https://github.com/vuetifyjs/0/commit/06214134009198669346b5ad16f127d3c73fe25d), [`ede941e`](https://github.com/vuetifyjs/0/commit/ede941eb9fbb91228838a2b539cc1ad3fefd585d), [`09e971d`](https://github.com/vuetifyjs/0/commit/09e971d4a017ecacd3eeed3b67c79a29ad4da7df), [`4047a65`](https://github.com/vuetifyjs/0/commit/4047a65d354f9e11e93584194d8009d1ce343509), [`1f5719c`](https://github.com/vuetifyjs/0/commit/1f5719ccf8af9bc8cb0c2afd4dc25c63b5ecbb20), [`2f59b6b`](https://github.com/vuetifyjs/0/commit/2f59b6be45ace1dc7f1551fdbd5144526be6eaf4), [`3cf3360`](https://github.com/vuetifyjs/0/commit/3cf3360603d4c30fef16da5fc00527c51e08d35e), [`0184058`](https://github.com/vuetifyjs/0/commit/018405893e702bba2eb6d30e390b2008ee49506a)]:
  - @vuetify/v0@1.3.0

## 0.1.1

### Patch Changes

- [#958](https://github.com/vuetifyjs/0/pull/958) [`2bfaf60`](https://github.com/vuetifyjs/0/commit/2bfaf6049a3c9c7504ed12c898f38af67df4d850) Thanks [@johnleider](https://github.com/johnleider)! - fix(BuTab): follow keyboard focus onto the tab anchor

- Updated dependencies [[`ac90199`](https://github.com/vuetifyjs/0/commit/ac90199f51f30b0b2cc95c46016598278ac18c26), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`897cdcf`](https://github.com/vuetifyjs/0/commit/897cdcf0f5d6683f282261c378d84e1550df191c), [`2e0025c`](https://github.com/vuetifyjs/0/commit/2e0025cde4d5bcda140834628883fa8a8dff42ba), [`6ec1732`](https://github.com/vuetifyjs/0/commit/6ec173270d312591f966e32ede760531a1d18e24), [`c9575fd`](https://github.com/vuetifyjs/0/commit/c9575fd4c5be46333b010e022f6f00de240a3459), [`9f8eb78`](https://github.com/vuetifyjs/0/commit/9f8eb78d500e2a6f064a32422586cc5483b61c0d), [`1b6bb65`](https://github.com/vuetifyjs/0/commit/1b6bb65d01c61bb9e025e1ada9d50b634047b0b7), [`7d41f19`](https://github.com/vuetifyjs/0/commit/7d41f191ef90a04385a1bf9ab2e5b6beae3016c8), [`8155332`](https://github.com/vuetifyjs/0/commit/81553324651e93150ad9f61236d465fade96bd5b), [`2bfaf60`](https://github.com/vuetifyjs/0/commit/2bfaf6049a3c9c7504ed12c898f38af67df4d850)]:
  - @vuetify/v0@1.2.1

## 0.1.0

### Minor Changes

- [#760](https://github.com/vuetifyjs/0/pull/760) [`d843b81`](https://github.com/vuetifyjs/0/commit/d843b811ad894b075fb953d0704b67185b446e68) Thanks [@johnleider](https://github.com/johnleider)! - feat(bulma): Vue behavior for Bulma's markup ([#760](https://github.com/vuetifyjs/0/issues/760))

  `@paper/bulma` is a compat design system: components render the markup and classes [bulma.io](https://bulma.io/documentation/) documents, against the `bulma.css` you already load. There is no theme, no class prefix, and no CSS in the package. `bulma` is an optional peer.

  What ships is the JavaScript Bulma never did — open state, click-outside, Escape, focus, and form wiring — for the documented component, element, and form families, plus `BuNumberField` composed from form addons.

### Patch Changes

- Updated dependencies [[`bcc509c`](https://github.com/vuetifyjs/0/commit/bcc509c909404443dfff098ef0b0bc73e206da93), [`bac9bdb`](https://github.com/vuetifyjs/0/commit/bac9bdbca5d61582780f6bf143ddc163dc03c117), [`afd8718`](https://github.com/vuetifyjs/0/commit/afd8718bef5cd2d4870d653f63840482acdcdfbf), [`1d3d810`](https://github.com/vuetifyjs/0/commit/1d3d810341d766c5ecad0e4903b8736abcdc6636), [`840d6ea`](https://github.com/vuetifyjs/0/commit/840d6eaa7a578eb895ce8790e45687ac97c341c0), [`be427af`](https://github.com/vuetifyjs/0/commit/be427af15b294fb894f26a426ee1ceb4c5585f51), [`d2fde78`](https://github.com/vuetifyjs/0/commit/d2fde78dddf57fbaaa5f1a04a5efd51f0ef92be6), [`a3d8d1c`](https://github.com/vuetifyjs/0/commit/a3d8d1cb9e2270595054b1fff6bee5db229bc23b), [`04eb489`](https://github.com/vuetifyjs/0/commit/04eb489585f87f95c5d855c6a5d5dd169aaaad60), [`1864803`](https://github.com/vuetifyjs/0/commit/186480383960f364ba90c0236b8a38711c88b899), [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410), [`e6c4068`](https://github.com/vuetifyjs/0/commit/e6c406875ae04a6b22ebdf087dd4d5a93e46f410), [`2e92047`](https://github.com/vuetifyjs/0/commit/2e9204786d72db0cf58147289792165f9944ba72), [`d876cf9`](https://github.com/vuetifyjs/0/commit/d876cf98c3ebab23e0cdc59a37f279a3b27bd25d), [`3904c8f`](https://github.com/vuetifyjs/0/commit/3904c8f0082b9e848ef89f67767c41eb2eb444cf), [`e82f95a`](https://github.com/vuetifyjs/0/commit/e82f95aa6b42fb1dbf71e20b9c6bba1af217d12c), [`3cd588a`](https://github.com/vuetifyjs/0/commit/3cd588a85dd593e09a4cb5e3a8f1e16ce775d59b)]:
  - @vuetify/v0@1.2.0
