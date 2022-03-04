<template>
  <canvas
    id="three-host"
    ref="canvasRef"
  />
</template>
<script lang="ts" setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import { LoadedResources } from '../../Resources'
import { ThreeApp } from './ThreeApp'
const canvasRef = ref<HTMLCanvasElement | null>(null)
const threeApp = ref<ThreeApp | null>(null)
// 声明需要传入的属性
const props = defineProps<{
  res: LoadedResources
}>()
// 监听资源属性发生的变化，如果资源属性长度不为 0，就可以启动 three 实例
watch(() => props.res, (after, before) => {
  if (after.length !== 0) {
    threeApp.value = new ThreeApp(canvasRef.value!, after)
    // 手动同步 three 的数据
    currentView.value = threeApp.value.currentView
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
// 当页面解除挂载时，销毁 Three 实例
onUnmounted(() => {
  threeApp.value?.destroy()
})
// 下一个视图
const prevView = () => {
  threeApp.value?.prevView()
  // 手动同步 three 的数据
  currentView.value = threeApp.value?.currentView
}
// 上一个视图
const nextView = () => {
  threeApp.value?.nextView()
  // 手动同步 three 的数据
  currentView.value = threeApp.value?.currentView
}
// 当前视图
const currentView = ref<number | undefined>(0)
// 是否是最后一个视图
const isLastView = computed(() => currentView.value === threeApp.value?.allViews)
// 是否是第一视图
const isFirstView = computed(() => currentView.value === 1)
// 把图片切换方法暴露给父组件
defineExpose({ nextPic, prevPic, showOrHidePic, prevView, nextView, currentView, isFirstView, isLastView })
</script>
<style lang="less" scoped>
#three-host {
    width: 100%;
    height: 100%;
}
</style>
