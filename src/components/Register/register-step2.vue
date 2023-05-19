<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from '../text-button.vue'
import api from '../../api/index'
import { isSuccess } from '../../api/index'
import { useMessage } from '../../store'
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { watch } from 'vue'

const props = defineProps<{
  email: string
  isPasswordReset: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'next'): void
}>()

const {t,locale} = useI18n()
const msg = useMessage()
const captchaCode = ref<string>('')

const loading = ref(false)
async function verify() {
  if (captchaCode.value.length !== 6) return
  if (loading.value) return
  loading.value = true
  try {
    const res = await api.user.submitCaptchaCode(props.email, captchaCode.value, props.isPasswordReset)
    if (isSuccess(res)) {
      msg.show(t('register.verify-success'))
      emit('next')
      return
    }
    switch (res.code) {
      case 40004:
        msg.show(t('register.max-retry-limit-reached'))
        return
      case 40005:
        msg.show(t('register.captcha-incorrect'))
        return
      case 40011:
        msg.show(t('register.captcha-expired'))
        return
      default:
        // 其它错误
        msg.show(t('login.other-error'))
    }
  } finally {
    // 一秒后才允许重试
    setTimeout(() => loading.value = false, 1000)
  }
}

function close() {
  emit('cancel')
}

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key != 'Backspace') {
    if (!'0123456789'.includes(e.key)) {
      return
    }

    // 已经是最后一个数字了，不处理
    if (captchaCode.value.length === 6) {
      return
    }

    captchaCode.value += e.key

    return
  }
  // 已经是第一个数字了，不处理
  if (captchaCode.value.length === 0) {
    return
  }

  captchaCode.value = captchaCode.value.slice(0, captchaCode.value.length - 1)
})
</script>
<template>
  <div>
    <div class="w-30rem p-8 h-20rem flex flex-col justify-between step-2">
      <div class="text-[3rem] delay-1 text-center">
        {{ isPasswordReset ? t('static.password-reset') : t('static.register') }}
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center delay-2">
        <div class="w-[100%] text-[1.5rem] mb-6">
          {{ t('register.captcha') }}
        </div>
        <div class="flex gap-x-4 w-full">
          <div
            v-for="(i, index) in Array(6)"
            :key="index"
            class="captcha-input clickble flex-1 flex justify-center items-center"
            :class="{
              'captcha-input-focus': captchaCode.length === index || (index === 5 && captchaCode.length === 6)
            }"
          >
            {{ captchaCode[index] }}
          </div>
        </div>
      </div>
      <div class="w-[100%] flex gap-x-[2rem] delay-3">
        <TextButton
          :disabled="loading"
          @click="close"
          :is-en="false"
          height="3rem"
          width="100%"
          type="secondary"
        >
          {{ t('register.back') }}
        </TextButton>
        <TextButton
          :is-en="false"
          height="3rem"
          width="100%"
          :type="captchaCode.length === 6 ? 'primary' : 'secondary'"
          @click="verify"
        >
          {{ loading ? t('register.verifying-captcha') : t('register.verify-captcha') }}
        </TextButton>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.captcha-input {
  background-color: rgba(255, 255, 255, 0);
  border: rgba(255, 255, 255, 0.5) 2px solid;
  width: 100%;
  height: 3.75rem;
  color: white;
  font-family: 'Noto Sans SC', sans-serif;
  padding-bottom: 0.25rem;
  transition-property: all;
  transition-duration: 250ms;
  font-size: 2rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    border: rgba(255, 255, 255, 0.5) 2px solid;
  }
}

.captcha-input-focus {
  background-color: rgba(255, 255, 255, 0.5) !important;
  border: rgba(255, 255, 255, 0.8) 2px solid !important;
}
</style>
