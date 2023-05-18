<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from '../text-button.vue'
import api from '../../api/index'
import { isSuccess } from '../../api/index'
import { useForm } from 'slimeform'
import { useMessage } from '../../store'
import { useStore } from '../../store'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'next'): void
}>()

const store = useStore()
const {t,locale} = useI18n()
const msg = useMessage()

const { form, status, reset } = useForm({
  form: () => ({
    email: '',
    passwd: ''
  }),
  rule: {
    email: (it: string) => it ? /^\S+\@\S+\.\S+$/s.test(it) ? true : t('login.email-format-error') : t('login.email-empty'),
  },
})

const loading = ref(false)
async function login() {
  if (loading.value) return
  loading.value = true
  try {
    if (status.email.isError) {
      msg.show(status.email.message)
      return
    }
    if (status.passwd.isError) {
      msg.show(status.passwd.message)
      return
    }
    const res = await api.user.login(form.email, form.passwd)
    if (isSuccess(res)) {
      const res = await api.user.getLoginInfo()
      msg.show(t('login.success'))
      if (isSuccess(res)) {
        store.userInfo = res.data
      }
      close()
      return
    }
    if (res.code === 40410) {
      // 没有此账号
      msg.show(t('login.account-not-found'))
      return
    }
    if (res.code === 40012) {
      // 密码格式错误
      msg.show(t('login.incorrect-pwd-format'))
      return
    }
    if (res.code === 40112) {
      // 密码错误
      msg.show(t('login.incorrect-pwd'))
      return
    }
    // 其它错误
    msg.show(t('login.other-error'))
  } finally {
    loading.value = false
  }
}

function close() {
  reset()
  emit('cancel')
}
</script>
<template>
  <div>
    <div class="w-30rem p-8 h-20rem flex flex-col justify-between step-2">
      <div class="text-[3rem] delay-1 text-center">
        {{ t('static.register') }}
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center delay-2">
        <div class="w-[100%] text-[1.5rem] mb-3">
          {{ t('register.captcha') }}
        </div>
        <input
          v-model="form.email"
          type="text"
          autocomplete="username"
          class="text-input"
          @keydown.enter="login"
        >
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
          type="primary"
          @click="emit('next')"
          :disabled="loading"
        >
          {{ t('register.verify-captcha') }}
        </TextButton>
      </div>
    </div>
  </div>
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
