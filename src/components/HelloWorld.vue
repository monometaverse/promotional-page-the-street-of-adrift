<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

defineProps<{ msg: string }>()

const count = ref(0)
const i18n = useI18n()
const switchLang = () => {
  i18n.locale.value = i18n.locale.value === 'zh' ? 'en' : 'zh'
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a
      href="https://code.visualstudio.com/"
      target="_blank"
    >VSCode</a>
    +
    <a
      href="https://github.com/johnsoncodehk/volar"
      target="_blank"
    >Volar</a>
  </p>

  <p>See <code>README.md</code> for more information.</p>

  <p>
    <a
      href="https://vitejs.dev/guide/features.html"
      target="_blank"
    >
      Vite Docs
    </a>
    |
    <a
      href="https://v3.vuejs.org/"
      target="_blank"
    >Vue 3 Docs</a>
  </p>

  <button
    type="button"
    @click="count++"
  >
    count is: {{ count }}
  </button><br>
  <button
    type="button"
    @click="switchLang"
  >
    {{ i18n.t('switchLang') }}
  </button>
</template>

<style scoped lang="less">
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
