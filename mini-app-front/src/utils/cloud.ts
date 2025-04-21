import Taro from '@tarojs/taro'
import { COMMON_ID, SHARED_GROUP } from './const.value'

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
  // TODO: 临时方案：直接使用固定数组解实现数据共享
  if (SHARED_GROUP.includes(userId)) {
    userId = COMMON_ID
  }
  Taro.setStorageSync('user_id', userId)
  return userId
}

/**
 * 通用数据保存函数
 * @param collection 集合名称
 * @param userId 用户ID
 * @param data 要保存的数据
 * @param localKey 本地存储的key
 */
const _saveData = async <T>(collection: string, userId: string, data: T, localKey: string): Promise<Cloud.SaveOperationResult> => {
  try {
    // 保存到本地缓存
    Taro.setStorageSync(localKey, data)

    // 保存到云数据库
    await Taro.cloud.callFunction({
      name: 'saveData',
      data: {
        collection,
        userId,
        data
      }
    })

    return { success: true }
  } catch (error) {
    console.error(`保存${collection}数据失败:`, error)
    return { success: false, error }
  }
}

/**
 * 通用数据获取函数
 * @param collection 集合名称
 * @param userId 用户ID
 * @param localKey 本地存储的key
 * @param options 额外参数，如是否强制刷新
 */
const _fetchData = async <T>(
  collection: string,
  userId: string,
  localKey: string,
  options?: { forceRefresh?: boolean }
): Promise<Cloud.DataOperationResult<T>> => {
  try {
    if (!options?.forceRefresh) {
      // 先尝试从本地缓存获取
      const localData = Taro.getStorageSync(localKey)
      if (localData) {
        return { success: true, data: localData }
      }
    }

    // 从云数据库获取
    const result = await Taro.cloud.callFunction({
      name: 'getData',
      data: {
        collection,
        userId
      }
    })

    // 保存到本地缓存
    const cloudData: T = (result.result as { data: any }).data || []
    if (cloudData) {
      Taro.setStorageSync(localKey, cloudData)
      return { success: true, data: cloudData }
    }

    return { success: false, error: '未找到数据' }
  } catch (error) {
    console.error(`获取${collection}数据失败:`, error)
    return { success: false, error }
  }
}

/**
 * 数据处理器接口
 */
interface DataHandler<T> {
  save: (userId: string, data: T) => Promise<Cloud.SaveOperationResult>
  fetch: (userId: string ) => Promise<Cloud.DataOperationResult<T>>
  // ... 其他方法
  // update?: (userId: string, id: string, data: Partial<T>) => Promise<Cloud.SaveOperationResult>
  // delete?: (userId: string, id: string) => Promise<Cloud.SaveOperationResult>
}

/**
 * 创建数据操作处理器
 * @param collection 云数据库集合名称
 * @param localKeyPrefix 本地存储key前缀
 * @returns 数据处理器对象
 */
export const createDataHandler = <T>(collection: string, localKeyPrefix: string): DataHandler<T> => {
  return {
    save: (userId: string, data: T) =>
      _saveData<T>(collection, userId, data, `${localKeyPrefix}_${userId}`),
    fetch: (userId: string) =>
      _fetchData<T>(collection, userId, `${localKeyPrefix}_${userId}`, { forceRefresh: true }),
  }
}

// 创建各个数据类型的处理器
export const anniversaryHandler = createDataHandler<MiniProgram.AnniversaryItem[]>('anniversaries', 'anniversaries')
export const assetCostHandler = createDataHandler<MiniProgram.AssetItem[]>('asset_cost', 'asset_cost')