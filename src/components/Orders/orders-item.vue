<script setup lang="ts">
import moment from 'moment'
import { Order, OrderStatus } from '../../api'
import TextButton from '../text-button.vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  item: Order
}>()

const { t, locale } = useI18n()
</script>
<template>
  <div class="flex w-[99%] clickble border-white/20 border-2px p-8 transition-colors duration-250 hover:(border-white/50 bg-white/20)">
    <!-- 物品图片 -->
    <div
      class="w-6rem h-6rem flex-shrink-0 clickble"
      :style="{
        backgroundImage: `url(${item.pic})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }"
    />
    <!-- 详细信息 -->
    <div class="flex font-sans w-full clickble">
      <div class="flex-1 h-full flex flex-col justify-between clickble ml-8">
        <div class="text-[2rem] font-serif clickble">
          {{ item.name }}
        </div>
        <div class="text-[0.75rem] clickble">
          Token ID: {{ item.tokenID ?? 'Unknown' }}
        </div>
        <div class="text-[0.75rem] clickble">
          Created At: {{ moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss UTC') }}
        </div>
        <div class="text-[0.75rem] clickble">
          Completed At: {{ item.completedAt ? moment(item.completedAt).format('YYYY-MM-DD HH:mm:ss UTC') : 'Unknown' }}
        </div>
      </div>
      <div
        class="flex-1 clickble h-full flex flex-col justify-between items-end"
        :class="{
          'mr-8': item.status === OrderStatus.WAIT_FOR_PAYMENT || item.status === OrderStatus.WAIT_FOR_CLAIM
        }"
      >
        <div class="text-[2rem] font-serif">
          {{ t(item.status) }}
        </div>
        <div class="text-[0.75rem] clickble">
          Order ID: {{ item.orderID }}
        </div>
        <div class="text-[0.75rem] clickble">
          Payment ID: {{ item.paymentID ?? 'Unknown' }}
        </div>
        <div class="text-[0.75rem] clickble">
          Transaction ID: {{ item.txID ?? 'Unknown' }}
        </div>
      </div>
      <!-- 「去支付」按钮 -->
      <TextButton
        v-if="item.status === OrderStatus.WAIT_FOR_PAYMENT"
        width="12rem"
        height="100%"
        type="primary"
        :is-en="false"
      >
        {{ t('order.pay') }}
      </TextButton>
      <!-- 「领取」按钮 -->
      <TextButton
        v-if="item.status === OrderStatus.WAIT_FOR_CLAIM"
        width="12rem"
        height="100%"
        type="primary"
        :is-en="false"
      >
        {{ t('order.claim') }}
      </TextButton>
    </div>
  </div>
</template>
