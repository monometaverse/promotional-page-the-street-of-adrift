<!--NFT 页面-->
<script lang="ts" setup>
import { computed, CSSProperties, onMounted, reactive, ref, toRaw, watchEffect } from 'vue'
import { usePagination, useActivityDate, useLoginAndMessage, useItemsPageButtonSize } from '../utils'
import { gsap } from 'gsap'
import modelViewer from '../components/ModelViewerTrois/index.vue'
import { useElementBounding, useWindowSize } from '@vueuse/core'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { useStore, useMessage } from '../store'
import type { NFTItem } from '../components/ResourceLoader/Resources'
import { Color, FrontSide, MeshPhysicalMaterial } from 'three'
import API, { isSuccess } from '../api'
import { storeToRefs } from 'pinia'
import ScrollHint from '../components/scroll-hint.vue'
import { useI18n } from 'vue-i18n'
import api from '../api'
import TextButton from '../components/text-button.vue'

// pinia 状态管理
const store = useStore()
const { userInfo, shouldReserveAfterLogin } = storeToRefs(store)
// i18n
const { t, locale } = useI18n()
// 消息组件
const msg = useMessage()
const itemsList = ref<NFTItem[]>([
  {
    name: 'nft.goldCoinName',
    description: 'nft.goldCoinInfo',
    url: "d9baa6d4-f37b-4fe0-9164-21780b5e8b40",
    reserved: false,
    model: (store.getRes('kusyouCoin', 'NFT').value as GLTF).scene,
    canBeReserved: false,
    customData: {
      childName: 'YX_Gold',
      scale: 4,
      positionY: -2,
      positionX: 0.05,
      correctMaterial: (() => {
        const material = new MeshPhysicalMaterial()
        material.metalness = 1
        material.roughness = 0.14
        material.clearcoatRoughness = 0.01
        material.reflectivity = 1
        material.clearcoat = 1
        material.fog = true
        material.color = new Color(0xFFCB3D)
        return material
      })()
    }
  },
  {
    name: 'nft.sliverCoinName',
    description: 'nft.sliverCoinInfo',
    url: "cfeb8d91-4865-456a-b400-ad6b72b60ca1",
    reserved: false,
    model: (store.getRes('kusyouCoin', 'NFT').value as GLTF).scene.clone(),
    canBeReserved: false,
    customData: {
      childName: 'YX_Gold',
      scale: 4,
      positionY: -2,
      positionX: 0.05,
      correctMaterial: (() => {
        const material = new MeshPhysicalMaterial()
        material.metalness = 1
        material.roughness = 0.14
        material.clearcoatRoughness = 0.01
        material.reflectivity = 1
        material.clearcoat = 1
        material.fog = true
        material.color = new Color(0x7A7A7A)
        return material
      })()
    },
  },
  {
    name: 'nft.umsSuperName',
    description: 'nft.umsSuperInfo',
    reserved: false,
    canBeReserved: false,
    model: (store.getRes('S_UMSSuper', 'NFT').value as GLTF).scene,
    customData: {
      depthWrite: true,
      childName: 'polySurface67_Mesh001',
      side: FrontSide,
      scale: 1.5,
      positionY: -1.4
    }
  }
])
// NFT 名称列表
// 是否选中“发送所有邮件”
const isSendAllChecked = ref(true)
// 当前正在显示的 NFT
const { currentIndex, prevOrNext } = usePagination(itemsList)
// 当前正在显示的 NFT 索引，供动画使用
const currentIndexForAnimation = ref(0)
// 动画偏移量
const translateX = reactive({
  info: 100,
  reserveBtn: 100
})
// 动画时长
const durations = reactive({
  info: 250,
  reserveBtn: 250
})
// 动画延迟
const delay = reactive({
  info: 0,
  reserveBtn: 250
})
// NFT 信息动画参数
const infoAnimationArgs = reactive({
  translateX: 0,
  opacity: 1
})
const infoAnimationStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${infoAnimationArgs.translateX}px)`,
  opacity: infoAnimationArgs.opacity
}))
// 预约按钮动画参数
const reserveBtnAnimationArgs = reactive({
  translateX: 0,
  opacity: 1
})
const reserveBtnAnimationStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${reserveBtnAnimationArgs.translateX}px)`,
  opacity: reserveBtnAnimationArgs.opacity
}))
// 模型查看器实例
const modelViewerEl = ref<InstanceType<typeof modelViewer> | null>(null)
// 上一页或下一页
const prevOrNextLocal = (next?: boolean, index?: number) => {
  // 修改正 NFT 索引
  if (typeof next === 'undefined') {
    if (typeof index === 'undefined') {
      throw new Error('切换组件：没有传入任何参数')
    } else {
      currentIndex.value = index
      doAnimation(true, index, false)
    }
  } else {
    if (typeof index !== 'undefined') {
      console.warn('已经传入了要进行的动作：' + next + '，再传入要跳转的索引是无效的')
    } else {
      prevOrNext(next)
      doAnimation(next, -1, false)
    }
  }
}
// 动画定时
let reserveBtnAnimationTimeout = -1
// 动画函数
const doAnimation = (next: boolean, newIndex: number, enter: boolean) => {
  // 停止正在进行的动画
  gsap.killTweensOf(infoAnimationArgs)
  // 取消动画定时
  window.clearTimeout(reserveBtnAnimationTimeout)
  // 开始新的动画
  gsap.fromTo(infoAnimationArgs, {
    translateX: next ? (enter ? -translateX.info : 0) : (enter ? translateX.info : 0),
    opacity: enter ? 0 : 1
  }, {
    translateX: next ? (enter ? 0 : translateX.info) : (enter ? 0 : -translateX.info),
    opacity: enter ? 1 : 0,
    duration: durations.info / 1000
  })
  reserveBtnAnimationTimeout = window.setTimeout(() => {
    gsap.fromTo(reserveBtnAnimationArgs, {
      translateX: next ? (enter ? -translateX.reserveBtn : 0) : (enter ? translateX.reserveBtn : 0),
      opacity: enter ? 0 : 1
    }, {
      translateX: next ? (enter ? 0 : translateX.reserveBtn) : (enter ? 0 : -translateX.reserveBtn),
      opacity: enter ? 1 : 0,
      duration: durations.reserveBtn / 1000,
      onComplete: () => {
        if (enter) return
        // 正式修改正显示的 NFT 索引
        currentIndexForAnimation.value = currentIndex.value
        doAnimation(next, -1, true)
      }
    })
  }, delay.reserveBtn)
}
// 模型容器元素
const modelContainerEl = ref<HTMLDivElement | null>(null)
// 模型容器元素的位置高宽信息
const modelContainerElBounding = reactive(useElementBounding(modelContainerEl))
// API 基础路径
const apiBase = import.meta.env.VITE_APP_API_URL_BASE
// MonoFun 前端基础路径
const monoFeBase = import.meta.env.VITE_APP_MONO_FE

// AI agnet 问答框
const { showAiDialog, closeAiDialog, isAiDialogShow } = (() => {
  const show = ref(false)
  const showDialog = () => {
    show.value = true
  }
  const closeDialog = () => {
    show.value = false
  }
  // const sendMsg =
  return {
    showAiDialog:showDialog,
    closeAiDialog:closeDialog,
    isAiDialogShow:show,
  }
})()

const chat = async (text: string) => {
  const agentId = "f43a79df-d424-05a8-a56f-99967c2caaf6"
  const response = await fetch(`http://localhost:3000/${agentId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      `text=${encodeURIComponent(text)}` +
      `&name=${'Player'}` +
      `&userName=${'Player'}` +
      `&agentName=${'Sender'}`,
  })
    .then(async (response) => {
      const reader = response.body?.getReader()
      if (!reader) return
      reader.read().then(({ done, value }) => {
        if (done) return
        const enc = new TextDecoder("utf-8")
        const textJson = enc.decode(value, { stream: true })
        const text = JSON.parse(textJson)[0]
        const content = text.text.toLocaleLowerCase()
      })
    })
    .catch((e) => console.log(e))
}

// 预约成功框
const { showReserveSuccessDialog, isDialogShow, reservedNftName, closeReserveSuccessDialog, reservedNftId } = (() => {
  const show = ref(false)
  const name = ref('nft.goldCoinName')
  const id = ref('')
  // 显示预约成功框
  // 请传入用来进行本地化的键
  const showDialog = (nftName: string, idIn: string) => {
    name.value = nftName
    show.value = true
    id.value = idIn
  }
  const closeDialog = async (checked?: boolean) => {
    name.value = ''
    show.value = false
    if (isSendAllChecked.value) {
      // 如果选中了「接受邮件」框，发送请求给后端，表示这个用户愿意接收所有邮件
      await api.nft.receiveAllEmails('03f3e7eb-fa25-485d-b224-b81105feca19')
    }
    if (checked) {
      // 如果点击的是「前往详情页」，跳转到项目详情页
      window.open(`${monoFeBase}/items/${id.value}`, '_blank')
    }
    isSendAllChecked.value = true
  }
  return {
    showReserveSuccessDialog: showDialog,
    isDialogShow: show,
    reservedNftName: name,
    closeReserveSuccessDialog: closeDialog,
    reservedNftId: id
  }
})()
// 活动相关
const activityDate = useActivityDate()
// 前往登录页，并等待登录消息
const goLoginPageAndWaitForMessage = useLoginAndMessage()
// 进行预约
const doReserve = async (index: number) => {
  const res = await API.nft.reserve(itemsList.value[index].url!, '03f3e7eb-fa25-485d-b224-b81105feca19')
  if (isSuccess(res)) {
    showReserveSuccessDialog(itemsList.value[index].name, itemsList.value[index].url!)
    itemsList.value[index].reserved = true
  } else {
    msg.show(res.message)
  }
}
// 预约按钮事件处理器
const onReserveBtnClick = async (index: number) => {
  if (itemsList.value[index].reserved) return
  if (!itemsList.value[index].canBeReserved) return
  // // 如果活动还没开始，就拒绝
  // if (!activityDate.started()) {
  //   msg.show(t('nft.activityNotStart'))
  //   return
  // }
  // if (!userInfo.value) {
  //   msg.show(t('nft.needLogin'))
  //   // 保存要在登录完成后预约的项目
  //   shouldReserveAfterLogin.value = index
  //   // 跳转到登录页
  //   goLoginPageAndWaitForMessage()
  //   return
  // }
  // doReserve(index)
}
// 前往详情页按钮事件处理器
const onShowDetailBtnClick = async (index: number) => {
  // window.open(`${monoFeBase}/items/${itemsList.value[index].url}`, '_blank')
  showAiDialog()
}
// 预约按钮文字元素
const infoEl = ref<HTMLDivElement | null>(null)
const getNFTReservedStatus = async () => {
  if (!userInfo.value) {
    return
  }

  // 获取 NFT 预约状态，需要是已经登录的状态
  for (let it of itemsList.value) {
    if (!it.canBeReserved) continue // 如果是不能被预约的项目，跳过
    const res = await API.nft.getReservedState(it.url!, '03f3e7eb-fa25-485d-b224-b81105feca19', userInfo.value.id)
    if (isSuccess(res)) {
      it.reserved = res.data.status === 1
    } else {
      console.log(`NFT 预约状态获取失败，原因 ${res.message}， NFT 名称 ${it.name}`)
    }
  }
}

// 当挂载时，显示第一个模型
onMounted(async () => {
  getNFTReservedStatus()
})
// 监听用户登录状态，一旦用户登录了，就获取 NFT 预约状态
watchEffect(() => {
  if (!userInfo.value) {
    // 清除预约状态
    for (let it of itemsList.value) {
      it.reserved = false
    }
    return
  }
  getNFTReservedStatus().then(() => {
    // 获取到预约状态之后，如果没有预约，才进行预约
    if (shouldReserveAfterLogin.value !== -1 && !itemsList.value[shouldReserveAfterLogin.value].reserved) {
      doReserve(shouldReserveAfterLogin.value)
    }
    // 清除要在登录后立即预约的项目
    shouldReserveAfterLogin.value = -1
  })
})

const buttonsSize = useItemsPageButtonSize()
</script>
<template>
  <div class="route-page">
    <div
      class="info"
      ref="infoEl"
    >
      <!-- NFT 名字 -->
      <div
        class="info-title"
        :style="infoAnimationStyle"
      >
        {{ t(itemsList[currentIndexForAnimation].name) }}
      </div>
      <!-- 当切换至英文时，隐藏，但是占空间 -->
      <div
        class="info-title-en"
        :style="infoAnimationStyle"
        v-if="locale === 'zh'"
      >
        {{ t(itemsList[currentIndexForAnimation].name, 1, { locale: 'en' }).toUpperCase() }}
      </div>
      <div
        class="info-divider <sm:hidden"
        :style="infoAnimationStyle"
      />
      <!-- NFT 描述 -->
      <div
        class="info-desc"
        :style="infoAnimationStyle"
      >
        {{ t(itemsList[currentIndexForAnimation].description) }}
      </div>
      <div
        class="flex gap-x-1rem info-btns"
        :style="reserveBtnAnimationStyle"
      >
        <!-- 前往详情页按钮 -->
        <TextButton
          @click="onShowDetailBtnClick(currentIndexForAnimation)"
          type="secondary"
          :width="buttonsSize.width"
          :height="buttonsSize.height"
          :is-en="locale === 'en'"
        >
          {{ t('nft.showAiDialog') }}
        </TextButton>
        <!-- 预约按钮 -->
        <TextButton
          @click="onReserveBtnClick(currentIndexForAnimation)"
          type="primary"
          :width="buttonsSize.width"
          :height="buttonsSize.height"
          :is-en="locale === 'en'"
        >
          {{ itemsList[currentIndexForAnimation].canBeReserved ? itemsList[currentIndexForAnimation].reserved ? t('nft.reserveBtnTextReserved') : t('nft.reserveBtnText') : t('nft.commingSoon') }}
        </TextButton>
      </div>
    </div>
    <div class="matrix matrix-left-bottom" />
    <div class="matrix matrix-behind-models <sm:hidden" />
    <!-- 模型展示区域 -->
    <div class="models">
      <div class="models-main">
        <div
          class="models-prev-btn prev-btn clickble"
          @click="prevOrNextLocal(false)"
        />
        <div
          class="models-main-container"
          ref="modelContainerEl"
        >
          <div class="models-rotating-border" />
          <!-- 模型查看器 -->
          <div class="h-full w-full transform -translate-y-[100%]">
            <model-viewer
              :items="itemsList"
              :showing-item="currentIndex"
              ref="modelViewerEl"
            />
          </div>
        </div>
        <div
          class="models-next-btn next-btn clickble"
          @click="prevOrNextLocal(true)"
        />
      </div>
      <!-- 当前模型 -->
      <div class="models-indicator">
        <div
          class="models-indicator-item clickble"
          v-for="index in itemsList.length"
          :key="itemsList[index - 1].name"
          :class="currentIndex === (index - 1) ? 'models-indicator-item-active' : ''"
          @click="prevOrNextLocal(undefined, index - 1)"
        />
      </div>
    </div>
    <!-- AI 问答框 -->
    <div
      class="flex h-[100%] transition-colors w-[100%] z-998 absolute justify-center items-center"
      :class="{
        'bg-[rgba(0,0,0,0.5)]': isAiDialogShow,
        'pointer-events-none': !isAiDialogShow
      }"
    >
      <div
        class="bg-black flex h-480px transition w-576px duration-250 <sm:(w-320px h-374px) "
        :class="{
          'opacity-0': !isAiDialogShow,
          '-translate-y-50px transform': !isAiDialogShow
        }"
      >
        <div class="flex-1 pt-24px pr-24px" />
        <div class="flex flex-col pt-3rem justify-between items-center">
          <span class="font-serif font-900 text-2rem leading-46px <sm:(text-24px leading-34px) ">Get White List</span>
          Can you answer a few questions for me, I will use the Q&A to determine if I can whitelist you.
          <!-- 确定按钮 -->
          <div>
            <div class="border-solid border-[rgba(255,255,255,0.5)] border-2px transition-colors duration-250 hover:(bg-[rgba(255,255,255,0.2)])">
              <div
                class="bg-contain bg-center bg-no-repeat h-4rem opacity-20 transition-opacity w-192px duration-250 reserve-success-bg clickble <sm:(w-6rem h-2rem) hover:(opacity-50) "
                @click="closeReserveSuccessDialog(true)"
              />
            </div>
            <div class="flex font-serif font-900 h-4rem transform text-24px leading-34px w-192px -translate-y-4rem justify-center items-center pointer-events-none <sm:(w-6rem h-2rem text-16px leading-23px -translate-y-2rem) ">
              Send Message
            </div>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="flex flex-1 pt-24px pr-24px justify-end">
          <div
            class="close-btn clickble"
            @click="closeAiDialog()"
          />
        </div>
      </div>
    </div>
    <!-- 预约成功提示框 -->
    <div
      class="flex h-[100%] transition-colors w-[100%] z-998 absolute justify-center items-center"
      :class="{
        'bg-[rgba(0,0,0,0.5)]': isDialogShow,
        'pointer-events-none': !isDialogShow
      }"
    >
      <!-- 提示框主体 -->
      <div
        class="bg-black flex h-480px transition w-576px duration-250 <sm:(w-320px h-374px) "
        :class="{
          'opacity-0': !isDialogShow,
          '-translate-y-50px transform': !isDialogShow
        }"
      >
        <!-- 占位符 -->
        <div class="flex-1 pt-24px pr-24px" />
        <div class="flex flex-col pt-3rem justify-between items-center">
          <span class="font-serif font-900 text-2rem leading-46px <sm:(text-24px leading-34px) ">{{ t('nft.reserveSucceed') }}</span>
          <!-- 预约成功的物品的名称 -->
          <span class="font-sans text-1rem <sm:text-0.75rem">{{ t('nft.reservedItem', { name: t(reservedNftName) }) }}</span>
          <!-- 预约成功图片 -->
          <div class="p-14px success-pic-container">
            <div class="bg-center bg-no-repeat bg-cover h-130px w-144px success-pic <sm:(w-79px h-71px) " />
          </div>
          <!-- 勾选框，是否接收所有关于彷徨之街的邮件 -->
          <div class="flex gap-x-0.5rem items-center">
            <input
              type="checkbox"
              :checked="isSendAllChecked"
              id="receiveAll"
            >
            <label
              for="receiveAll"
              class="font-sans text-0.75rem leading-1.125rem"
            >{{ t('nft.receiveEmailCheckboxText') }}</label>
          </div>
          <!-- 确定按钮 -->
          <div>
            <div class="border-solid border-[rgba(255,255,255,0.5)] border-2px transition-colors duration-250 hover:(bg-[rgba(255,255,255,0.2)])">
              <div
                class="bg-contain bg-center bg-no-repeat h-4rem opacity-20 transition-opacity w-192px duration-250 reserve-success-bg clickble <sm:(w-6rem h-2rem) hover:(opacity-50) "
                @click="closeReserveSuccessDialog(true)"
              />
            </div>
            <div class="flex font-serif font-900 h-4rem transform text-24px leading-34px w-192px -translate-y-4rem justify-center items-center pointer-events-none <sm:(w-6rem h-2rem text-16px leading-23px -translate-y-2rem) ">
              {{ t('nft.showDetails') }}
            </div>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="flex flex-1 pt-24px pr-24px justify-end">
          <div
            class="close-btn clickble"
            @click="closeReserveSuccessDialog(false)"
          />
        </div>
      </div>
    </div>
    <!-- 只在手机端出现的滑动提示 -->
    <scroll-hint class="!sm:hidden" />
  </div>
</template>
<style lang="less" scoped>
@title-line-height: 92px;
@title-en-line-height: 29px;
@divider-margin-top: 24px;
@desc-margin-top: 24px;
@divider-height: 2px;
@desc-line-height: 2rem;
@reserve-btn-margin-top: 4rem;
@reserve-btn-height: 4rem;
@all-height: calc(@title-line-height + @title-en-line-height + @divider-margin-top + @desc-margin-top + @divider-height + @divider-height + @desc-line-height * 2 + @reserve-btn-height + @reserve-btn-margin-top);

.info {
  position: absolute;
  top: calc(50% - @all-height / 2);
  left: 4rem;
  // NFT 名称
  &-title {
    font-size: 4rem;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    line-height: @title-line-height;
  }
  // NFT 英文名称
  &-title-en {
    font-size: 24px;
    font-weight: 600;
    line-height: @title-en-line-height;
    font-family: 'Montserrat', sans-serif;
    color: rgba(255, 255, 255, 0.5);
  }
  // 分割线
  &-divider {
    height: @divider-height;
    margin-top: @divider-margin-top;
    width: 16px;
    background-color: white;
  }
  // NFT 文案
  &-desc {
    margin-top: @desc-margin-top;
    line-height: @desc-line-height;
    font-size: 16px;
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 400;
    width: 480px;
  }
  // 预约按钮和前往详情页按钮
  &-btns {
    margin-top: @reserve-btn-margin-top;
  }

  &-btn-text {
    height: 4rem;
    font-family: 'Noto Serif SC', sans-serif;
    font-weight: 900;
    width: 192px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-btn {
    transition-property: background-color;
    transition-duration: 250ms;
    transition-timing-function: ease;
    height: 4rem;
    width: 192px;
    box-sizing: border-box;
    left: 4rem;

    &-inner {
      transition: opacity 250ms ease;
      width: 100%;
      height: 100%;
      background-image: url('../assets/nft-page/reserve-btn-background.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0.2;
    }
  }

  // 普通按钮边框和背景
  &-common-btn {
    border: 2px solid rgba(255, 255, 255, 0.5);

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:hover &-inner {
      opacity: 1;
    }
  }

  // 预约按钮边框和背景
  &-reserve-btn {
    border: 2px solid white;
    background-color: rgba(255, 255, 255, 0.5);

    &-inner {
      opacity: 0.5;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    &:hover &-inner {
      opacity: 1;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.matrix-left-bottom {
  left: 4rem;
  bottom: 4rem;
}

.matrix-behind-models {
  top: calc(335px + 50vh - 540px);
  right: 411px;
}

.models {
  @indicator-margin-top: 60px;
  @indicator-heigth: 4px;
  @container-width-height: 688px;
  @prev-btn-margin-right: 74px;

  position: absolute;
  top: calc(50% - calc(@indicator-heigth + @container-width-height + @indicator-margin-top) / 2);
  right: 300px;

  &-indicator {
    display: flex;
    justify-content: center;
    column-gap: 24px;
    margin-top: @indicator-margin-top;
    margin-left: @prev-btn-margin-right;

    &-item {
      transition: opacity 250ms ease;
      width: 3rem;
      height: @indicator-heigth;
      opacity: 0.25;
      background-color: white;

      &:hover {
        opacity: 0.5;
      }

      &-active {
        opacity: 1;
      }
    }
  }

  &-main {
    display: flex;
    align-items: center;

    &-container {
      width: @container-width-height;
      height: @container-width-height;
      background-image: url('../assets/nft-page/container-background.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  &-prev-btn {
    margin-right: @prev-btn-margin-right;
  }

  &-next-btn {
    background-image: url('../assets/nft-page/models-next.svg');
  }

  &-rotating-border {
    width: calc(100% - 10px);
    height: calc(100% - 10px);
    background-image: url('../assets/nft-page/rotating-border.svg');
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    animation: 15s rotating linear running infinite;
    pointer-events: none;
  }
}

.success-pic {
  background-image: url('../assets/nft-page/reserve-success.svg');
}

.success-pic-container {
  background-image:
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png'),
    url('../assets/static-framework/page-title-dot.png');
  background-repeat: no-repeat;
  background-position:
    top left,
    top right,
    bottom left,
    bottom right;
}

.reserve-success-bg {
  background-image: url('../assets/nft-page/reserve-btn-background.svg');
}

// 当宽度小于 1680px 时，进入平板模式
@media screen and (max-width: 1679px) {
  @title-line-height: 69px;
  @title-en-line-height: 20px;
  @divider-margin-top: 24px;
  @desc-margin-top: 24px;
  @divider-height: 2px;
  @desc-line-height: 2rem;
  @reserve-btn-margin-top: 3rem;
  @reserve-btn-height: 4rem;
  @all-height: calc(@title-line-height + @title-en-line-height + @divider-margin-top + @desc-margin-top + @divider-height + @divider-height + @desc-line-height * 2 + @reserve-btn-height + @reserve-btn-margin-top);

  .info {
    top: calc(50vh - @all-height / 2);

    &-title {
      font-size: 3rem;
      line-height: 69px;
    }

    &-title-en {
      font-size: 16px;
      line-height: @title-en-line-height;
    }

    &-desc {
      font-size: 14px;
      width: 320px;
    }

    &-btns {
      margin-top: @reserve-btn-margin-top;
    }
  }
  // 模型容器
  .models {
    @container-width-height: 466px;
    @indicator-margin-top: 40px;
    @indicator-heigth: 4px;
    @prev-btn-margin-right: 40px;

    position: absolute;
    top: calc(50% - calc(@indicator-heigth + @container-width-height + @indicator-margin-top) / 2);
    right: 180px;

    &-main {
      &-container {
        width: @container-width-height;
        height: @container-width-height;
      }
    }

    &-prev-btn {
      margin-right: @prev-btn-margin-right;
    }

    &-indicator {
      margin-top: @indicator-margin-top;
      margin-left: @prev-btn-margin-right;

      &-item {
        width: 2rem;
      }
    }
  }

  .matrix-behind-models {
    right: calc(50vw - 597px + 250px);
  }
}

// 当宽度小于 1080px 时，进入手机模式
@media screen and (max-width: 1079px) {
  // 模型容器
  .models {
    @container-width-height: 300px;
    @indicator-margin-top: 20px;
    @indicator-heigth: 4px;

    position: absolute;
    top: calc(50vh + 165px - 406px);
    right: unset;
    width: 100%;

    &-main {
      width: 100%;
      justify-content: center;

      &-container {
        width: @container-width-height;
        height: @container-width-height;
      }
    }

    &-prev-btn {
      margin-right: unset;
    }

    &-indicator {
      margin-top: @indicator-margin-top;
      margin-left: unset;

      &-item {
        width: 24px;
        height: 2px;
      }
    }
  }

  .info {
    width: 100%;
    top: unset;
    bottom: 5rem;
    left: 0;
    padding: 20px 20px 0 20px;

    &-title {
      font-size: 2rem;
      line-height: 46px;
    }

    &-title-en {
      font-size: 16px;
      line-height: 20px;
    }

    &-desc {
      display: none;
    }

    &-btns {
      margin-top: 1.5rem;
    }

    &-btn-text {
      width: 6rem;
      height: 2rem;
      font-size: 1rem;
      line-height: 23px;

      &:lang(en) {
        font-size: 0.75rem;
      }
    }
  }

  .info-btn {
    left: 20px;
    width: 6rem;
    height: 2rem;
  }
}
</style>
