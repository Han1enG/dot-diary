const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { collection, userId } = event
  
  try {
    const result = await db.collection(collection).doc(userId).get()
    if (result.data) {
      return { success: true, data: result.data.items }
    }
    return { success: false, error: '未找到数据' }
  } catch (error) {
    console.error('获取数据失败:', error)
    return { success: false, error }
  }
}