<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>()
const props = defineProps<{
  type: 'primary' | 'secondary'
  width: string
  height: string
  isEn: boolean
}>()
</script>
<template>
  <div
    :style="{
      width: width,
      height: height
    }"
  >
    <div
      class="h-full border-2px w-full transition-colors duration-250"
      :class="{
        'border-white btn-primary': type === 'primary',
        'border-white/50 btn-secondary': type === 'secondary',
      }"
    >
      <div
        class="bg h-full w-full transition-opacity duration-250 clickble"
        :class="{
          'btn-primary-inner': type == 'primary',
          'btn-secondary-inner': type == 'secondary'
        }"
        @click="emit('click')"
      />
    </div>
    <div
      :style="{
        width: width,
        height: height
      }"
      class="flex font-serif font-900 transform -translate-y-[100%] items-center justify-center pointer-events-none"
      :class="[isEn ? 'text-[1.25rem] <sm:text-[0.75rem]' : 'text-[1.5rem] <sm:text-[1rem]', type === 'primary' ? 'text-black' : 'text-white']"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.bg {
  background-image: url('../assets/nft-page/reserve-btn-background.svg');
  background-position: center;
  background-repeat: repeat-x;
}

.btn-primary {
  background-color: rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  &-inner {
    opacity: 0.5;
  }

  &:hover &-inner {
    opacity: 1;
  }
}

.btn-secondary {
  background-color: transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &-inner {
    opacity: 0.2;
  }

  &:hover &-inner {
    opacity: 1;
  }
}
</style>
