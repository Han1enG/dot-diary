import cloud from 'wx-server-sdk'
cloud.init()

const db = cloud.database()

exports.main = async (event, context) => {
  const { collection, userId, data } = event
  
  try {
    // 检查文档是否存在
    const checkRes = await db.collection(collection).doc(userId).get()
    
    if (checkRes.data) {
      // 更新文档
      await db.collection(collection).doc(userId).update({
        data: {
          items: data,
          updatedAt: db.serverDate()
        }
      })
    } else {
      // 创建新文档
      await db.collection(collection).doc(userId).set({
        data: {
          items: data,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('保存失败:', error)
    return { success: false, error }
  }
}