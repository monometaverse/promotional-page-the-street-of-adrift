<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import api, { Order, OrderStatus } from '../../api'
import { isSuccess } from '../../api'
import { onMounted, ref } from 'vue'
import kusyouCoin from '../../assets/settings-page/kusyouSmall.webp'
import OrdersItem from './orders-item.vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const {t,locale} = useI18n()

function close() {
  emit('close')
}

const orders = ref<Order[]>([])

async function getOrders() {
  orders.value = [
    { name: '九霄金币', orderID: Math.random().toString(), createdAt: Date.now(), status: OrderStatus.WAIT_FOR_PAYMENT, pic: kusyouCoin },
    { name: '九霄金币', orderID: Math.random().toString(), createdAt: Date.now(), status: OrderStatus.MINTING, pic: kusyouCoin },
    { name: '九霄金币', orderID: Math.random().toString(), createdAt: Date.now(), status: OrderStatus.WAIT_FOR_CLAIM, pic: kusyouCoin },
    { name: '九霄金币', orderID: Math.random().toString(), createdAt: Date.now(), status: OrderStatus.COMPLETED, pic: kusyouCoin },
    { name: '九霄金币', orderID: Math.random().toString(), createdAt: Date.now(), status: OrderStatus.EXPIRED, pic: kusyouCoin },
  ]
}

onMounted(() => {
  getOrders()
})
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
      class="w-[80vw] p-8 h-[80vh] bg-[#0f0f0f] font-serif flex flex-col justify-between items-center z-998"
    >
      <div class="flex w-full justify-between items-center">
        <div class="font-serif text-[3rem] font-900">
          Orders
        </div>
        <div
          class="close-btn clickble pointer-events-auto"
          @click="close"
        />
      </div>
      <div class="w-full flex-1 mt-8 flex flex-col gap-8 overflow-y-scroll custom-scrollbar">
        <OrdersItem
          v-for="item in orders"
          :key="item.orderID"
          :item="item"
        />
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
