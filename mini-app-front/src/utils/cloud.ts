import Taro from '@tarojs/taro'

// 获取用户唯一ID
export const getUserId = async (): Promise<string> => {
  // 先尝试从缓存获取
  let userId = Taro.getStorageSync('user_id')
  if (userId) return userId
  
  // 获取微信用户唯一标识
  const loginRes = await Taro.cloud.callFunction({
    name: 'login',
    data: {}
  })
  
  userId = (loginRes.result as { openid: string }).openid || `user_${Date.now()}`
  Taro.setStorageSync('user_id', userId)
  return userId
}

// 保存纪念日数据
export const saveAnniversaries = async (userId: string, data: any): Promise<{success: boolean, error?: any}> => {
  try {
    // 先保存到本地缓存
    Taro.setStorageSync(`anniversaries_${userId}`, data)
    
    // 保存到云数据库
    await Taro.cloud.callFunction({
      name: 'saveData',
      data: {
        collection: 'anniversaries',
        userId,
        data
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('保存失败:', error)
    return { success: false, error }
  }
}

// 获取纪念日数据
export const fetchAnniversaries = async (userId: string): Promise<{success: boolean, data?: any, error?: any}> => {
  try {
    // 先尝试从本地缓存获取
    const localData = Taro.getStorageSync(`anniversaries_${userId}`)
    console.log('localData:', localData)
    if (localData) {
      return { success: true, data: localData }
    }
    
    // 从云数据库获取
    const result = await Taro.cloud.callFunction({
      name: 'getData',
      data: {
        collection: 'anniversaries',
        userId
      }
    })

    console.log('getData:', result)
    
    // 保存到本地缓存
    const cloudData = (result.result as { data: any }).data
    if (cloudData) {
      Taro.setStorageSync(`anniversaries_${userId}`, cloudData)
      return { success: true, data: cloudData }
    }
    
    return { success: false, error: '未找到数据' }
  } catch (error) {
    console.error('获取数据失败:', error)
    return { success: false, error }
  }
}