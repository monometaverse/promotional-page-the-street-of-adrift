<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useStore } from '../store'
import { shuffle } from 'lodash'
import { useEventListener } from '@vueuse/core'

// 状态管理
const store = useStore()
const { windowWidth, windowHeight, mousePos, infoElPos, isOnMobile, isOnTablet, isOnMobileByUserAgent } = storeToRefs(store)
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
  // 当图片为空时
  if (newVal.width === 0) {
    targetAlpha = 0
    if (points.length !== 0) {
      // 如果有存在的粒子，让粒子分散到屏幕各处，然后消失
      points.forEach((it) => {
        it.targetX = Math.random() * (canvasEl.value?.width ?? 0)
        it.targetY = Math.random() * (canvasEl.value?.height ?? 0)
      })
    }
    return
  }
  // 如果没有获取到角色信息块的位置，停止处理
  if (!infoElPos.value.x && !infoElPos.value.y) return
  // 开始处理图片高宽
  const picSize = isOnMobile.value ? 120 * 1.5 : (isOnTablet.value ? 240 * 1.5 : 360 * 1.5)
  const width = Number(newVal.width)
  newVal.width = picSize
  newVal.height = newVal.height * picSize / width
  if (newVal.height > picSize) {
    const height = Number(newVal.height)
    newVal.height = picSize
    newVal.width = newVal.width * picSize / height
  }
  targetAlpha = 1
  // 开始锁住画布，停止绘制
  pausePointRender.value = true
  ctx.clearRect(0,0,canvasEl.value?.width ?? 0, canvasEl.value?.height ?? 0)
  ctx.globalAlpha = 1
  ctx.drawImage(newVal, 0, 0, newVal.width, newVal.height)
  // 获取到图片的信息
  const imageData = ctx.getImageData(0,0,newVal.width, newVal.height).data
  // 清除图片
  ctx.globalAlpha = 0
  ctx.clearRect(0, 0, canvasEl.value!.width, canvasEl.value!.height)
  // 记录已遍历的点的数量
  let pointsPos: { x: number, y: number }[] = []
  // 采样密度，越低越密
  const denisty = isOnMobile.value ? 2 : isOnTablet.value ? 3 : 4
  // 根据图片的颜色信息生成点阵，用图片的高宽去计算到应该获取到像素点位置
  for (let h = 0; h < newVal.height; h += denisty) {
    for (let w = 0; w < newVal.width; w += denisty) {
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
  // 根据角色信息块的位置来计算粒子的位置
  let offsetX = infoElPos.value.x
  let offsetY = infoElPos.value.y - picSize / 1.5
  // 因为角色页刚进入时获取到的位置是被偏移过的，需要进行额外的判断
  if (offsetY > windowHeight.value) {
    offsetY -= windowHeight.value
  } else if (offsetY < 0) {
    offsetY += windowHeight.value
  }
  // 手机端额外判断，移动到右上角
  if (isOnMobile.value) {
    offsetX = innerWidth - picSize / 1.5 - (innerWidth / 2 + 20 - 187.5)
    offsetY = (innerHeight / 2) + 64 - 406
  }
  for (let i = 0; i < pointsPos.length ;i ++) {
    if (i < points.length) {
      // 把已经存在的点移动到相应位置
      points[i].targetX = offsetX + (pointsPos[i].x + Math.random() - 0.5) / 1.5
      points[i].targetY = offsetY + (pointsPos[i].y + Math.random() - 0.5) / 1.5
    } else {
      // 生成缺少的点
      const index = Math.floor(Math.random() * pointsPos.length) // 新的点会被插入到的位置
      points.splice(index, 0, {
        x: Math.random() * canvasCtx.value.canvas.width,
        y: Math.random() * canvasCtx.value.canvas.height,
        targetX: offsetX + (pointsPos[i].x + Math.random() - 0.5) / 1.5,
        targetY: offsetY + (pointsPos[i].y + Math.random() - 0.5) / 1.5
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
const mouseAbsorbDistanceMax = 128
// 当在最大受影响范围内时，最大的偏移距离
const maxOffset = 32
// 全局透明度
let targetAlpha = 1
// 渲染函数
const render = () => {
  const ctx = canvasCtx.value
  // 如果没有上下文，就不继续了
  if (!ctx) return
  if (!pausePointRender.value) {
    ctx.globalAlpha += (targetAlpha - ctx.globalAlpha) / (targetAlpha > ctx.globalAlpha ? 60 : 10)
    // 清除整个画布
    ctx.clearRect(0,0, canvasEl.value?.width ?? 0, canvasEl.value?.height ?? 0)
    points.forEach((it) => {
      if (isOnMobileByUserAgent.value) {
        // 在手机端，不受鼠标位置影响
        it.x += (it.targetX - it.x) / 40
        it.y += (it.targetY - it.y) / 40
      } else {
        // 计算鼠标和目标点的距离
        const mouseDistance = Math.sqrt(Math.pow(mousePos.value.x - it.targetX, 2) + Math.pow(mousePos.value.y - it.targetY, 2))
        // 计算鼠标和点当前的距离
        const mouseDistanceCurrent = Math.sqrt(Math.pow(mousePos.value.x - it.x, 2) + Math.pow(mousePos.value.y - it.y, 2))
        if (mouseDistanceCurrent <= mouseAbsorbDistance) {
          if (mouseDistance <= mouseAbsorbDistanceMax) {
            // 当鼠标和目标点的距离小于最小受影响范围时，粒子移动到鼠标的位置，而不是目标点的位置
            it.x += (mousePos.value.x + Math.random() * 32 - 16 - it.x) / 10
            it.y += (mousePos.value.y + Math.random() * 32 - 16 - it.y) / 10
          } else {
            // 偏移的距离，斜边长度
            const percent = mouseAbsorbDistance / mouseDistance * maxOffset
            const offsetY = (mousePos.value.y - it.targetY) * percent / mouseDistance
            const offsetX = (mousePos.value.x - it.targetX) * percent / mouseDistance
            // 在最大受影响范围内时，把粒子移动到偏移过的目标点
            it.x += (it.targetX + offsetX - it.x) / 40
            it.y += (it.targetY + offsetY - it.y) / 40
          }
        } else {
          // 偏移的距离，斜边长度
          const percent = mouseAbsorbDistance / mouseDistanceCurrent * maxOffset
          const offsetY = (mousePos.value.y - it.targetY) * percent / mouseDistanceCurrent
          const offsetX = (mousePos.value.x - it.targetX) * percent / mouseDistanceCurrent
          // 在最大受影响范围内时，把粒子移动到偏移过的目标点
          it.x += (it.targetX + offsetX - it.x) / 40
          it.y += (it.targetY + offsetY - it.y) / 40
        }
      }
      // 渲染粒子
      ctx.beginPath()
      ctx.arc(it.x, it.y, 0.8, 0, Math.PI * 2)
      ctx.fillStyle = '#eee'
      ctx.fill()
      ctx.closePath()
    })
  }
  if (!stopRender.value) requestAnimationFrame(render)
}
// 画布宽高改变事件
useEventListener('resize', () => {
  if (canvasCtx.value) canvasCtx.value.globalAlpha = 0
})
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
