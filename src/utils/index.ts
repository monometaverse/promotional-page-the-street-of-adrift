type DebouncedFunc<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void
type DebounceFunc = <T extends (...args: any[]) => void = () => void>(func: T, time: number) => DebouncedFunc<T>

// 防抖函数
// 在固定时间内多次调用时只会执行一次
export const debounce: DebounceFunc = <T extends (...args: any[]) => any = () => void>(func: T, time: number) => {
  let timer = 0
  return (...args: Parameters<T>) => {
    if (timer) {
      // 如果计时器存在，清除计时器
      clearTimeout(timer)
    }
    // 设置计时器
    timer = setTimeout(func, time, ...args)
  }
}
