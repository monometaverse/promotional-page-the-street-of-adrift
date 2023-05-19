<script setup lang="ts">
import { ref } from 'vue'
import RegisterStep1 from '../Register/register-step1.vue'
import RegisterStep2 from '../Register/register-step2.vue'
import PasswordResetStep3 from './password-reset-step3.vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const step = ref(0)
const next = ref(true)
const email = ref('')

function onStep1Done(emailIn: string) {
  email.value = emailIn
  step.value++
  next.value=true
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
      class="bg-[#0f0f0f] overflow-hidden font-serif flex flex-col justify-between items-center z-998"
    >
      <Transition
        appear
        :name="next ? 'page-transition-next-reset' : 'page-transition-prev-reset'"
        mode="out-in"
      >
        <RegisterStep1
          v-if="step===0"
          @cancel="next=true;emit('close')"
          @next="onStep1Done"
          :is-password-reset="true"
        />
        <RegisterStep2
          v-else-if="step===1"
          @cancel="step--;next=false"
          @next="step++;next=true"
          :is-password-reset="true"
          :email="email"
        />
        <PasswordResetStep3
          v-else-if="step===2"
          @cancel="step--;next=false"
          @close="emit('close')"
          :email="email"
        />
      </Transition>
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
