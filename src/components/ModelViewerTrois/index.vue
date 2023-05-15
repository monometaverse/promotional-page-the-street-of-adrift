<script setup lang="ts">
import { Renderer, Scene, Camera } from 'troisjs'
import { NFTItem } from '../ResourceLoader/Resources'
import { ref, toRaw, watch } from 'vue'
import { Group, Material, Mesh, Object3D, PMREMGenerator } from 'three'
import { getChildObject } from '../../utils'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
import { gsap } from 'gsap'

// 定义父组件要传入的属性
const props = defineProps<{
  items: NFTItem[],
  showingItem: number,
}>()

const models: Group[] = []
const renderer = ref<InstanceType<typeof Renderer>>()

function onReady() {
  if (!renderer.value) return
  // 设置统一的环境贴图
  const pemremGenerator = new PMREMGenerator(renderer.value.renderer)
  renderer.value.scene!.environment = pemremGenerator.fromScene(new RoomEnvironment()).texture

  props.items.forEach(it => {
    const customData = it.customData
    // 根据自定义数据，对模型材质进行修正
    if (customData) {
      it.model.position.set(customData.positionX ?? 0, customData.positionY ?? 0, customData.positionZ ?? 0)
      if (customData.scale) it.model.scale.set(customData.scale, customData.scale, customData.scale)
      if (customData.childName) {
        const child = getChildObject(it.model, customData.childName, true, true) as Mesh
        if (!child) throw new Error('指定的要修改的子对象不存在: ' + customData.childName)
        let material = child.material as Material
        if (customData.depthWrite) material.depthWrite = true
        if (customData.side) material.side = customData.side
        // 有修正的材质
        if (customData.correctMaterial) {
          child.material = customData.correctMaterial
        }
      }
    }

    models.push(toRaw(it.model))
    renderer.value?.scene?.add(models[0])
  })
}

watch(() => props.showingItem, (newItem, oldItem) => {
  renderer.value?.camera?.position.set(0,0,5)
  const oldModel = models[oldItem]
  const newModel = models[newItem]
  let moveDistance = 0
  if (oldItem === models.length - 1 && newItem === 0) {
    moveDistance = 10
  } else if (oldItem === 0 && newItem === models.length -1) {
    moveDistance = -10
  } else {
    moveDistance = newItem > oldItem ? 10 : -10
  }

  const customData = props.items[newItem].customData
  renderer.value?.scene?.add(models[newItem])
  gsap.fromTo(newModel.position, { x: -moveDistance + oldModel.position.x }, { x: customData?.positionX ?? 0, duration: 0.5 })
  gsap.fromTo(oldModel.position, { x: oldModel.position.x }, { x: moveDistance, duration: 0.5, onComplete: () => {
    renderer.value?.scene?.remove(models[oldItem])
  }})
})

</script>

<template>
  <Renderer
    ref="renderer"
    alpha
    antialias
    resize
    @ready="onReady"
    :orbit-ctrl="{
      enableDamping: true,
      autoRotate: true,
      enableZoom: false, // 禁止缩放
      enablePan: false // 禁止改变位置
    }"
  >
    <Camera :position="{ z:5 }" />
    <Scene />
  </Renderer>
</template>
