<template>
  <canvas
    id="three-host"
    ref="canvasRef"
  />
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { LoadedResources } from '../../Resources'
import { ThreeApp } from './ThreeApp'
const canvasRef = ref<HTMLCanvasElement | null>(null)
const threeApp = ref<ThreeApp | null>(null)
// 声明需要传入的属性
const props = defineProps<{
  res: LoadedResources
}>()
watch(() => props.res, (after, before) => {
  if (after.length !== 0) {
    threeApp.value = new ThreeApp(canvasRef.value!, after)
  }
})

// 下一张图片
const nextPic = () => {
  // 如果现在 three 示例没有创建好，返回
  if (!threeApp.value) return
  threeApp.value.nextPic()
}
// 上一张图片
const prevPic = () => {
  // 如果现在 three 示例没有创建好，返回
  if (!threeApp.value) return
  threeApp.value.prevPic()
}
// 显示或隐藏辅助 canvas 和辅助图片
const showOrHidePic = (show: boolean) => {
  if (!threeApp.value) return
  threeApp.value.showOrHideHelper(show)
}
// 把图片切换方法暴露给父组件
defineExpose({ nextPic, prevPic, showOrHidePic })
</script>
<style lang="less" scoped>
#three-host {
    width: 100%;
    height: 100%;
}
</style>
