<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from 'vue'
import { useStore } from '../store'
// 状态管理
const store = useStore()
const { windowWidth, windowHeight } = storeToRefs(store)
// canvas 的引用
const canvasEl = ref<HTMLCanvasElement | null>(null)
// canvas 上下文
const canvasCtx = computed(() => {
  return canvasEl.value?.getContext('2d')
})
// 粒子点对象
const points: {
  x: number, // 目前的位置 x
  y: number, // 目前的位置 y
  targetX: number, // 将要移动到的位置 x
  targetY: number  // 将要移动到的位置 y
}[] = []
// 监听图片的变化
watchEffect(() => {
  const ctx = canvasCtx.value
  if (!ctx) return
  const newVal = store.showingCharacter
  ctx.drawImage(newVal, 0, 0, newVal.width, newVal.height)
  // 获取到图片的信息
  const imageData = ctx.getImageData(0,0,newVal.width, newVal.height).data
  // 清除图片
  ctx.clearRect(0, 0, canvasEl.value!.width, canvasEl.value!.height)
  // 记录已遍历的点的数量
  let pointsPos: { x: number, y: number }[] = []
  // 根据图片的颜色信息生成点阵，用图片的高宽去计算到应该获取到像素点位置
  for (let h = 0; h < newVal.height; h += 4) {
    for (let w = 0; w < newVal.width; w += 4) {
      const position = (newVal.width * h + w) * 4 // 数组是以 rgba 的顺序排列的，每跳过一个像素点需要跳过 4 个索引值
      const r = imageData[position], g = imageData[position + 1], b = imageData[position + 2], a = imageData[position + 3]
      // 如果颜色值为白色，才进行下一步处理
      if (r + g + b + a === 255 * 4) {
        pointsPos.push({ x: w, y: h })
      }
    }
  }
  // 移除多余的点
  points.slice(0, pointsPos.length)
  for (let i = 0; i < pointsPos.length ;i ++) {
    if (i < points.length) {
      // 把已经存在的点移动到相应位置
      points[i].targetX = pointsPos[i].x
      points[i].targetY = pointsPos[i].y
    } else {
      // 生成缺少的点
      points.push({ x: 0, y: 0, targetX: pointsPos[i].x, targetY: pointsPos[i].y })
    }
  }
})
// 是否停止帧刷
const stopRender = ref(false)
// 渲染函数
const render = () => {
  const ctx = canvasCtx.value
  // 如果没有上下文，就不继续了
  if (!ctx) return
  // 清除整个画布
  ctx.clearRect(0,0, canvasEl.value!.width, canvasEl.value!.height)
  points.forEach((it) => {
    console.log('drawing point')
    // 移动粒子
    it.x += (it.targetX - it.x) / 40
    it.y += (it.targetY - it.y) / 40
    // 渲染粒子
    ctx.beginPath()
    ctx.arc(it.x, it.y, 1, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
  })
  if (!stopRender.value) requestAnimationFrame(render)
  console.log(Date.now(), 'end')
}
// 当挂载时开始帧刷
onMounted(() => {
  requestAnimationFrame(render)
})
// 当卸载时停止帧刷
onUnmounted(() => {
  stopRender.value = true
})
</script>
<template>
  <canvas
    ref="canvasEl"
    :width="windowWidth"
    :height="windowHeight"
  />
</template>
<style lang="less" scoped>
canvas {
  position: absolute;
}
</style>
