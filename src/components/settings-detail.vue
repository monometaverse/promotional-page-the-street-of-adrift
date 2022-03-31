<script lang="ts" setup>
// 定义会触发的事件
const emits = defineEmits<{
  (e: 'close'): void
}>()
</script>
<template>
  <div class="details">
    <div class="details-temp">
      <div class="details-text">
        这里会显示设定详情
      </div>
      <div
        class="details-close"
        @click="emits('close')"
      >
        返回列表页
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.details {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex; // TODO: 正式写的时候删掉
  justify-content: center; // TODO: 正式写的时候删掉
  align-items: center; // TODO: 正式写的时候删掉
  &-close {
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.5);

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &-temp {
    padding: 64px;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  &-text {
    font-size: 36px;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    margin-bottom: 24px;
  }
}
</style>
