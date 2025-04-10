import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { getUserId } from '@/utils/cloud'



export function useDataLoader<T>(
  options: MiniProgram.DataLoaderOptions<T>
) {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [userId, setUserId] = useState<string>()

  // 获取用户ID
  const initUserId = async () => {
    try {
      const id = await getUserId()
      setUserId(id)
      return id
    } catch (err) {
      setError(err)
      options.onError?.(err)
      throw err
    }
  }

  // 加载数据
  const loadData = async (id?: string) => {
    const targetUserId = id || userId
    if (!targetUserId) return

    try {
      setIsLoading(true)
      if (options.showLoading) {
        Taro.showLoading({ title: '加载中...' })
      }

      const response = await options.fetchHandler(targetUserId)
      if (response.success && response.data) {
        setData(response.data)
        setError(null)
        options.onSuccess?.(response.data)
      } else {
        throw new Error(response.error?.message || '加载数据失败')
      }
    } catch (err) {
      setError(err)
      options.onError?.(err)
      Taro.showToast({
        title: err.message,
        icon: 'error',
        duration: 2000
      })
    } finally {
      setIsLoading(false)
      if (options.showLoading) {
        Taro.hideLoading()
      }
    }
  }

  // 同步数据（强制刷新）
  const syncData = async () => {
    await loadData()
  }

  // 初始化
  useEffect(() => {
    if (options.autoLoad !== false) {
      const init = async () => {
        try {
          const id = await initUserId()
          await loadData(id)
        } catch (err) {
          console.error('初始化失败:', err)
        }
      }
      init()
    }
  }, [])

  return {
    data,
    isLoading,
    error,
    userId,
    loadData,
    syncData,
    setData // 允许手动设置数据
  }
}