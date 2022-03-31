<!--设定页面-->
<script lang="ts" setup>
import { computed, ref } from 'vue'
import settingsList from '../components/settings-list.vue'
import jiuxiao from '../assets/settings-page/jiuxiao-temp.png'

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
  { name: '白石集团', smallPic: jiuxiao },
  { name: '福京市', smallPic: jiuxiao },
  { name: '九霄', smallPic: jiuxiao },
  { name: '虚爆战争', smallPic: jiuxiao },
  { name: '四大花魁', smallPic: jiuxiao },
  { name: '灰墙城', smallPic: jiuxiao },
  { name: '福京币', smallPic: jiuxiao }
])
const last = computed(() => settings.value[settings.value.length - 1])
</script>
<template>
  <div class="route-page">
    <!-- 左下角矩阵 -->
    <div class="matrix matrix-left-bottom" />
    <!-- 正常显示层 -->
    <settings-list
      :is-overlay="false"
      :items="settings"
    />
    <!-- 隐藏层 -->
    <settings-list
      :is-overlay="true"
      :items="settings"
    />
    <!-- 页面四角的短横线 -->
    <div class="short-line short-line-top short-line-left" />
    <div class="short-line short-line-top short-line-right" />
    <div class="short-line short-line-bottom short-line-left" />
    <div class="short-line short-line-bottom short-line-right" />
  </div>
</template>
