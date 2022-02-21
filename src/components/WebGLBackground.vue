<template>
  <canvas
    id="three-host"
    ref="canvasRef"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ThreeApp } from './ThreeApp'
const canvasRef = ref<HTMLCanvasElement | null>(null)
const threeApp = ref<ThreeApp | null>(null)
// 当页面挂载时
onMounted(() => {
    threeApp.value = new ThreeApp(canvasRef.value!)
})
</script>
<style lang="less" scoped>
#three-host {
    width: 100%;
    height: 100%;
}
</style>
