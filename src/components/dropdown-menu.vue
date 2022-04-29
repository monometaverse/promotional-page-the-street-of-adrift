<script lang="ts" setup>
import { Menu as HeadLessMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
</script>
<template>
  <head-less-menu v-slot="{ open }">
    <menu-button>
      <slot
        :open="open"
        name="trigger"
      />
    </menu-button>
    <transition
      enter-from-class="transform -translate-y-20px opacity-0"
      leave-to-class="transform -translate-y-20px opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-from-class="transform translate-y-0 opacity-100"
      enter-active-class="transition duration-250"
      leave-active-class="transition duration-250"
    >
      <menu-items
        class="absolute top-32px flex flex-col bg-[rgba(0,0,0,0.8)] px-16px py-12px"
      >
        <slot name="menuItems" />
      </menu-items>
    </transition>
  </head-less-menu>
</template>
