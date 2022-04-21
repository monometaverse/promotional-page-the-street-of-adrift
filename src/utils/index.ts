import { Object3D } from "three"
import { ref, Ref } from "vue"

type DebouncedFunc<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void
type DebounceFunc = <T extends (...args: any[]) => void = () => void>(func: T, time: number) => DebouncedFunc<T>

// 防抖函数
// 在固定时间内多次调用时只会执行一次
export const debounce: DebounceFunc = <T extends (...args: any[]) => any = () => void>(func: T, time: number) => {
  let timer = 0
  return (...args: Parameters<T>) => {
    if (timer) {
      // 如果计时器存在，清除计时器
      window.clearTimeout(timer)
    }
    // 设置计时器
    timer = window.setTimeout(func, time, ...args)
  }
}

/**
 * 搜索 3D 对象的子对象
 * @param root 根对象
 * @param childName 子对象的名称
 * @param deep 是否需要深度搜索，如果需要，会搜索子对象的子对象
 */
export const getChildObject = (root: Object3D[] | Object3D, childName: string, deep: boolean, first: boolean): Object3D | undefined => {
  if (Array.isArray(root)) {
    for (let obj of root) {
      const child = getChildObject(obj, childName, deep, false)
      if (child) {
        return child
      }
    }
    return undefined
  } else {
    if (root.name === childName) {
      return root
    } else if (deep || first) {
      return getChildObject(root.children, childName, deep, false)
    }
    return undefined
  }
}

/**
 * 使用分页组件
 * @param 页面数据数组
 * @param beforeSwitch 页面切换之前要做的事情
 * @param afterSwitch 当页面切换之后要做的事情
 */
export const usePagination = <T extends Ref<any[]>>(pages: T, beforeSwitch?: (next: boolean, prev: number) => void, afterSwitch?: (next: boolean, nextIndex: number) => void) => {
  // 当前页面
  const currentIndex = ref(0)
  // 下一页或上一页
  const prevOrNext = (next: boolean) => {
    // 回调
    beforeSwitch?.(next, currentIndex.value)
    if (next) {
      // 下一张，如果是最后一张就跳到第一张
      if (currentIndex.value < pages.value.length - 1) {
        currentIndex.value += 1
      } else {
        currentIndex.value = 0
      }
    } else {
      // 上一张，如果是第一张就跳到最后一张
      if (currentIndex.value === 0) {
        currentIndex.value = pages.value.length - 1
      } else {
        currentIndex.value -= 1
      }
    }
    // 回调
    afterSwitch?.(next, currentIndex.value)
  }
  // 下一页
  const next = () => prevOrNext(true)
  // 上一页
  const prev = () => prevOrNext(false)
  return {
    currentIndex,
    next,
    prev,
    prevOrNext
  }
}
