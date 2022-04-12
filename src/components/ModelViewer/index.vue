<script lang="ts" setup>
import { computed, CSSProperties, onActivated, onDeactivated, onMounted, ref, watch } from 'vue'
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { useStore } from '../../store'
import { storeToRefs } from 'pinia'
import { ThreeApp } from './ThreeApp'
// pinia 状态管理
const store = useStore()
const { windowWidth, windowHeight } = storeToRefs(store)
// 定义父组件要传入的属性
const props = defineProps<{
  width: number,
  height: number,
  top: number,
  left: number
}>()
// canvas 要用的样式
const canvasStyle = computed<CSSProperties>(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'absolute',
  top: `${props.top < 0 ? props.top + windowHeight.value : props.top > windowHeight.value ? props.top - windowHeight.value : props.top}px`,
  left: `${props.left}px`,
  zIndex: 998,
}))
// canvas 引用
const canvasEl = ref<HTMLCanvasElement | null>(null)
// 模型切换时进行的操作
// 如果是下一个，把下一个模型放到当前模型的右边，然后把当前模型和下一个模型都向左移动
// 如果是上一个，把上一个模型放到当前模型的左边，然后把当前模型和上一个模型都向右移动
// Three 实例
let threeApp: ThreeApp | null = null
// 当挂载时开始渲染
onMounted(() => {
  threeApp = new ThreeApp(canvasEl.value!)
  threeApp.render()
})
// 监听属性变化
watch(() => [props.width, props.height], (newVal) => {
  const [width, height] = newVal
  threeApp?.setWidthHeight(width, height)
})
// 当激活时继续渲染
onActivated(() => {
  threeApp?.resumeRender()
})
// 当休眠时暂停渲染
onDeactivated(() => {
  threeApp?.pauseRender()
})
</script>
<template>
  <canvas
    :style="canvasStyle"
    ref="canvasEl"
    :width="width"
    :height="height"
  />
</template>
