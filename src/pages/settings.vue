<!--设定页面-->
<script lang="ts" setup>
import { ref } from 'vue'
import settingsList from '../components/settings-list.vue'
import settingsDetail from '../components/settings-detail.vue'
import jiuxiao from '../assets/settings-page/jiuxiao-temp.png'
import jiuxiaoBig from '../assets/archive-page/heaven.jpg'

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
  { name: '白石集团', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行' },
  { name: '福京市', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行' },
  { name: '九霄', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行' },
  { name: '虚爆战争', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行' },
  { name: '四大花魁', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行'},
  { name: '灰墙城', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行' },
  { name: '福京币', smallPic: jiuxiao, bigPic: jiuxiaoBig, desc: '设定详情文案第一行\n设定详情文案第二行\n\n设定详情文案第三行'}
])
// 当前正在显示的索引
const currentIndex = ref(0)
// 是否在显示详情页
const showingDetails = ref(false)
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
        @item-click="showingDetails = true"
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
      />
    </transition>
    <!-- 页面四角的短横线 -->
    <div class="short-line short-line-top short-line-left" />
    <div class="short-line short-line-top short-line-right" />
    <div class="short-line short-line-bottom short-line-left" />
    <div class="short-line short-line-bottom short-line-right" />
  </div>
</template>
