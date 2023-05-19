<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from '../text-button.vue'
import api from '../../api/index'
import { isSuccess } from '../../api/index'
import { useForm } from 'slimeform'
import { useMessage } from '../../store'
import { useStore } from '../../store'
import { ref } from 'vue'
import { computed } from 'vue'

const props = defineProps<{
  isPasswordReset: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'next', email: string): void
}>()

const store = useStore()
const {t,locale} = useI18n()
const msg = useMessage()

const { form, status, verify } = useForm({
  form: () => ({
    email: '',
  }),
  rule: {
    email: (it: string) => it ? /^\S+\@\S+\.\S+$/s.test(it) ? true : t('login.email-format-error') : t('login.email-empty'),
  },
})
verify()

const loading = ref(false)
async function sendCaptcha() {
  if (loading.value || store.emailSendingCountDown) return
  loading.value = true
  try {
    if (status.email.isError) {
      msg.show(status.email.message)
      return
    }
    const res = await api.user.sendCaptchaCode(form.email, props.isPasswordReset)
    if (isSuccess(res)) {
      msg.show(t('register.captcha-sent'))
      store.startEmailSendingCountDown()
      emit('next', form.email)

      return
    }
    if (res.code === 40002) {
      // 账号已存在
      msg.show(t('register.exists'))
      return
    }
    if (res.code === 40410) {
      // 账号不存在
      msg.show(t('password-reset.not-exists'))
      return
    }
    // 其它错误
    msg.show(t('register.other-error'))
  } finally {
    loading.value = false
  }
}

// 发送倒计时，阻止频繁发送
const nextBtnText = computed(() => {
  if (store.emailSendingCountDown) {
    return store.emailSendingCountDown + 's'
  }
  return loading.value ? t('register.sending-captcha') : t('register.send-captcha')
})

</script>
<template>
  <div class="w-30rem p-8 h-20rem flex flex-col justify-between step-1">
    <div class="text-[3rem] delay-1 text-center">
      {{ isPasswordReset ? t('static.password-reset') : t('static.register') }}
    </div>
    <div class="w-[100%] flex flex-col justify-center items-center delay-2">
      <div class="w-[100%] text-[1.5rem] mb-3">
        {{ t('register.email') }}
      </div>
      <input
        v-model="form.email"
        type="text"
        autocomplete="username"
        class="text-input clickble"
        @keydown.enter="sendCaptcha"
      >
    </div>
    <div class="w-[100%] flex gap-x-[2rem] delay-3">
      <TextButton
        :disabled="loading"
        @click="emit('cancel')"
        :is-en="false"
        height="3rem"
        width="100%"
        type="secondary"
      >
        {{ t('register.cancel') }}
      </TextButton>
      <TextButton
        :is-en="false"
        height="3rem"
        width="100%"
        :type="status.email.isError ? 'secondary': 'primary'"
        @click="sendCaptcha"
        :disabled="loading"
      >
        {{ nextBtnText }}
      </TextButton>
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
