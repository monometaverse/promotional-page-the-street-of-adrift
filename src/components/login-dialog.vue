<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from './text-button.vue'
import api from '../api/index'
import { isSuccess } from '../api/index'
import { useForm } from 'slimeform'
import { useMessage } from '../store'
import { useStore } from '../store'
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
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
    passwd: (it: string) => it ? true : t('login.passwd-empty')
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
  emit('close')
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
    <form
      v-if="show"
      class="w-30rem p-8 h-24rem bg-[#0f0f0f] font-serif flex flex-col justify-between items-center z-998"
    >
      <div class="text-[3rem]">
        {{ t('static.login') }}
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center">
        <div class="w-[100%] text-[1.5rem] mb-3">
          {{ t('login.email') }}
        </div>
        <input
          v-model="form.email"
          type="text"
          autocomplete="username"
          class="text-input"
          @keydown.enter="login"
        >
        <div class="w-[100%] text-[1.5rem] my-3">
          {{ t('login.pwd') }}
        </div>
        <input
          v-model="form.passwd"
          type="password"
          autocomplete="current-password"
          class="text-input"
          @keydown.enter="login"
        >
      </div>
      <div class="w-[100%] flex gap-x-[2rem]">
        <TextButton
          :disabled="loading"
          @click="close"
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
          :disabled="loading"
        >
          {{ t('static.login') }}
        </TextButton>
      </div>
    </form>
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
