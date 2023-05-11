<!-- 用来短暂的显示提示信息 -->
<script lang="ts" setup>
import { MessageInfo } from '../store'

defineProps<{
  info: MessageInfo
}>()

const emit = defineEmits<{
  (e: 'close', id: number): void
}>()
</script>
<template>
  <div
    class="flex justify-center items-center pointer-events-none w-[100vw] mt-4rem <xl:mt-2rem <sm:mt-1rem duration-250"
  >
    <div
      class="flex items-center bg-black w-400px p-1rem justify-between"
    >
      <div class="font-sans text-1rem <sm:(text-0.75rem) mr-1.5rem text-white">
        {{ info.text }}
      </div>
      <div
        class="close-btn clickble pointer-events-auto"
        @click="emit('close', info.id)"
      />
    </div>
  </div>
</template>
