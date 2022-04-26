<!--设定页面-->
<script lang="ts" setup>
import { computed, onActivated, ref } from 'vue'
import settingsList from '../components/settings-list.vue'
import settingsDetail from '../components/settings-detail.vue'
import { usePagination } from '../utils'
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

// 状态管理
const store = useStore()
const { isOnMobile } = storeToRefs(store)

const settings = ref<{
  name: string,
  smallPic: HTMLImageElement | null,
  bigPic: HTMLImageElement | null
}[]>([
  {
    name: 'theShiraishiGroup',
    smallPic:store.getRes('theShiraishiGroupSmall', 'settings').value as HTMLImageElement,
    bigPic: store.getRes('theShiraishiGroup', 'settings').value as HTMLImageElement
  },
  {
    name: 'fujingCity',
    smallPic: store.getRes('fujingCitySmall', 'settings').value as HTMLImageElement,
    bigPic: store.getRes('fujingCity', 'settings').value as HTMLImageElement
  },
  {
    name: 'kusyou',
    smallPic: store.getRes('kusyouSmall', 'settings').value as HTMLImageElement,
    bigPic: store.getRes('kusyou', 'settings').value as HTMLImageElement,
  },
  {
    name: 'theVoidExplosionWar',
    smallPic: store.getRes('theVoidExplosionWarSmall', 'settings').value as HTMLImageElement,
    bigPic: store.getRes('theVoidExplosionWar', 'settings').value as HTMLImageElement
  },
  {
    name: 'theFourHeadMistresses',
    smallPic: store.getRes('beautiesSmall', 'settings').value as HTMLImageElement,
    bigPic: store.getRes('beauties', 'settings').value as HTMLImageElement,
  },
  {
    name: 'greywallCity',
    smallPic: null,
    bigPic: null,
  },
  {
    name: 'fujingYuan',
    smallPic: null,
    bigPic: null,
  }
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
