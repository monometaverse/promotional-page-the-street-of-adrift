<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import TextButton from '../text-button.vue'
import api from '../../api/index'
import { isSuccess } from '../../api/index'
import { useForm } from 'slimeform'
import { useMessage } from '../../store'
import { ref } from 'vue'

const props = defineProps<{ email: string }>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const {t,locale} = useI18n()
const msg = useMessage()

const { form, status, verify } = useForm({
  form: () => ({
    passwd: '',
    passwdRepeat: '',
  }),
  rule: {
    passwd: (it: string) => !!it || t('login.passwd-empty'),
  },
})
verify()

const loading = ref(false)
async function passwordReset() {
  if (loading.value) return
  loading.value = true
  try {
    if (status.passwd.isError) {
      msg.show(status.passwd.message)
      return
    }
    if (form.passwdRepeat !== form.passwd) {
      msg.show(t('register.password-not-equal'))
      return
    }
    const res = await api.user.passwordReset(props.email, form.passwd)
    if (isSuccess(res)) {
      msg.show(t('password-reset.finished'))
      emit('close')
      return
    }
    switch (res.code) {
      case 40011:
        // 验证码已过期
        msg.show(t('register.captcha-expired'))
        return
      case 40012:
        // 密码格式错误
        msg.show(t('login.incorrect-pwd-format'))
        return
    }
    // 其它错误
    msg.show(t('register.other-error'))
  } finally {
    loading.value = false
  }
}

</script>
<template>
  <div>
    <div class="w-30rem p-8 h-24rem flex flex-col justify-between step-3">
      <div class="text-[3rem] delay-1 text-center w-[calc(100%+3rem)] flex">
        <div class="w-[100%]">
          {{ t('static.password-reset') }}
        </div>
        <div
          class="close-btn transform -translate-x-[100%] flex-shrink-0"
          @click="emit('close')"
        />
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center delay-2">
        <div class="w-[100%] text-[1.5rem] mb-3">
          {{ t('register.password') }}
        </div>
        <input
          v-model="form.passwd"
          type="password"
          class="text-input clickble"
        >
      </div>
      <div class="w-[100%] flex flex-col justify-center items-center delay-2">
        <div class="w-[100%] text-[1.5rem] mb-3">
          {{ t('register.password-again') }}
        </div>
        <input
          v-model="form.passwdRepeat"
          type="password"
          autocomplete="username"
          class="text-input clickble"
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
          {{ t('register.back') }}
        </TextButton>
        <TextButton
          :is-en="false"
          height="3rem"
          width="100%"
          type="primary"
          @click="passwordReset"
          :disabled="loading"
        >
          {{ t('password-reset.finish') }}
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
