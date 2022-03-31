<script lang="ts" setup>import { computed } from 'vue'
// 定义属性
const props = defineProps<{
  items: { name: string, smallPic: string }[], // TODO: 从 i18n 获取类型
  isOverlay: boolean
}>()
const last = computed(() => {
  return props.items[props.items.length - 1]
})
// 定义要触发的事件
const emit = defineEmits<{
  onItemClick: (index: number) => void
}>()
// 当列表中的项被点击时
const onItemClick = (index: number) => () => {
  if (props.isOverlay) {
    emit.onItemClick(index)
  }
}

</script>
<template>
  <!-- 设定列表 -->
  <div
    class="settings-list"
    :class="{
      'settings-list-overlay': props.isOverlay
    }"
  >
    <!-- 左侧渐变线 -->
    <div
      class="settings-list-left"
      :class="{
        '!opacity-0': props.isOverlay
      }"
    />
    <!-- 中间部分 -->
    <div class="settings-list-center">
      <!-- 第一行 -->
      <div class="settings-list-line settings-list-line-1">
        <div
          class="settings-item clickble"
          :class="{
            '!border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500': props.isOverlay
          }"
          v-for="setting in items.slice(0, 3)"
          :key="setting.name"
          @click="onItemClick(items.indexOf(setting))"
          :style="{
            'background-image': isOverlay ? `url('${last.smallPic}')` : ''
          }"
        >
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="props.isOverlay"
          >
            <div class="rotated-line rotated-line-1 clickble" />
            <div class="rotated-line rotated-line-2 clickble" />
          </div>
          <span class="settings-item-text clickble">{{ setting.name }}</span>
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="isOverlay"
          >
            <div class="rotated-line rotated-line-2 clickble" />
            <div class="rotated-line rotated-line-1 clickble" />
          </div>
        </div>
      </div>
      <!-- 第二行 -->
      <div class="settings-list-line">
        <div
          class="settings-item"
          :class="{
            '!border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500': isOverlay
          }"
          v-for="setting in items.slice(3, 6)"
          :key="setting.name"
          @click="onItemClick(items.indexOf(setting))"
          :style="{
            'background-image': isOverlay ? `url('${last.smallPic}')` : ''
          }"
        >
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="isOverlay"
          >
            <div class="rotated-line rotated-line-1 clickble" />
            <div class="rotated-line rotated-line-2 clickble" />
          </div>
          <span class="settings-item-text">{{ setting.name }}</span>
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="isOverlay"
          >
            <div class="rotated-line rotated-line-2 clickble" />
            <div class="rotated-line rotated-line-1 clickble" />
          </div>
        </div>
        <!-- 图标和游戏名 -->
        <div
          class="game-name-with-icon"
          v-if="!props.isOverlay"
        >
          <div class="game-name-with-icon-icon" />
          <div class="game-name-with-icon-name">
            THE STREET OF ADRIFT
          </div>
        </div>
      </div>
      <!-- 第三行 -->
      <div class="settings-list-line settings-list-line-2">
        <div
          class="settings-item"
          :class="{
            '!border-0 clickble opacity-0 hover:opacity-100 transition-opacity duration-500': isOverlay
          }"
          @click="onItemClick(items.length - 1)"
          :style="{
            'background-image': isOverlay ? `url('${last.smallPic}')` : ''
          }"
        >
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="isOverlay"
          >
            <div class="rotated-line rotated-line-1 clickble" />
            <div class="rotated-line rotated-line-2 clickble" />
          </div>
          <span class="settings-item-text">{{ last.name }}</span>
          <!-- 两根线装饰 -->
          <div
            class="rotated-lines clickble"
            v-if="isOverlay"
          >
            <div class="rotated-line rotated-line-2 clickble" />
            <div class="rotated-line rotated-line-1 clickble" />
          </div>
        </div>
        <div
          class="settings-item settings-item-empty"
          :class="{
            'opacity-0': isOverlay
          }"
        />
        <div
          class="settings-item settings-item-empty"
          :class="{
            'opacity-0': props.isOverlay
          }"
        />
      </div>
    </div>
    <!-- 右侧渐变线 -->
    <div
      class="settings-list-right"
      :class="{
        '!opacity-0': props.isOverlay
      }"
    />
  </div>
</template>
<style lang="less" scoped>
.settings-list {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  height: 100%;
  width: 100%;

  &-left,
  &-right {
    width: 256px;
    height: 2px;
    opacity: 0.5;
  }

  &-left {
    background-image: linear-gradient(90deg, transparent 0%, white 100%);
  }

  &-right {
    background-image: linear-gradient(90deg, white 0%, transparent 100%);
  }

  &-center {
    display: flex;
    row-gap: 8px;
    flex-direction: column;
  }

  &-line {
    display: flex;
    column-gap: 8px;

    &-1 {
      margin-left: 178px;
    }

    &-2 {
      margin-left: 350px;
    }
  }
}

.rotated-lines {
  display: flex;
  justify-content: space-between;
  padding: 24px 33px;
}

.rotated-line {
  width: 2px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.5);

  &-1 {
    transform: rotate(-45deg);
  }

  &-2 {
    transform: rotate(45deg);
  }
}

.settings-item {
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  width: 256px;
  height: 256px;
  display: flex;
  justify-content: center;
  align-items: center;

  &-text {
    font-size: 40px;
    line-height: 57px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
  }

  &-empty {
    &::after {
      content: '';
      width: 256px;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.5);
      transform: rotate(-45deg);
    }
  }
}

// 叠加在上面的隐藏层
.settings-list-overlay {
  position: absolute;
  top: 0;
  left: 0;

  .settings-item {
    flex-direction: column;
    justify-content: unset;
    align-items: unset;

    &-text {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.game-name-with-icon {
  margin-left: 24px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: flex-start;

  &-icon {
    width: 24px;
    height: 24px;
    background-image: url('../assets/characters-page/character-active.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.5;
  }

  &-name {
    margin-top: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    font-family: 'Montserrat', sans-serif;
    opacity: 0.5;
  }
}
</style>
