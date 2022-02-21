<script setup lang="ts">
import WebGLBackground from './components/WebGLBackground.vue'
</script>
<template>
  <div class="static-framework">
    <h1 class="title">
      彷徨之街宣传页
    </h1>
  </div>
  <WebGLBackground />
</template>

<style lang="less">
  @static-z-index: 1000;
  html, body, #app {
    margin: 0;
    height: 100%;
  }
  #app {
    background: black;
    color: white;
    .static-framework {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: @static-z-index;
      .title {
        width: 100%;
        text-align: center;
        top: 20px;
      }
    }
  }
</style>
