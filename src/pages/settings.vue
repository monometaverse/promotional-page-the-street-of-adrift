<!--设定页面-->
<script lang="ts" setup>
import { computed, onActivated, ref } from 'vue'
import settingsList from '../components/settings-list.vue'
import settingsDetail from '../components/settings-detail.vue'
import jiuxiao from '../assets/settings-page/jiuxiao-temp.png'
import jiuxiaoBig from '../assets/archive-page/heaven.jpg'
import { usePagination } from '../utils'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

// 状态管理
const store = useStore()
const { isOnMobile } = storeToRefs(store)

/**
 * 在 i18n 文件中的样子应该是
 * {
 *    name: string,     // 设定名称
 *    smallPic: string, // 图片名称，包含扩展名，用来显示在列表里
 *    bigPic: string,   // 图片名称，包含扩展名，用来显示在详情页里
 *    desc: string      // 详细信息
 * }[]
 */
// TODO: 改为从 i18n 文件中获取
const settings = ref([
  { name: 'theShiraishiGroup', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'fujingCity', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'kusyou', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'theVoidExplosionWar', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'theFourHeadMistresses', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'greywallCity', smallPic: jiuxiao, bigPic: jiuxiaoBig },
  { name: 'fujingYuan', smallPic: jiuxiao, bigPic: jiuxiaoBig }
])
// 当前正在显示的索引
const { currentIndex, next, prev } = usePagination(settings)
// 是否在显示详情页
const showingDetails = computed((() => {
  const isShow = ref(false)
  return {
    get: () => isShow.value || isOnMobile.value,
    set: (val: boolean) => isShow.value = val
  }
})())
// 当设定中的一项被点击时
const onItemClick = (index: number) => {
  currentIndex.value = index
  showingDetails.value = true
}
// 当页面激活时，回到列表页
onActivated(() => {
  showingDetails.value = false
})
</script>
<template>
  <div class="route-page">
    <!-- 左下角矩阵 -->
    <div class="matrix matrix-left-bottom" />
    <transition name="scale-fade">
      <!-- 隐藏层 -->
      <settings-list
        :is-overlay="true"
        :items="settings"
        v-show="!showingDetails"
        @item-click="onItemClick"
      />
    </transition>
    <transition name="scale-fade">
      <!-- 正常显示层 -->
      <settings-list
        :is-overlay="false"
        :items="settings"
        v-show="!showingDetails"
      />
    </transition>
    <transition name="scale-fade">
      <settings-detail
        v-show="showingDetails"
        @close="showingDetails = false"
        :items="settings"
        v-model="currentIndex"
        @prev="prev"
        @next="next"
      />
    </transition>
    <!-- 页面四角的短横线 -->
    <div class="short-line short-line-top short-line-left <xl:hidden" />
    <div class="short-line short-line-top short-line-right <xl:hidden" />
    <div class="short-line short-line-bottom short-line-left <xl:hidden" />
    <div class="short-line short-line-bottom short-line-right <xl:hidden" />
  </div>
</template>
