<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useStore } from '../store'
import { shuffle } from 'lodash'

// 状态管理
const store = useStore()
const { windowWidth, windowHeight, mousePos } = storeToRefs(store)
// canvas 的引用
const canvasEl = ref<HTMLCanvasElement | null>(null)
// canvas 上下文
const canvasCtx = computed(() => {
  return canvasEl.value?.getContext('2d')
})
// 粒子点对象
let points: {
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
  // 开始锁住画布，停止绘制
  pausePointRender.value = true
  ctx.clearRect(0,0,canvasEl.value?.width ?? 0, canvasEl.value?.height ?? 0)
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
  // 打乱数组
  points = shuffle(points)
  // 移除多余的点
  points = points.slice(0, pointsPos.length)

  for (let i = 0; i < pointsPos.length ;i ++) {
    if (i < points.length) {
      // 把已经存在的点移动到相应位置
      points[i].targetX = pointsPos[i].x
      points[i].targetY = pointsPos[i].y
    } else {
      // 生成缺少的点
      points.push({
        x: Math.random() * newVal.width,
        y: Math.random() * newVal.width,
        targetX: pointsPos[i].x,
        targetY: pointsPos[i].y
      })
    }
  }
  // 解锁画布，继续绘制
  pausePointRender.value = false
})
// 是否停止帧刷
const stopRender = ref(false)
// 是否暂停绘制，在获取新的图片信息时，需要暂停点的绘制，否则会获取到已经存在的点的信息，并且把这些点的位置信息误当成图片信息
const pausePointRender = ref(false)
// 鼠标距离目标点多少会被吸引
const mouseAbsorbDistance = 64
// 渲染函数
const render = () => {
  const ctx = canvasCtx.value
  // 如果没有上下文，就不继续了
  if (!ctx) return
  if (!pausePointRender.value) {
    // 清除整个画布
    ctx.clearRect(0,0, canvasEl.value!.width, canvasEl.value!.height)
    points.forEach((it) => {
      // 计算鼠标和目标点的距离
      const mouseDistance = Math.sqrt(Math.pow(mousePos.value.x - it.targetX, 2) + Math.pow(mousePos.value.y - it.targetY, 2))
      if (mouseDistance <= mouseAbsorbDistance) {
        // 当鼠标和目标点的距离小于一定的值时，粒子移动到鼠标的位置，而不是目标点的位置
        it.x += (mousePos.value.x - it.x) / 10
        it.y += (mousePos.value.y - it.y) / 10
      } else {
        // 移动粒子
        it.x += (it.targetX - it.x) / 40
        it.y += (it.targetY - it.y) / 40
      }
      // 渲染粒子
      ctx.beginPath()
      ctx.arc(it.x, it.y, 1, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.closePath()
    })
  }
  if (!stopRender.value) requestAnimationFrame(render)
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
