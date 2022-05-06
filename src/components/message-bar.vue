<!-- 用来短暂的显示提示信息 -->
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { MyMessageEvent } from '../utils/'

const show = ref(false)
const text = ref('')

onMounted(() => {
  window.addEventListener('showSnackBar', (ev: Event) => {
    const localEv = ev as MyMessageEvent
    show.value = true
    text.value = localEv.text
  })
  window.addEventListener('hideSnackBar', () => {
    show.value = false
  })
})
</script>
<template>
  <div
    class="absolute flex justify-center items-center top-4rem <xl:top-2rem <sm:top-1rem left-0 w-[100vw] transition transform duration-250 z-1000"
    :class="{
      '-translate-y-20px opacity-0 pointer-events-none': !show
    }"
  >
    <div
      class="flex items-center bg-black w-400px p-1rem justify-between"
    >
      <div class="font-sans text-1rem <sm:(text-0.75rem) mr-1.5rem text-white">
        {{ text }}
      </div>
      <div
        class="close-btn clickble"
        @click="show = false"
      />
    </div>
  </div>
</template>
