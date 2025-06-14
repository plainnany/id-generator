import { useCallback, useRef } from 'react'

/**
 * 防重点击Hook
 * @param fn 要执行的函数
 * @param delay 防重复间隔时间（毫秒）
 * @returns 防重复的函数
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 1000
): T {
  const lastTimeRef = useRef<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      
      // 如果距离上次执行时间小于延迟时间，则忽略此次调用
      if (now - lastTimeRef.current < delay) {
        return
      }
      
      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // 立即执行函数
      lastTimeRef.current = now
      return fn(...args)
    }) as T,
    [fn, delay]
  )
}

/**
 * 防抖Hook
 * @param fn 要执行的函数
 * @param delay 防抖延迟时间（毫秒）
 * @returns 防抖的函数
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    ((...args: Parameters<T>) => {
      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // 设置新的定时器
      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    }) as T,
    [fn, delay]
  )
}

/**
 * 异步函数防重复执行Hook
 * @param asyncFn 异步函数
 * @returns [执行函数, 是否正在执行]
 */
export function useAsyncLock<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T
): [T, boolean] {
  const isExecutingRef = useRef<boolean>(false)

  const lockedFn = useCallback(
    (async (...args: Parameters<T>) => {
      // 如果正在执行，直接返回
      if (isExecutingRef.current) {
        return
      }
      
      try {
        isExecutingRef.current = true
        return await asyncFn(...args)
      } finally {
        isExecutingRef.current = false
      }
    }) as T,
    [asyncFn]
  )

  return [lockedFn, isExecutingRef.current]
} 