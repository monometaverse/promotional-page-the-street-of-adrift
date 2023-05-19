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
import { VueRecaptcha as Recaptcha } from 'vue-recaptcha'

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

const showReCaptcha = ref(false)
const reCaptchaDone = ref(false)
const reCaptchaKey = import.meta.env.VITE_APP_RECAPTCHA_KEY

function showRecaptchaDialog() {
  if (status.email.isError || store.emailSendingCountDown) {
    msg.show(status.email.message)
    return
  }
  showReCaptcha.value = true
}

function onRecaptchaError() {
  msg.show(t('register.recaptcha-error'))
}

async function onRecaptchaVerified(token: string) {
  const res = await api.user.checkRecaptcha(form.email, token)
  if (isSuccess(res)) {
    showReCaptcha.value = false
    sendCaptcha()

    return
  }
  msg.show(t('register.other-error'))
}
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
        :type="status.email.isError || store.emailSendingCountDown ? 'secondary': 'primary'"
        @click="(!reCaptchaDone && !isPasswordReset) ? showRecaptchaDialog() : sendCaptcha()"
        :disabled="loading"
      >
        {{ nextBtnText }}
      </TextButton>
    </div>
    <div
      class="absolute w-full h-full top-0 left-0 transition-colors duration-250 flex justify-center items-center"
      :class="showReCaptcha ? 'bg-black/50' : 'pointer-events-none'"
    >
      <Transition
        appear
        enter-from-class="-translate-y-8 opacity-0"
        leave-to-class="-translate-y-8 opacity-0"
        enter-active-class="transform transition-all duration-250"
        leave-active-class="transform transition-all duration-250"
      >
        <div v-if="showReCaptcha">
          <div class="bg-black p-8 border-2px border-white/10">
            <div class="text-[2rem] delay-1 text-center mb-4">
              {{ t('register.extra-verification') }}
            </div>
            <Recaptcha
              :sitekey="reCaptchaKey"
              :load-recaptcha-script="true"
              @verify="onRecaptchaVerified"
              @error="onRecaptchaError"
            />
            <div class="mt-4 flex gap-4">
              <TextButton
                @click="showReCaptcha = false"
                type="secondary"
                :is-en="locale === 'en'"
                width="100%"
                height="3rem"
              >
                {{ t('register.cancel') }}
              </TextButton>
              <TextButton
                @click="sendCaptcha"
                :type="reCaptchaDone ? 'primary' : 'secondary'"
                :is-en="locale === 'en'"
                width="100%"
                height="3rem"
              >
                {{ t('register.continue') }}
              </TextButton>
            </div>
          </div>
        </div>
      </Transition>
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
