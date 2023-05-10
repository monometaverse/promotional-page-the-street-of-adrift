<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from './text-button.vue'
import api from '../api/index'
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const {t,locale} = useI18n()

const email = ref('')
const passwd = ref('')
async function login() {
  const result = await api.user.login(email.value, passwd.value)
  console.log(result)
  // TODO: 参数验证，尝试引入 slimeform?
}
</script>
<template>
  <Transition
    appear
    leave-active-class="transition duration-250"
    enter-active-class="transition duration-250"
    leave-to-class="transform -translate-y-1.5rem opacity-0"
    enter-from-class="transform -translate-y-1.5rem opacity-0"
  >
    <div
      v-if="show"
      class="w-30rem p-8 h-24rem bg-[#0f0f0f] font-serif flex flex-col justify-between items-center <sm:(w-20rem h-34.25rem) z-998"
    >
      <div class="text-[3rem]">
        {{ t('static.login') }}
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center">
        <div class="w-[100%] text-[1.5rem] mb-3">
          {{ t('login.email') }}
        </div>
        <input
          v-model="email"
          type="text"
          class="text-input"
          @keydown.enter="login"
        >
        <div class="w-[100%] text-[1.5rem] my-3">
          {{ t('login.pwd') }}
        </div>
        <input
          v-model="passwd"
          type="password"
          class="text-input"
          @keydown.enter="login"
        >
      </div>
      <div class="w-[100%] flex gap-x-[2rem]">
        <TextButton
          @click="emit('close')"
          :is-en="false"
          height="3rem"
          width="100%"
          type="secondary"
        >
          {{ t('static.cancel-login') }}
        </TextButton>
        <TextButton
          :is-en="false"
          height="3rem"
          width="100%"
          type="primary"
          @click="login"
        >
          {{ t('static.login') }}
        </TextButton>
      </div>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.text-input {
  background-color: rgba(255, 255, 255, 0);
  border: rgba(255, 255, 255, 0.5) 2px solid;
  outline: none;
  width: 100%;
  height: 3rem;
  color: white;
  font-family: 'Noto Sans SC', sans-serif;
  padding: 0 0.75rem;
  transition-property: all;
  transition-duration: 250ms;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border: rgba(255, 255, 255, 0.5) 2px solid;
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.5);
    border: rgba(255, 255, 255, 0.8) 2px solid;
  }
}
</style>
